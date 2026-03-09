import { capitalize, formatSlugLabel } from "~/lib/formatters";
import type { UsedCarsRoute } from "~/lib/routes/used-cars";

export const usedCarsMessages = {
  vdp: {
    notFoundTitle: "Vehicle Not Found",
    notFoundDescription:
      "The vehicle you're looking for doesn't exist or the URL is invalid. Please check the URL and try again.",
    searchCta: "Search Used Cars",
    homeCta: "Go Home",
  },
  segmentError: {
    title: "Something went wrong",
    description: "We couldn't load the vehicle information. Please try again.",
    retryCta: "Try again",
  },
  page: {
    defaultTitle: "Used Cars for Sale",
  },
  srp: {
    noResults: {
      defaultTitle: "No used cars available right now",
      defaultHint: "Please check back soon.",
      queryHint: "Try a different keyword, make, model, or trim.",
      filtersTitle: "No VLP results match the selected filters",
      filtersHint: "Try removing a few filters and search again.",
      queryTitle: (query: string) => `No VLP results found for "${query}"`,
    },
  },
} as const;

export function getUsedCarsSrpNoResultsMessage(params: {
  query: string;
  hasActiveFilters: boolean;
}): {
  title: string;
  hint: string;
} {
  const trimmedQuery = params.query.trim();

  if (trimmedQuery) {
    return {
      title: usedCarsMessages.srp.noResults.queryTitle(trimmedQuery),
      hint: usedCarsMessages.srp.noResults.queryHint,
    };
  }

  if (params.hasActiveFilters) {
    return {
      title: usedCarsMessages.srp.noResults.filtersTitle,
      hint: usedCarsMessages.srp.noResults.filtersHint,
    };
  }

  return {
    title: usedCarsMessages.srp.noResults.defaultTitle,
    hint: usedCarsMessages.srp.noResults.defaultHint,
  };
}

export function getUsedCarsPageTitle(route: UsedCarsRoute): string {
  if (route.type === "details") {
    const trimLabel = route.trim === "-" ? "" : ` ${formatSlugLabel(route.trim)}`;
    return `${route.year} ${capitalize(route.make)} ${capitalize(route.model)}${trimLabel} — VIN ${route.vin}`;
  }

  const { filters } = route;
  if (filters.bodyType) {
    return `Used ${formatSlugLabel(filters.bodyType)} Cars for Sale`;
  }
  if (filters.make && filters.model && filters.trim) {
    return `Used ${capitalize(filters.make)} ${capitalize(filters.model)} ${formatSlugLabel(filters.trim)} for Sale`;
  }
  if (filters.make && filters.model) {
    return `Used ${capitalize(filters.make)} ${capitalize(filters.model)} for Sale`;
  }
  if (filters.make) {
    return `Used ${capitalize(filters.make)} Cars for Sale`;
  }
  return usedCarsMessages.page.defaultTitle;
}

export function getUsedCarsPageMetadata(route: UsedCarsRoute): {
  title: string;
  description: string;
} {
  const title = getUsedCarsPageTitle(route);
  return {
    title,
    description: title,
  };
}
