import { Response } from "express";

export type APIStatus = "success" | "fail" | "error";

export interface SendResponseOptions<T = unknown> {
  statusCode?: number;
  status?: APIStatus;
  message?: string;
  data?: T;
}

export function sendResponse<T = unknown>(
  res: Response,
  {
    statusCode = 200,
    status = "success",
    message,
    data,
  }: SendResponseOptions<T>
): Response {
  const body: Record<string, unknown> = { status };

  if (typeof message !== "undefined") body.message = message;
  if (typeof data !== "undefined") body.data = data;

  return res.status(statusCode).json(body);
}
