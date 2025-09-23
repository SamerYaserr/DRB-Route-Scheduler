import prisma from "../../config/prisma.config";
import { CreateDriverInput, Driver } from "./driver.type";
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
}

export default new DriverService();
