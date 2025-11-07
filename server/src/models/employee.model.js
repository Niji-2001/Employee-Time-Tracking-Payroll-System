import mongoose from "mongoose";
import crypto from "crypto"; // for generating random employee_id

const employeeDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    employee_id: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(3).toString("hex").toUpperCase(),
    },

    mobile_no: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    hourly_wage: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeDetail", employeeDetailSchema);
