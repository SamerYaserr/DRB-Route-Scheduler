import { Driver } from "../driver/driver.type";
import { Route } from "../route/route.type";

export type Assignment = {
  id?: string;
  driverId?: string;
  driver?: Driver;
  routeId?: string;
  route?: Route;
  assignedAt?: Date;
  completedAt?: Date;
};
