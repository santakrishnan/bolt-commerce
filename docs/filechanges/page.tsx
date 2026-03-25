import { getUsedCarsPageMetadata } from "@config/messages/used-cars";
import { ROUTES } from "@config/routes/constants";
import {
  buildUsedCarsPath,
  parseUsedCarsParams,
  type UsedCarsRoute,
} from "@config/routes/used-cars";
import { SrpShell } from "@features/search/components/srp-shell";
import { VehicleGridSkeleton } from "@features/search/components/vehicle-grid-skeleton";
import { SearchWrapper } from "@features/search/context";
import { VdpSkeleton } from "@features/vdp/components/vdp-skeleton";
import { getVehicleBundleCached } from "@features/vdp/services/vdp-cached";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { UsedCarsDetails } from "./views/details";

interface Props {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<{ q?: string }>;
}

function resolveRoute(segments: string[] | undefined): UsedCarsRoute {
  const route = parseUsedCarsParams(segments);
  if (!route) {
    notFound();
  }
  return route;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { params: segments } = await params;
  const route = resolveRoute(segments);
  const meta = getUsedCarsPageMetadata(route);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, type: "website" },
  };
}

export default async function UsedCarsPage({ params, searchParams }: Props) {
  // Unwrap both promises in parallel
  const [{ params: segments }, { q: initialSearchQuery }] = await Promise.all([
    params,
    searchParams,
  ]);
  const route = resolveRoute(segments);

  // Canonical URL enforcement — redirect if casing differs
  const canonicalPath = buildUsedCarsPath(route);
  const currentPath = segments ? `${ROUTES.USED_CARS}/${segments.join("/")}` : ROUTES.USED_CARS;
  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  // ── Details (VDP) ──
  // Calls cached service functions directly (VIN-only cache key, no headers()).
  // Data is cached per VIN via "use cache" + cacheLife("vdp") in vdp-cached.ts.
  if (route.type === "details") {
    const vehicleBundlePromise = getVehicleBundleCached(route.vin);

    return (
      <Suspense fallback={<VdpSkeleton />}>
        <UsedCarsDetails
          make={route.make}
          model={route.model}
          trim={route.trim}
          vehicleBundlePromise={vehicleBundlePromise}
          vin={route.vin}
          year={route.year}
        />
      </Suspense>
    );
  }

  // ── SRP (Search Results Page) ──
  return (
    <SrpShell initialBodyType={route.filters.bodyType}>
      <Suspense fallback={<VehicleGridSkeleton />}>
        <SearchWrapper
          initialBodyType={route.filters.bodyType}
          initialSearchQuery={initialSearchQuery}
        />
      </Suspense>
    </SrpShell>
  );
}
