import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SearchWrapper } from "~/components/layout/search";
import { getUsedCarsPageMetadata } from "~/lib/messages/used-cars";
import { ROUTES } from "~/lib/routes/constants";
import { buildUsedCarsPath, parseUsedCarsParams, type UsedCarsRoute } from "~/lib/routes/used-cars";
import { getVehicleBundleFromApi } from "~/services/vdp-api";
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

function getRequestOrigin(requestHeaders: Headers): string {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to resolve request host for VDP API fetch");
  }

  return `${proto}://${host}`;
}

function buildProxyHeaders(requestHeaders: Headers): Record<string, string> {
  const forwarded: Record<string, string> = {};

  const passthroughHeaders = ["cookie", "user-agent", "accept-language", "referer"] as const;
  for (const name of passthroughHeaders) {
    const value = requestHeaders.get(name);
    if (value) {
      forwarded[name] = value;
    }
  }

  return forwarded;
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
    const requestHeaders = await headers();
    const apiOptions = {
      baseUrl: getRequestOrigin(requestHeaders),
      headers: buildProxyHeaders(requestHeaders),
    };
    const { vinData, vehicleData } = await getVehicleBundleFromApi(route.vin, apiOptions);

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
