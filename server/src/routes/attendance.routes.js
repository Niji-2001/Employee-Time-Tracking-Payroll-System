import express from "express";
import {
  handleClock,
  getMyLogs,
  getAllLogs,
  getAllTimesheets,
  approveTimesheet,
  getPayroll,
} from "../controllers/attendance.controller.js";
import { protect, adminProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/clock", protect, handleClock);
router.get("/my-logs", protect, getMyLogs);
router.get("/all", protect, getAllLogs);
router.get("/", protect, getAllTimesheets);
router.get("/get-payroll", protect, getPayroll);
router.put("/approve/:id", protect, approveTimesheet);

export default router;
