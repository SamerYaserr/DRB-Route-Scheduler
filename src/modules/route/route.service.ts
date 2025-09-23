import prisma from "../../config/prisma.config";
import logger from "../../config/logger.config";
import APIError from "../../utils/APIError";
import { HttpStatus } from "../../enum/httpStatus.enum";
import { CreateRoutePayload, ScoreWeights } from "./route.type";
import { RouteStatus, Prisma } from "@prisma/client";

const DEFAULT_WEIGHTS: ScoreWeights = {
  license: 0.4,
  availability: 0.3,
  workload: 0.15,
  lru: 0.1,
  proximity: 0.05,
};

type CandidateScore = {
  driverId: string;
  score: number;
  details: any;
  driver: any;
};

class RouteService {
  private normalize(value: number, min: number, max: number) {
    if (max <= min) return 0;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  private haversineDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async createRoute(
    payload: CreateRoutePayload,
    weights: ScoreWeights = DEFAULT_WEIGHTS
  ) {
    try {
      const route = await prisma.route.create({ data: payload });

      const assignResult = await this.assignDriverToRoute(route.id, weights);

      route.status = assignResult
        ? RouteStatus.assigned
        : RouteStatus.unassigned;

      logger.info("Route created", { routeId: route.id });
      return {
        route: route,
        assignedDriver: assignResult
          ? {
              id: assignResult.driver.id,
              name: assignResult.driver.name,
              scoreDetails: assignResult.scoreDetails,
              assignment: assignResult.assignment,
            }
          : null,
      };
    } catch (err: any) {
      logger.error("Failed to create route", err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new APIError(
          "Database error while creating route",
          HttpStatus.InternalServerError
        );
      }
      throw new APIError(
        "Failed to create route",
        HttpStatus.InternalServerError
      );
    }
  }

  async assignDriverToRoute(
    routeId: string,
    weights: ScoreWeights = DEFAULT_WEIGHTS
  ) {
    const route = await prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throw new APIError("Route not found", HttpStatus.NotFound);
    }

    const candidateDrivers = await prisma.driver.findMany({
      where: {
        availability: true,
      },
    });

    if (!candidateDrivers.length) return null;

    const totals = candidateDrivers.map((d) => d.totalAssignments ?? 0);
    const minTotal = totals.length ? Math.min(...totals) : 0;
    const maxTotal = totals.length ? Math.max(...totals) : minTotal;

    const now = new Date();
    const secondsSinceLastList = candidateDrivers.map((d) =>
      d.lastAssignedAt
        ? (now.getTime() - new Date(d.lastAssignedAt).getTime()) / 1000
        : Number.POSITIVE_INFINITY
    );
    const finiteSeconds = secondsSinceLastList.filter(Number.isFinite);
    const minLRU = finiteSeconds.length ? Math.min(...finiteSeconds) : 0;
    const maxLRU = finiteSeconds.length ? Math.max(...finiteSeconds) : minLRU;

    const PROXIMITY_CAP_KM = 100;

    const scored: CandidateScore[] = [];

    for (const d of candidateDrivers) {
      const active = await prisma.assignment.findFirst({
        where: { driverId: d.id, finishedAt: null },
      });
      if (active) continue;

      if (route.requiredLicense && route.requiredLicense !== d.licenseType)
        continue;

      const licenseMatch = route.requiredLicense
        ? d.licenseType === route.requiredLicense
          ? 1
          : 0
        : 1;
      const availability = d.availability ? 1 : 0;

      const total = d.totalAssignments ?? 0;
      const workloadScore =
        1 - this.normalize(total, minTotal, maxTotal || minTotal + 1);

      let lruScore = 0;
      if (d.lastAssignedAt) {
        const s = (now.getTime() - new Date(d.lastAssignedAt).getTime()) / 1000;
        lruScore = this.normalize(s, minLRU || 0, maxLRU || minLRU || 1);
      } else {
        lruScore = 1;
      }

      let proximityScore = 0.5;
      if (
        d.lat != null &&
        d.lng != null &&
        route.startLat != null &&
        route.startLng != null
      ) {
        const dist = this.haversineDistanceKm(
          d.lat,
          d.lng,
          route.startLat,
          route.startLng
        );
        const capped = Math.min(dist, PROXIMITY_CAP_KM);
        proximityScore = 1 - capped / PROXIMITY_CAP_KM;
      }

      const score =
        licenseMatch * weights.license +
        availability * weights.availability +
        workloadScore * weights.workload +
        lruScore * weights.lru +
        proximityScore * weights.proximity;

      scored.push({
        driverId: d.id,
        score,
        details: {
          licenseMatch,
          availability,
          workloadScore,
          lruScore,
          proximityScore,
        },
        driver: d,
      });
    }

    if (!scored.length) return null;

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    try {
      const created = await prisma.$transaction(async (tx) => {
        const assignment = await tx.assignment.create({
          data: { driverId: best.driverId, routeId: routeId },
        });

        await tx.driver.update({
          where: { id: best.driverId },
          data: {
            availability: false,
            lastAssignedAt: new Date(),
            totalAssignments: { increment: 1 },
          },
        });

        await tx.route.update({
          where: { id: routeId },
          data: { status: "assigned" },
        });

        return assignment;
      });

      return {
        driver: best.driver,
        assignment: created,
        scoreDetails: best.details,
      };
    } catch (err) {
      logger.error("Failed during assignment transaction", err);
      throw new APIError(
        "Failed to assign driver to route",
        HttpStatus.InternalServerError
      );
    }
  }
}

export default new RouteService();
