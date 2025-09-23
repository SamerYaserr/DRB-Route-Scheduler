import prisma from "../../config/prisma.config";
import { CreateDriverInput, getDriverHistoryPayload } from "./driver.type";
import logger from "../../config/logger.config";
import { HttpStatus } from "../../enum/httpStatus.enum";
import APIError from "../../utils/APIError";

class DriverService {
  async createDriver(payload: CreateDriverInput) {
    const driver = await prisma.driver.create({
      data: {
        ...payload,
      },
    });

    if (!driver) {
      throw new APIError(
        "Failed to create driver",
        HttpStatus.InternalServerError
      );
    }

    logger.info("Driver created with id", driver.id);
    return driver;
  }

  async getDriverHistory(payload: getDriverHistoryPayload) {
    const { driverId } = payload;

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      select: { id: true },
    });

    if (!driver) {
      throw new APIError("Driver not found", HttpStatus.NotFound);
    }

    try {
      const assignments = await prisma.assignment.findMany({
        where: { driverId },
        include: { route: true },
        orderBy: { assignedAt: "desc" },
      });

      logger.info(
        `Fetched ${assignments.length} assignments for driver ${driverId}`
      );
      return assignments;
    } catch (err: any) {
      logger.error("Failed to fetch driver history", err);
      throw new APIError(
        "Failed to fetch driver history",
        HttpStatus.InternalServerError
      );
    }
  }
}

export default new DriverService();
