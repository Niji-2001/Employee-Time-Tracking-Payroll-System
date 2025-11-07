import User from "../models/user.model.js";
import EmployeeDetail from "../models/employee.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      mobile_no,
      gender,
      dob,
      address,
      hourly_wage,
    } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create employee detail
    const employeeDetail = await EmployeeDetail.create({
      user: user._id,
      mobile_no,
      gender,
      dob,
      address,
      hourly_wage,
    });

    res.status(201).json({
      message: "Employee created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      employee_detail: employeeDetail,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeDetail.find()
      .populate("user", "name email role") // fetch user info
      .sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid employee ID" });

    const employee = await EmployeeDetail.findById(id).populate(
      "user",
      "name email role"
    );

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      role,
      mobile_no,
      gender,
      dob,
      address,
      hourly_wage,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid employee ID" });

    const employee = await EmployeeDetail.findById(id).populate("user");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // Update User fields
    const user = await User.findById(employee.user._id);
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    // Update Employee details
    employee.mobile_no = mobile_no || employee.mobile_no;
    employee.gender = gender || employee.gender;
    employee.dob = dob || employee.dob;
    employee.address = address || employee.address;
    employee.hourly_wage = hourly_wage || employee.hourly_wage;
    await employee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      employee_detail: employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid employee ID" });

    const employee = await EmployeeDetail.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    await User.findByIdAndDelete(employee.user);
    await employee.deleteOne();

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
