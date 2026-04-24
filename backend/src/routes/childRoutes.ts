import { Router } from "express";
import {
  getChildren,
  getChildById,
  getSummary,
} from "../controllers/childController";
import { generateToken } from "../controllers/authController";

const router = Router();

router.post("/auth/token", generateToken);
router.get("/children", getChildren);
router.get("/children/:id", getChildById);
router.get("/summary", getSummary);

export default router;
