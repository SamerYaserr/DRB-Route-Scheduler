import { Router } from "express";
import driverRouter from "./modules/driver/driver.route";
import routeRouter from "./modules/route/route.route";

const router = Router();

console.log("Setting up routes...");
// Drivers
router.use("/drivers", driverRouter);

// Routes
router.use("/routes", routeRouter);

export default router;
