import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";

function EmployeeAttendance() {
  const [timesheet, setTimesheet] = useState([]);


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userdata"));
        const token = user?.token;
       
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
  }, []);
 
  return (
    <AdminLayout>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title">Attendence sheet</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Employee</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Employee Attendence
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

export default EmployeeAttendance;
