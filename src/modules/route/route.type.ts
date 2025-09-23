import { RouteStatus } from "@prisma/client";

export type User = {
  id?: string;
  startLocation?: string;
  endLocation?: string;
  distance?: number;
  estimatedTime?: number;
  requiredLicense?: string;
  startLat?: number;
  startLng?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: RouteStatus;
};
