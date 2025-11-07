import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/roles.middleware.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

const router = express.Router();

// GET - View settings
router.get("/", protect, getSettings);

// POST - Create or update settings
router.post("/", protect, authorizeRoles("hr_admin"), updateSettings);

export default router;
