import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SearchWrapper } from "~/components/layout/search";
import { getVdpPageData } from "~/lib/data/vehicle";
import { getUsedCarsPageMetadata } from "~/lib/messages/used-cars";
import { buildUsedCarsPath, parseUsedCarsParams, type UsedCarsRoute } from "~/lib/routes/used-cars";
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
  const { params: segments } = await params;
  const { q: initialSearchQuery } = await searchParams;
  const route = resolveRoute(segments);

  // Canonical URL enforcement — redirect if casing differs
  const canonicalPath = buildUsedCarsPath(route);
  const currentPath = segments ? `/used-cars/${segments.join("/")}` : "/used-cars";
  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  // ── Details (VDP) ──
  if (route.type === "details") {
    const pageData = await getVdpPageData(route.vin);
    return (
      <UsedCarsDetails
        make={route.make}
        model={route.model}
        pageData={pageData}
        trim={route.trim}
        vin={route.vin}
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
