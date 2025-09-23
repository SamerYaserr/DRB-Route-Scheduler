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

export type CreateRoutePayload = {
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedTime: number;
  requiredLicense?: string | null;
  startLat?: number | null;
  startLng?: number | null;
};

export type ScoreWeights = {
  license: number;
  availability: number;
  workload: number;
  lru: number;
  proximity: number;
};

export type AssignResult = {
  driver: {
    id: string;
    name?: string;
  };
  assignment: {
    id: string;
    driverId: string;
    routeId: string;
    assignedAt: Date;
    finishedAt?: Date | null;
  };
  scoreDetails: {
    licenseMatch: number;
    availability: number;
    workloadScore: number;
    lruScore: number;
    proximityScore: number;
  };
} | null;
