import { useState } from "react";

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./Component/AdminLayout";
import ApproveRejectEmployeeTimesheets from "./Manger_Dashboard/ApproveRejectEmployeeTimesheets";
import EmployeeAdd from "./HR/EmployeeAdd";
import Login from "./Auth/Login";
import EmployeeView from "./HR/EmployeeView";
import EmployeeDashboard from "./Employee_Portal/EmployeeDashboard";
import Timesheet from "./Employee_Portal/Timesheet";
import Leaves from "./Employee_Portal/Leaves";
import LeaveCreate from "./Employee_Portal/LeaveCreate";
import MasterSettings from "./HR/Settings/MasterSettings";
import EmployeeEdit from "./HR/EmployeeEdit";
import TeamScheduleForm from "./Manger_Dashboard/TeamScheduleForm";
import Payroll from "./HR/Payroll";
import EmployeeAttendance from "./HR/EmployeeAttendance";
function App() {
  const [auth, setAuth] = useState(
    JSON.parse(localStorage.getItem("userdata"))
  );
  return (
    <BrowserRouter>
      {auth == null ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : auth.role == "hr_admin" ? (
        <Routes>
          <Route path="/" element={<EmployeeView />} />
          <Route path="/employee-add" element={<EmployeeAdd />} />
          <Route path="/employee-edit/:id" element={<EmployeeEdit />} />
          <Route
            path="/settings/master-settings"
            element={<MasterSettings />}
          />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/employee-attendence" element={<EmployeeAttendance />} />

        </Routes>
      ) : auth.role == "manager" ? (
        <Routes>
          <Route path="/" element={<AdminLayout />} />
          <Route
            path="/approve-reject-employee-timesheets"
            element={<ApproveRejectEmployeeTimesheets />}
          />
          <Route path="/employee-leave-types" element={<TeamScheduleForm />} />
        </Routes>
      ) : auth.role == "employee" ? (
        <Routes>
          <Route path="/" element={<EmployeeDashboard />} />
          <Route path="/employee-timesheet" element={<Timesheet />} />
          <Route path="/employee-leave" element={<Leaves />} />
          <Route path="/leave-add" element={<LeaveCreate />} />
        </Routes>
      ) : null}
    </BrowserRouter>
  );
}

export default App;
