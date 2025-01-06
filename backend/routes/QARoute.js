import express from "express";
import QAController from "../controllers/QAController.js";

const router = express.Router();

router.get("/get-qa-all", QAController.getAllQA);
router.get("/get-qa/:id", QAController.getQAById);
router.post("/create-qa", QAController.createQA);
router.put("/update-qa/:id", QAController.updateQA);
router.delete("/delete-qa/:id", QAController.deleteQA);

export default router;
