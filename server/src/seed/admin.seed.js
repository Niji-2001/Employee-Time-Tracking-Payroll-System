import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Settings from "../models/settings.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    await Settings.create({
      leave_types: ["Sick Leave", "Casual Leave", "Paid Leave"],
      roles: ["employee", "manager"],
      total_work_hours: 8,
    });

    const existingAdmin = await User.findOne({
      email: "admin@minutedesign.com",
    });
    if (existingAdmin) {
      console.log("HR Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: "HR Admin",
      email: "admin@minutedesign.com",
      password: "Admin@123",
      role: "hr_admin",
    });

    console.log("HR Admin created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding HR Admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
