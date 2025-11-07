import React, { useEffect, useState } from 'react'
import AdminLayout from '../Component/AdminLayout'
import { Link } from 'react-router-dom'

function EmployeeView() {

  const [employeeview, setEmployee] = useState([])
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    fetch('http://localhost:5000/api/employees').then((res) => res.json()).then((result) => {
      setEmployee(result)
    })
  }, [refresh])


  const employeeDelete = (id) => {
    fetch(`http://localhost:5000/api/employees/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Employee deleted successfully!");
        console.log("Employee deleted");
        setRefresh(pre => pre + 1)

      })
      .catch((err) => {
        console.error("Error deleting employee:", err);
        alert("Failed to delete employee!");
      });
  }
  return (
    <AdminLayout>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title"> Employee Timesheet</h3>
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
                  <div className="row">
                    <div className="col justify-content-end d-flex">
                      <Link
                        to="/employee-add"
                        className="btn btn-success btn-rounded btn-fw "
                      >
                        Employee Add
                      </Link>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto", maxWidth: "100%", margin: "0 auto" }}>

                    <table className="table table-striped" style={{ width: "auto", margin: "0 auto" }}>
                      <thead>
                        <tr>
                          <th>Employee Id</th>

                          <th>Full Name</th>
                          <th>Mobile</th>
                          <th>Date of Birth</th>
                          <th>Gender</th>
                          <th>Address</th>
                          <th>Roles</th>
                          <th>Hourly Wage</th>
                          <th>Email</th>
                          <th>Action</th>





                        </tr>
                      </thead>

                      <tbody>
                        {employeeview.map((items, index) => {
                          return (
                            <tr>
                              <td>{items.employee_id}</td>
                              <td>{items.user.name}</td>
                              <td>{items.mobile_no}</td>

                              <td>{items.dob.substring(0, 10)}</td>
                              <td>{items.gender}</td>

                              <td>{items.address}</td>
                              <td>{items.user.role}</td>
                              <td>{items.hourly_wage}</td>
                              <td>{items.user.email}</td>
                              <td><Link className='btn btn-warning' onClick={() => employeeDelete(items._id)}>Delete</Link></td>
                              <td> <Link className='btn btn-success' to={`/employee-edit/${items._id}`}>Edit</Link></td>


                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EmployeeView