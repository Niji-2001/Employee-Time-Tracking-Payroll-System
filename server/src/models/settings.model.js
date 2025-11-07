import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    leave_types: {
      type: [String],
      default: ["Sick Leave", "Casual Leave", "Paid Leave"],
    },
    roles: {
      type: [String],
      default: ["employee", "manager"],
    },
    total_work_hours: {
      type: Number,
      default: 8,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
// Ensure "employee" and "manager" roles always exist
settingsSchema.pre("save", function (next) {
  if (!this.roles.includes("employee")) {
    this.roles.push("employee");
  }
  if (!this.roles.includes("manager")) {
    this.roles.push("manager");
  }

  next();
});

// Also handle updates like findOneAndUpdate
settingsSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.roles && Array.isArray(update.roles)) {
    if (!update.roles.includes("employee")) {
      update.roles.push("employee");
    }
    if (!update.roles.includes("manager")) {
      update.roles.push("manager");
    }
    this.setUpdate(update);
  }

  next();
});
