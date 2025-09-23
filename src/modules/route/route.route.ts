import express from "express";

import { createRouteZodSchema } from "./route.validation";
import { createRoute } from "./route.controller";
import { validate } from "../../middlewares/validation.middleware";

const router = express.Router();

router.post("/", validate(createRouteZodSchema), createRoute);

export default router;
