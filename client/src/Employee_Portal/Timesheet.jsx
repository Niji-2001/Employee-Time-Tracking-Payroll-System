import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";

function Timesheet() {
  const [timesheet, setTimesheet] = useState([]);
  const [employeename, setName] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userdata"));
        const token = user?.token;
        setName(user?.name);
        const res = await fetch(
          "http://localhost:5000/api/attendance/my-logs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
  }, []);

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
                      </tr>
                    </thead>
                    <tbody>
                      {timesheet.length > 0 ? (
                        timesheet.map((item, index) =>
                          item.sessions.map((session, idx) => (
                            <tr>
                              <td>
                                {new Date(item.date).toLocaleDateString()}
                              </td>
                              <td>
                                {item.user?.name || employeename || "N/A"}
                              </td>
                              <td>
                                {session.clock_in_time
                                  ? new Date(
                                      session.clock_in_time
                                    ).toLocaleTimeString()
                                  : "—"}
                              </td>
                              <td>
                                {session.clock_out_time
                                  ? new Date(
                                      session.clock_out_time
                                    ).toLocaleTimeString()
                                  : "—"}
                              </td>
                              <td>
                                {session.duration_hours
                                  ? session.duration_hours.toFixed(2)
                                  : 0}
                              </td>
                            </tr>
                          ))
                        )
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

export default Timesheet;
