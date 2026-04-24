import { Router } from "express";
import {
  getChildren,
  getChildById,
  getSummary,
} from "../controllers/childController";
import { generateToken } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { reviewChild } from "../controllers/childController";

const router = Router();

router.post("/auth/token", generateToken);
router.get("/children", getChildren);
router.get("/children/:id", getChildById);
router.get("/summary", getSummary);
router.patch("/children/:id/review", authMiddleware, reviewChild);

export default router;
