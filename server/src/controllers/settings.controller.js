import Settings from "../models/settings.model.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let { leave_types, roles, total_work_hours } = req.body;
    if (typeof leave_types === "string") {
      leave_types = leave_types
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (typeof roles === "string") {
      roles = roles
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        leave_types,
        roles,
        total_work_hours,
      });
    } else {
      if (leave_types) settings.leave_types = leave_types;
      if (roles) settings.roles = roles;
      if (total_work_hours) settings.total_work_hours = total_work_hours;
    }

    await settings.save();
    res.json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
