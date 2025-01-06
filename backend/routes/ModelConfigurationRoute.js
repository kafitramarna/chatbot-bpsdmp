import express from "express";
import ModelConfigurationController from "../controllers/ModelConfigurationController.js";

const router = express.Router();

router.get(
  "/get-model-configuration",
  ModelConfigurationController.getModelConfiguration
);

router.post(
  "/update-model-configuration",
  ModelConfigurationController.updateModelConfiguration
);

export default router;
