import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";
import { Link } from "react-router-dom";

function Leaves() {
  const [leavesList, setLeavesList] = useState([]);
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/leave/my-leaves/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        setLeavesList(result);
      });
  }, []);


  const handleLeaveDelete = async (id) => {

    try {
      const user = JSON.parse(localStorage.getItem("userdata"));
      const token = user?.token;

      const response = await fetch(`https://employee-time-tracking-payroll-system-3.onrender.com/api/leave/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {

        // setRefresh(pre=>pre+1)
        window.location.reload()
      }
      else {
        console.error("error");

      }
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };
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
                  <div className="row">
                    <div className="col justify-content-end d-flex">
                      <Link
                        to="/leave-add"
                        className="btn btn-success btn-rounded btn-fw "
                      >
                        New Leave
                      </Link>
                    </div>
                  </div>

                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> Leave Date</th>
                        <th> Leave status </th>
                        <th> Leave Type </th>
                        <th>Action</th>
                      </tr>
                      {leavesList.map((leaves) => {
                        return (
                          <tr>
                            <th>
                              {leaves.from_date.substring(0, 10)} -
                              {leaves.to_date.substring(0, 10)}
                            </th>
                            <th> {leaves.status} </th>
                            <th> {leaves.leave_type} </th>
                            {/* <th><button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleLeaveDelete(leaves._id)}
                            >
                              Delete
                            </button></th> */}

                            <th>
                              {leaves.status !== "approved" && leaves.status !== "rejected" ? (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleLeaveDelete(leaves._id)}
                                >
                                  Delete
                                </button>
                              ) : (
                                <p>na</p>
                              )}

                            </th>
                          </tr>
                        );
                      })}
                    </thead>
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

export default Leaves;
