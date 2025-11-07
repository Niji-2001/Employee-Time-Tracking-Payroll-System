import AttendanceLog from "../models/attendance.model.js";
import Settings from "../models/settings.model.js";
import EmployeeDetail from "../models/employee.model.js";
import moment from "moment";

/**
 * @desc Clock In / Clock Out toggle
 * @route POST /api/attendance/clock
 * @access Employee
 */
export const handleClock = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Access denied. Employees only." });
    }

    const today = moment().format("YYYY-MM-DD");
    const currentTime = moment();
    console.log(user);

    let attendance = await AttendanceLog.findOne({
      user: user._id,
      date: today,
    });
    const settings = await Settings.findOne();
    const requiredWorkHours = settings?.total_work_hours || 8;

    if (!attendance) {
      console.log("attendance", attendance);
      attendance = await AttendanceLog.create({
        user: user._id,
        date: today,
        sessions: [{ clock_in_time: currentTime }],
      });

      return res.status(201).json({
        message: "Clocked In successfully",
        action: "clock_in",
        attendance,
      });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];

    // CASE 1: Last session ended → new clock in (start new session)
    if (lastSession && lastSession.clock_out_time) {
      attendance.sessions.push({ clock_in_time: currentTime });
    }
    // CASE 2: Last session ongoing → clock out
    else if (lastSession && !lastSession.clock_out_time) {
      lastSession.clock_out_time = currentTime;
      const diffMs = currentTime.diff(moment(lastSession.clock_in_time));
      lastSession.duration_hours = parseFloat(
        (diffMs / (1000 * 60 * 60)).toFixed(2)
      );
    } else {
      attendance.sessions.push({ clock_in_time: currentTime });
    }

    // Recalculate total work & break hours
    let totalWork = 0;
    let totalBreak = 0;

    attendance.sessions.forEach((s) => {
      if (s.duration_hours) totalWork += s.duration_hours;
    });

    // Calculate break between sessions
    for (let i = 1; i < attendance.sessions.length; i++) {
      const prev = attendance.sessions[i - 1];
      const curr = attendance.sessions[i];
      if (prev.clock_out_time && curr.clock_in_time) {
        const breakDiff = moment(curr.clock_in_time).diff(
          moment(prev.clock_out_time)
        );
        totalBreak += breakDiff / (1000 * 60 * 60);
      }
    }

    // Compute overtime
    const overtime =
      totalWork > requiredWorkHours ? totalWork - requiredWorkHours : 0;

    attendance.total_work_hours = parseFloat(totalWork.toFixed(2));
    attendance.total_break_hours = parseFloat(totalBreak.toFixed(2));
    attendance.overtime_hours = parseFloat(overtime.toFixed(2));

    await attendance.save();
    let attendance_len = attendance?.sessions.length;
    let last_attendance = attendance.sessions[attendance_len - 1];
    const action =
      last_attendance && !last_attendance.clock_out_time
        ? "clock_out"
        : "clock_in";

    res.status(200).json({
      message:
        action === "clock_out"
          ? "Clocked Out successfully"
          : "Clocked In successfully",
      action,
      attendance,
    });
  } catch (error) {
    console.error("Clock In/Out error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const getMyLogs = async (req, res) => {
  try {
    const logs = await AttendanceLog.find({ user: req.user._id })
      .select("date sessions total_work_hours total_break_hours overtime_hours")
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching logs", error: error.message });
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const logs = await AttendanceLog.aggregate([
      // Join with user collection
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user_info",
        },
      },
      { $unwind: "$user_info" },

      // Flatten sessions to extract first and last times
      {
        $addFields: {
          first_clock_in: {
            $min: "$sessions.clock_in_time",
          },
          last_clock_out: {
            $max: "$sessions.clock_out_time",
          },
        },
      },

      // Final shape
      {
        $project: {
          _id: 1,
          employee_name: "$user_info.name",
          email: "$user_info.email",
          role: "$user_info.role",
          date: 1,
          first_clock_in: 1,
          last_clock_out: 1,
          total_work_hours: 1,
          total_break_hours: 1,
          overtime_hours: 1,
          status: 1,
        },
      },

      // Sort by employee then date
      { $sort: { employee_name: 1, date: -1 } },
    ]);

    res.json(logs);
  } catch (error) {
    console.error("Error aggregating logs:", error);
    res.status(500).json({
      message: "Error fetching total employee logs",
      error: error.message,
    });
  }
};

export const getAllTimesheets = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "manager" && user.role !== "hr_admin") {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    const { start_date, end_date, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (start_date && end_date) {
      filter.date = { $gte: start_date, $lte: end_date };
    }

    const logs = await AttendanceLog.find(filter)
      .populate("user", "name email role")
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const approveTimesheet = async (req, res) => {
  try {
    const manager = req.user;
    if (manager.role !== "manager" && manager.role !== "hr_admin") {
      return res
        .status(403)
        .json({ message: "Only managers or HR can approve timesheets." });
    }

    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const log = await AttendanceLog.findById(id).populate("user", "name email");
    if (!log) return res.status(404).json({ message: "Timesheet not found" });

    if (log.status !== "pending") {
      return res.status(400).json({ message: "Timesheet already processed." });
    }

    log.is_approved = action === "approve";
    log.status = action === "approve" ? "approved" : "rejected";
    log.approved_by = manager._id;
    log.approved_date = new Date();

    await log.save();

    res.json({
      message: `Timesheet ${log.status} successfully.`,
      log,
    });
  } catch (error) {
    console.error("Approve Timesheet Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getPayroll = async (req, res) => {
  try {
    // Step 1: Get first and last date of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Step 2: Aggregate only logs from the current month
    const attendanceData = await AttendanceLog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$user",
          total_work_hours: { $sum: "$total_work_hours" },
          total_overtime_hours: { $sum: "$overtime_hours" },
          total_break_hours: { $sum: "$total_break_hours" },
        },
      },
    ]);

    // Step 3: Join with employee details
    const payroll = await Promise.all(
      attendanceData.map(async (att) => {
        const employee = await EmployeeDetail.findOne({ user: att._id })
          .populate("user", "name email role")
          .lean();

        if (!employee) return null;

        const totalHours =
          (att.total_work_hours || 0) + (att.total_overtime_hours || 0);
        const totalPay = totalHours * (employee.hourly_wage || 0);

        return {
          employee_id: employee.employee_id,
          name: employee.user.name,
          email: employee.user.email,
          role: employee.user.role,
          hourly_wage: employee.hourly_wage,
          total_work_hours: att.total_work_hours || 0,
          total_break_hours: att.total_break_hours || 0,
          overtime_hours: att.total_overtime_hours || 0,
          total_hours: totalHours,
          total_pay: totalPay.toFixed(2),
        };
      })
    );

    const filtered = payroll.filter((p) => p !== null);

    res.json(filtered);
  } catch (error) {
    console.error("Payroll calculation error:", error);
    res
      .status(500)
      .json({ message: "Error calculating payroll", error: error.message });
  }
};
