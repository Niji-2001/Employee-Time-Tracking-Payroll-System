import { useState } from "react";

function Sidebar() {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("userdata"))
  );

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      {auth.role == "hr_admin" ? (
        <ul className="nav">
         
      
          <li className="nav-item">
            <a className="nav-link" href="/">
              <span className="icon-bg">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </span>
              <span className="menu-title">Employee </span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/payroll">
              <span className="icon-bg">
                <i className="mdi mdi-cube menu-icon"></i>
              </span>
              <span className="menu-title">Payroll</span>
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link"
              data-toggle="collapse"
              href="#ui-basic"
              aria-expanded="false"
              aria-controls="ui-basic"
            >
              <span class="icon-bg">
                <i class="mdi mdi-crosshairs menu-icon"></i>
              </span>
              <span class="menu-title">Settings</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="ui-basic">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="/settings/master-settings">
                    Master settings
                  </a>
                </li>
              </ul>
            </div>
          </li>
 <li className="nav-item">
            <a className="nav-link" href="/employee-attendence">
              <span className="icon-bg">
                <i className="mdi mdi-account-multiple menu-icon"></i>
              </span>
              <span className="menu-title">Employee Attendence</span>
            </a>
          </li>
          <li className="nav-item sidebar-user-actions">
            <div className="user-details sidebar-user-menu">
              <a className="nav-link" onClick={handleLogout}>
                <i className="mdi mdi-logout menu-icon"></i>
                <span className="menu-title">Logout</span>
              </a>
            </div>
          </li>
        </ul>
      ) : auth.role == "manager" ? (
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="/approve-reject-employee-timesheets">
              <span className="icon-bg">
                <i className="mdi mdi-target menu-icon"></i>
              </span>
              <span className="menu-title">Employee timesheets</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/employee-leave-types">
              <span className="icon-bg">
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </span>
              <span className="menu-title">Manage team schedules</span>
            </a>
          </li>
          <li className="nav-item sidebar-user-actions">
            <div className="user-details sidebar-user-menu">
              <a className="nav-link" onClick={handleLogout}>
                <i className="mdi mdi-logout menu-icon"></i>
                <span className="menu-title">Logout</span>
              </a>
            </div>
          </li>
        </ul>
      ) : auth.role == "employee" ? (
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="/">
              <span className="icon-bg">
                <i className="mdi mdi-lock menu-icon"></i>
              </span>
              <span className="menu-title">Employee Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              data-toggle="collapse"
              href="#ui-basic"
              aria-expanded="false"
              aria-controls="ui-basic"
            >
              <span class="icon-bg">
                <i class="mdi mdi-crosshairs-gps menu-icon"></i>
              </span>
              <span class="menu-title">Work</span>
              <i class="menu-arrow"></i>
            </a>
            <div class="collapse" id="ui-basic">
              <ul class="nav flex-column sub-menu">
                <li class="nav-item">
                  {" "}
                  <a class="nav-link" href="/employee-timesheet">
                    Timesheet
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/employee-leave">
              <span className="icon-bg">
                <i className="mdi mdi-lock menu-icon"></i>
              </span>
              <span className="menu-title">Leaves</span>
            </a>
          </li>

          <li className="nav-item sidebar-user-actions">
            <div className="user-details sidebar-user-menu">
              <a className="nav-link" onClick={handleLogout}>
                <i className="mdi mdi-logout menu-icon"></i>
                <span className="menu-title">Logout</span>
              </a>
            </div>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}

export default Sidebar;
