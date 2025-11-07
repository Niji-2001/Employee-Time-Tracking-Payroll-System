import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    clock_in_time: { type: Date },
    clock_out_time: { type: Date },
    duration_hours: { type: Number, default: 0 },
  },
  { _id: false }
);

const attendanceLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    sessions: [sessionSchema],
    total_work_hours: { type: Number, default: 0 },
    total_break_hours: { type: Number, default: 0 },
    overtime_hours: { type: Number, default: 0 },
    is_approved: { type: Boolean, default: null }, // null = pending, true = approved, false = rejected
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approved_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

attendanceLogSchema.index({ user: 1, date: 1 }, { unique: true });

const AttendanceLog = mongoose.model("AttendanceLog", attendanceLogSchema);
export default AttendanceLog;
