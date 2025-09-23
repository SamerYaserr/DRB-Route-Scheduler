import { RouteStatus } from "@prisma/client";

import { Assignment } from "../assignment/assignment.type";

export type Route = {
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
  Assignment?: Assignment[];
};
