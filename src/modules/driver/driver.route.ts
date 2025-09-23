import express from "express";

import { createDriverZodSchema } from "./driver.validation";
import { createDriver } from "./driver.controller";
import { validate } from "../../middlewares/validation.middleware";

const router = express.Router();

router.post("/", validate(createDriverZodSchema), createDriver);

export default router;
