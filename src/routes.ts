import { Router } from "express";
import driverRouter from "./modules/driver/driver.route";

const router = Router();

console.log("Setting up routes...");
// Drivers
router.use("/drivers", driverRouter);

export default router;
