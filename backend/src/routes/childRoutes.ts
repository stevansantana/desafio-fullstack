import { Router } from "express";
import {
  getChildren,
  getChildById,
  getSummary,
} from "../controllers/childController";

const router = Router();

router.get("/children", getChildren);
router.get("/children/:id", getChildById);
router.get("/summary", getSummary);

export default router;
