import LeaveApplication from "../models/leave.models.js";
import Settings from "../models/settings.model.js";
import moment from "moment";

// Apply for Leave (Employee)
export const applyLeave = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Only employees can apply for leave." });
    }

    const { leave_type, reason, from_date, to_date } = req.body;

    if (!leave_type || !reason || !from_date || !to_date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const settings = await Settings.findOne();
    if (settings && !settings.leave_types.includes(leave_type)) {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    const leave = await LeaveApplication.create({
      employee: user._id,
      leave_type,
      reason,
      from_date,
      to_date,
    });

    res.status(201).json({ message: "Leave applied successfully.", leave });
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Approve / Reject Leave (Manager)
export const approveLeave = async (req, res) => {
  try {
    const manager = req.user;
    if (manager.role !== "manager") {
      return res
        .status(403)
        .json({ message: "Only managers can approve leaves." });
    }

    const { leaveId } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const leave = await LeaveApplication.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Leave already processed." });
    }

    leave.is_approved = action === "approve";
    leave.status = action === "approve" ? "approved" : "rejected";
    leave.approved_by = manager._id;
    leave.approved_date = new Date();

    await leave.save();

    res.json({ message: `Leave ${leave.status} successfully.`, leave });
  } catch (error) {
    console.error("Approve Leave Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all Leaves (Manager / HR)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.find()
      .populate("employee", "name email role")
      .populate("approved_by", "name email role")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leaves", error: error.message });
  }
};

// Get My Leaves (Employee)
export const getMyLeaves = async (req, res) => {
  try {
    const user = req.user;
    const leaves = await LeaveApplication.find({ employee: user._id }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leaves", error: error.message });
  }
};

// Delete Leave
export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await LeaveApplication.findByIdAndDelete(id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};

