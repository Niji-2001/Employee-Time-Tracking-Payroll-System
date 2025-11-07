import express from "express";
import {
  applyLeave,
  approveLeave,
  getAllLeaves,
  getMyLeaves,
    deleteLeave,
} from "../controllers/leave.controller.js";
import {
  protect,
  adminProtect,
  managerProtect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Employee routes
router.post("/apply", protect, applyLeave);
router.get("/my-leaves", protect, getMyLeaves);
router.delete("/:id", protect, deleteLeave);
// Manager routes
router.put("/approve/:leaveId", managerProtect, approveLeave);
router.get("/all", protect, getAllLeaves);

export default router;
