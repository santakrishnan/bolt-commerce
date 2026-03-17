import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SearchWrapper } from "~/components/layout/search";
import { getUsedCarsPageMetadata } from "~/lib/messages/used-cars";
import { ROUTES } from "~/lib/routes/constants";
import { buildUsedCarsPath, parseUsedCarsParams, type UsedCarsRoute } from "~/lib/routes/used-cars";
import { fetchVehicleData, fetchVinData } from "~/services/vdp";
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
  if (route.type === "details") {
    const vinData = await fetchVinData(route.vin);
    const vehicleData = await fetchVehicleData(vinData.vehicle.id);
    return (
      <UsedCarsDetails
        make={route.make}
        model={route.model}
        trim={route.trim}
        vehicleData={vehicleData}
        vin={route.vin}
        vinData={vinData}
        year={route.year}
      />
    );
  }

  // ── SRP (Search Results Page) ──
  return (
    <SearchWrapper
      initialBodyType={route.filters.bodyType}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
