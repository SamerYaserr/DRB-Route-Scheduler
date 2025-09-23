import { RequestHandler } from "express";
import { CreateRoutePayload } from "./route.type";
import routeService from "./route.service";
import { sendResponse } from "../../utils/response";
import { HttpStatus } from "../../enum/httpStatus.enum";

export const createRoute: RequestHandler = async (req, res) => {
  const payload: CreateRoutePayload = { ...req.body };

  const result = await routeService.createRoute(payload);

  return sendResponse(res, {
    statusCode: HttpStatus.Created,
    message: "Route created successfully.",
    data: result,
  });
};
