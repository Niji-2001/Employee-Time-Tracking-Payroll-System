import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";
import { useNavigate } from "react-router-dom";

function LeaveCreate() {
  const [LeaveTypes, setLeaveTypes] = useState([]);
  const [LeaveType, setLeaveType] = useState();
  const [reason, setreason] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/settings/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setLeaveTypes(result.leave_types);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newEmployee = {
      leave_type: LeaveType,
      from_date: fromdate,
      to_date: todate,
      reason: reason,
    };

    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/leave/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEmployee),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Employee created successfully:", data);
        navigate("/employee-leave");
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
            <h3 className="page-title">Assign Leave</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/counselor-add">Assign Leave</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Assign Leave
                </li>
              </ol>
            </nav>
          </div>

          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <p className="card-description"></p>
                  <form className="forms-sample" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label for="exampleSelectGender">Leave Type </label>
                      <select
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select Leave Type</option>
                        {LeaveTypes.map((leave) => {
                          return <option>{leave}</option>;
                        })}
                      </select>
                    </div>
                    <div className="form-group">
                      <label for="exampleTextarea1">From Date</label>
                      <input
                        onChange={(e) => setfromdate(e.target.value)}
                        type="date"
                        className="form-control"
                        id="exampleInputDate"
                      />
                    </div>
                    <div className="form-group">
                      <label for="exampleTextarea1">To Date</label>
                      <input
                        onChange={(e) => settodate(e.target.value)}
                        type="date"
                        className="form-control"
                        id="exampleInputDate"
                      />
                    </div>{" "}
                    <div className="form-group">
                      <label for="exampleInputUsername1">Reason</label>
                      <input
                        onChange={(e) => setreason(e.target.value)}
                        type="text"
                        className="form-control"
                        id="exampleInputUsername1"
                        placeholder="Reason"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mr-2">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default LeaveCreate;
