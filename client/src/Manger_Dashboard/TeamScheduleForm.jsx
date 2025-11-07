import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../Component/AdminLayout";

function TeamScheduleForm() {
  const [leavesList, setLeavesList] = useState([]);
  const [refresh, setrefresh] = useState(0);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/leave/all/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setLeavesList(result);
      });
  }, [refresh]);
  const handleSubmit = (status, id) => {
    let param = {
      action: status,
    };
    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch(`https://employee-time-tracking-payroll-system-3.onrender.com/api/leave/approve/${id}`, {
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
const approvedLeaves = leavesList.filter(
    (leave) => leave.status === "approved"
  );
  return (
    <AdminLayout>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title"> Leave Accounts</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="employee-leave">Leaves</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Leaves Accounts
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
                        <th> Employee Name</th>
                        <th> Leave Date</th>
                        <th> Leave status </th>
                        <th> Leave Type </th>
                        <th></th>
                        <th></th>
                      </tr>
                      {leavesList.map((leaves) => {
                        return (
                          <tr>
                            <td>{leaves.employee.name}</td>
                            <td>
                              {leaves.from_date.substring(0, 10)} -
                              {leaves.to_date.substring(0, 10)}
                            </td>
                            <td> {leaves.status} </td>
                            <td> {leaves.leave_type} </td>
                            {leaves.status == "pending" ? (
                              <>
                                <td>

                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      handleSubmit("approve", leaves._id)
                                    }
                                  >

                                    Approve
                                  </button>
                                </td>
                                <td>

                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleSubmit("reject", leaves._id)
                                    }
                                  >
                                    Reject
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{leaves.status}</td>
                                <td></td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </thead>
                  </table>
                </div>
              </div>

          
            </div>
          </div>

               <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Who is Off</h5>
                  {approvedLeaves.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {approvedLeaves.map((leave) => (
                        <li key={leave._id} className="list-group-item">
                          <strong>{leave.employee?.name}</strong> 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted mb-0">No one is currently off.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default TeamScheduleForm;
