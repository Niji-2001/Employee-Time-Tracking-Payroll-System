import mongoose from "mongoose";

const leaveApplicationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leave_type: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    from_date: {
      type: Date,
      required: true,
    },
    to_date: {
      type: Date,
      required: true,
    },
    is_approved: {
      type: Boolean,
      default: null, // null = pending, true = approved, false = rejected
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approved_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationSchema
);
export default LeaveApplication;
