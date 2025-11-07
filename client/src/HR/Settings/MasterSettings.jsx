import React, { useState } from "react";
import AdminLayout from "../../Component/AdminLayout";
import axios from "axios";

function MasterSettings() {
  const [leaves, setLeaves] = useState("");
  const [roles, setRoles] = useState("");
  const [workhours, setWorkhours] = useState("");

  const handleSettings = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    const assignValues = {
      leave_types: leaves,
      roles: roles,
      total_work_hours: workhours,
    };

    axios
      .post("https://employee-time-tracking-payroll-system-3.onrender.com/api/settings/", assignValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setLeaves("")
        setRoles("")
        setWorkhours("")
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <AdminLayout>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title">Settings</h3>
          </div>

          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <form className="forms-sample" onSubmit={handleSettings}>
                    <div className="form-group">
                      <label>Leave Types</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Leave Types "
                        value={leaves}
                        onChange={(e) => setLeaves(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Roles</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Roles"
                        value={roles}
                        onChange={(e) => setRoles(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Total Work Hours</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Total Work Hours"
                        value={workhours}
                        onChange={(e) => setWorkhours(e.target.value)}
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

export default MasterSettings;
