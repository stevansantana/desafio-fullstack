import { Router } from "express";
import { getChildren, getChildById } from "../controllers/childController";

const router = Router();

router.get("/children", getChildren);
router.get("/children/:id", getChildById);

export default router;
