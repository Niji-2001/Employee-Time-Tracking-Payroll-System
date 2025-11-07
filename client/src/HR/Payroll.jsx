import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";

function Payroll() {
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userdata"));
        const token = user?.token;
        const res = await fetch(
          "http://localhost:5000/api/attendance/get-payroll",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        console.log("Fetched Timesheet Data:", data);

        if (res.ok) {
          setPayroll(data);
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
            <h3 className="page-title">Payroll Summary</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Employee</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Payroll
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
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Hourly Wage</th>
                        <th>Total Hours</th>
                        <th>Overtime</th>
                        <th>Break Hours</th>
                        <th>Total Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.length > 0 ? (
                        payroll.map((emp) => (
                          <tr key={emp.employee_id}>
                            <td>{emp.employee_id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>₹{emp.hourly_wage}</td>
                            <td>{emp.total_work_hours.toFixed(2)}</td>
                            <td>{emp.total_break_hours.toFixed(2)}</td>
                            <td>{emp.overtime_hours.toFixed(2)}</td>
                            <td>
                              <b>₹{emp.total_pay}</b>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">
                            No payroll data available.
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

export default Payroll;
