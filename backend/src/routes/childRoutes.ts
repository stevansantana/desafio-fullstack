import { Router } from "express";
import { getChildren } from "../controllers/childController";

const router = Router();

router.get("/children", getChildren);

export default router;
