import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginValues = { email, password };

    try {
      const response = await fetch("https://employee-time-tracking-payroll-system-3.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginValues),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok && result.token) {
        localStorage.setItem("userdata", JSON.stringify(result));
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert(result.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #74b9ff, #a29bfe)" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "20px" }}
      >
        <div className="card-body">
          <h3 className="text-center mb-4" style={{ color: "#2d3436" }}>
             Login Form
          </h3>

          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                backgroundColor: "#0984e3",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
