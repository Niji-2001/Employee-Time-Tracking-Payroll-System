# Employee-Time-Tracking-Payroll-System
This is a MERN Stack (MongoDB, Express, React, Node.js) based HR &amp; Employee Management System.

**Employee Time Tracking & Payroll System**

This is a MERN Stack (MongoDB, Express, React, Node.js) based HR & Employee Management System.
It includes modules for HR Admin, Manager, and Employee functionalities like attendance tracking, timesheets, leave management, payroll view, and more.

**Project Structure**
|client/       # Frontend (React)
|server/       # Backend (Node.js, Express, MongoDB)

**Install Dependencies**

Client (Frontend)
  cd client
  npm install

Server (Backend)
  cd server
  npm install

**Environment Variables**

Create a .env file inside the server/ folder and add the following:
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key

**Database Seeder**

Before running the server, seed the default HR admin account by running:
  node src/seed/admin.seed.js

This will create a default HR admin:
  Email: admin@minutedesign.com
  Password: Admin@123

**Running the Project**

  Backend (Server):-npm run dev( http://localhost:5000)
  Frontend (Client):- npm run dev(http://localhost:5173)

**User Roles & Flow**

HR Admin
Login using the seeded credentials.
Manage Employees (Add / Edit / Delete)
View Payroll
Manage Attendance
Settings 
Manage Leaves
Manage Roles
Define Working Hours

Manager
HR can assign a user role as Manager
Login as Manager
Manage Employee Timesheets
Manage Team Schedule

Employee
Login as Employee
Perform Clock-In / Clock-Out
View Timesheet
Apply for Leave
