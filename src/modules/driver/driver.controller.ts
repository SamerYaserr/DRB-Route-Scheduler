import { RequestHandler } from "express";

import { CreateDriverInput } from "./driver.type";
import driverService from "./driver.service";
import { sendResponse } from "../../utils/response";
import { HttpStatus } from "../../enum/httpStatus.enum";

export const createDriver: RequestHandler = async (req, res) => {
  const payload: CreateDriverInput = { ...req.body };

  const driver = await driverService.createDriver(payload);

  return sendResponse(res, {
    statusCode: HttpStatus.Created,
    message: "Driver created successfully.",
    data: { driver },
  });
};
