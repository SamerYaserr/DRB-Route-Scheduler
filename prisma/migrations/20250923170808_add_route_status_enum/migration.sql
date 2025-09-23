-- CreateEnum
CREATE TYPE "public"."RouteStatus" AS ENUM ('unassigned', 'assigned', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" TEXT NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "requiredLicense" TEXT,
    "startLat" DOUBLE PRECISION,
    "startLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."RouteStatus" NOT NULL DEFAULT 'unassigned',

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Route_createdAt_idx" ON "public"."Route"("createdAt");

-- CreateIndex
CREATE INDEX "Route_status_idx" ON "public"."Route"("status");
