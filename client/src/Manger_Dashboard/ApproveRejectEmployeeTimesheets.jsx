import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";

function ApproveRejectEmployeeTimesheets() {
  const [timesheet, setTimesheet] = useState([]);
  const [employeename, setName] = useState("");
  const [refresh, setrefresh] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userdata"));
        const token = user?.token;
        setName(user?.name);
        const res = await fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/attendance/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Fetched Timesheet Data:", data);

        if (res.ok) {
          setTimesheet(data);
        } else {
          console.error(data.message || "Failed to fetch timesheet");
        }
      } catch (err) {
        console.error("Status fetch error:", err);
      }
    };
    fetchStatus();
  }, [refresh]);
  const handleSubmit = (status, id) => {
    let param = {
      action: status,
    };
    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch(`https://employee-time-tracking-payroll-system-3.onrender.com/api/attendance/approve/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.json())
      .then((data) => {
        setrefresh((prev) => prev + 1);
        console.log("Employee created successfully:", data);
      })
      .catch((err) => {
        console.error("Error creating employee:", err);
      });
  };
  return (
    <AdminLayout>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title">Timesheet</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Employee</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Employee Timesheet
                </li>
              </ol>
            </nav>
          </div>

          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Employee Name</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Total Hours</th>
                        <th>Overtime Hours</th>
                        <th>Break Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timesheet.length > 0 ? (
                        timesheet.map((item) => (
                          <tr>
                            <td>{new Date(item.date).toLocaleDateString()}</td>
                            <td>{item.employee_name || "N/A"}</td>
                            <td>
                              {item.first_clock_in
                                ? new Date(
                                    item.first_clock_in
                                  ).toLocaleTimeString()
                                : "—"}
                            </td>
                            <td>
                              {item.last_clock_out
                                ? new Date(
                                    item.last_clock_out
                                  ).toLocaleTimeString()
                                : "—"}
                            </td>
                            <td>
                              {item.total_work_hours
                                ? item.total_work_hours.toFixed(2)
                                : 0}
                            </td>
                            <td>
                              {item.overtime_hours
                                ? item.overtime_hours.toFixed(2)
                                : 0}
                            </td>
                            <td>
                              {item.total_break_hours
                                ? item.total_break_hours.toFixed(2)
                                : 0}
                            </td>
                            {item.status == "pending" ? (
                              <>
                                <td>
                                  {" "}
                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      handleSubmit("approve", item._id)
                                    }
                                  >
                                    {" "}
                                    Approve
                                  </button>{" "}
                                </td>
                                <td>
                                  {" "}
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleSubmit("reject", item._id)
                                    }
                                  >
                                    Reject
                                  </button>{" "}
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item.status}</td>
                                <td></td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No timesheet records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ApproveRejectEmployeeTimesheets;
