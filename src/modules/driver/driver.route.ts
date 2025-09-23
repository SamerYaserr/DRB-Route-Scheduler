import express from "express";

import {
  createDriverZodSchema,
  getDriverHistoryZodSchema,
} from "./driver.validation";
import { createDriver, getDriverHistory } from "./driver.controller";
import { validate } from "../../middlewares/validation.middleware";

const router = express.Router();

router.post("/", validate(createDriverZodSchema), createDriver);

router.get(
  "/:id/history",
  validate(getDriverHistoryZodSchema),
  getDriverHistory
);

export default router;
