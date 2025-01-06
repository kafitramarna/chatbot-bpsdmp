import express from "express";
import ContentConfigurationController from "../controllers/ContentConfigurationController.js";

const router = express.Router();

router.get(
  "/get-content-configuration",
  ContentConfigurationController.getContentConfiguration
);

router.post(
  "/update-content-configuration",
  ContentConfigurationController.updateContentConfiguration
);

export default router;
