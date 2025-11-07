import React, { useEffect, useState } from "react";
import AdminLayout from "../Component/AdminLayout";

function EmployeeDashboard() {
  const [currentTime, setTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [clockIn, setClockIn] = useState("");
  const [isClockedIn, setIsClockedIn] = useState("");
  const [user, setUser] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userdata"));
        const token = user?.token;
        setUser(user);

        const res = await fetch(
          "https://employee-time-tracking-payroll-system-3.onrender.com/api/attendance/my-logs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        // console.log(data, "niji");
        setCurrentDate(data[0].date);
        setClockIn(data[0].sessions[0].clock_in_time);
      } catch (err) {
        console.error("Status fetch error:", err);
      }
    };
    fetchStatus();
    checkIsClockedIn();
  }, [refresh]);

  const handleClock = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userdata"));
      const token = user?.token;

      const res = await fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/attendance/clock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.action);
        if (data.action == "clock_in") {
          sessionStorage.setItem("is-clocked-in", true);
        } else if (data.action == "clock_out") {
          sessionStorage.setItem("is-clocked-in", false);
        }
        setRefresh((prev) => prev + 1);
      } else {
        alert(data.message || "Action failed");
      }
    } catch (error) {
      console.error("Clock Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const checkIsClockedIn = () => {
    const clock_in_status = sessionStorage.getItem("is-clocked-in");
    console.log("clock_in_status", clock_in_status);
    setIsClockedIn(clock_in_status);
  };

  return (
    <AdminLayout>
      <div
        className="container-fluid py-4"
        style={{
          backgroundColor: "#f7f9fc",
          minHeight: "100vh",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center flex-wrap bg-white shadow-sm rounded-3 p-3 px-4"
          style={{ borderLeft: "4px solid #0d6efd" }}
        >
          <h5 className="fw-bold text-dark mb-0">Welcome, {user.name}</h5>

          <div
            className="d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm"
            style={{
              backgroundColor: "#f1f3f6",
              width: "260px",
              height: "93px",
            }}
          >
            <div>
              <h5 className="fw-bold mb-0" style={{ color: "#2d2d2d" }}>
                {currentTime}
              </h5>
              <p className="text-muted mb-1" style={{ fontSize: "13px" }}>
                {currentDate}
              </p>
              <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                Clock In at -{" "}
                <span className="fw-semibold text-dark">{clockIn}</span>
              </p>
            </div>

            <button
              className={`btn fw-semibold text-white px-3 py-2 d-flex align-items-center gap-2 ${
                isClockedIn == "true" ? "btn-danger" : "btn-primary"
              }`}
              onClick={handleClock}
              style={{
                borderRadius: "8px",
                fontSize: "14px",
                height: "40px",
              }}
            >
              <i className="bi bi-box-arrow-right"></i>
              {isClockedIn == "true" ? "Clock Out" : "Clock In"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EmployeeDashboard;
