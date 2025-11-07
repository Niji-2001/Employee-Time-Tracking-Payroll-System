import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
function EmployeeAdd() {
  const [name, setName] = useState("");
  const [mobile_no, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [role, setrole] = useState("");
  const [hourly_wage, setWages] = useState("");
  const [email, setEmail] = useState("");
  const [rolesList, setRolesList] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/employees/${id}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setName(result.user.name);
        setMobile(result.mobile_no);
        setGender(result.gender);
        setDob(result.dob.substring(0, 10));
        setAddress(result.address);
        setrole(result.user.role);
        setWages(result.hourly_wage);
        setEmail(result.user.email);
      });
    const user = JSON.parse(localStorage.getItem("userdata"));
    const token = user?.token;
    fetch("http://localhost:5000/api/settings/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        setRolesList(result.roles);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newEmployee = {
      name: name,
      email: email,
      role: role,
      mobile_no: mobile_no,
      gender,
      dob,
      address: address,
      hourly_wage: hourly_wage,
    };

    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Employee created successfully:", data);
        navigate("/employee-view");
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
            <h3 className="page-title">Employee Management</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Employee</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Employee Management
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
                      <label for="exampleInputUsername1">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputUsername1"
                        placeholder="Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group ">
                      <label
                        for="exampleInputMobile"
                        className="col-form-label"
                      >
                        Mobile
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputMobile"
                        onChange={(e) => setMobile(e.target.value)}
                        value={mobile_no}
                      />
                    </div>
                    <div className="form-group">
                      <label for="exampleInputUsername1">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        id="exampleInputUsername1"
                        placeholder="Date of Birth"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label for="exampleSelectGender">Gender</label>
                      <select
                        className="form-control"
                        id="exampleSelectGender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label for="exampleTextarea1">Address</label>
                      <textarea
                        className="form-control"
                        id="exampleTextarea1"
                        rows="4"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label for="exampleInputUsername1">Select Role</label>
                      <select
                        onChange={(e) => setrole(e.target.value)}
                        value={role}
                        className="form-control"
                      >
                        <option value="">Select Role</option>
                        {rolesList.map((roleval) => {
                          return <option>{roleval}</option>;
                        })}
                      </select>
                    </div>{" "}
                    <div className="form-group">
                      <label for="exampleInputUsername1">Hourly Wage</label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputUsername1"
                        onChange={(e) => setWages(e.target.value)}
                        value={hourly_wage}
                      />
                    </div>
                    <div className="form-group">
                      <label for="exampleInputEmail1">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-info mr-2">
                      Update
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

export default EmployeeAdd;
