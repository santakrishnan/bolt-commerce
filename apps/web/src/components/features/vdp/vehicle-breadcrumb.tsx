import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { capitalize } from "~/lib/formatters";
import type { VdpParams } from "~/lib/routes";
import { ROUTES } from "~/lib/routes/constants";

export interface VehicleBreadcrumbListProps {
  slugParams: VdpParams;
}

export const VehicleBreadcrumbList: React.FC<VehicleBreadcrumbListProps> = ({ slugParams }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="hidden gap-[var(--spacing-sm)] text-sm md:flex">
        <BreadcrumbItem>
          <BreadcrumbPage
            style={{
              fontWeight: "var(--font-weight-normal)",
              color: "var(--color-states-disabled-foreground)",
            }}
          >
            {slugParams.year}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Image
            alt="Breadcrumb separator"
            aria-hidden="true"
            className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
            height={12}
            src="/images/vdp/vdp_arrow_right_gray.svg"
            width={12}
          />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            style={{
              fontWeight: "var(--font-weight-normal)",
              color: "var(--color-states-disabled-foreground)",
            }}
          >
            <Link href={`${ROUTES.USED_CARS}/${slugParams.make}`}>
              {capitalize(slugParams.make)}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Image
            alt="Breadcrumb separator"
            aria-hidden="true"
            className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
            height={12}
            src="/images/vdp/vdp_arrow_right_gray.svg"
            width={12}
          />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            style={{
              fontWeight: "var(--font-weight-normal)",
              color: "var(--color-states-disabled-foreground)",
            }}
          >
            <Link href={`${ROUTES.USED_CARS}?make=${slugParams.make}&model=${slugParams.model}`}>
              {capitalize(slugParams.model)}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Image
            alt="Breadcrumb separator"
            aria-hidden="true"
            className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
            height={12}
            src="/images/vdp/vdp_arrow_right_gray.svg"
            width={12}
          />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage
            style={{
              fontWeight: "var(--font-weight-normal)",
              color: "var(--color-states-disabled-foreground)",
            }}
          >
            {slugParams.trimSlug ? slugParams.trimSlug.toUpperCase() : ""}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Image
            alt="Breadcrumb separator"
            aria-hidden="true"
            className="mt-[calc(var(--spacing-2xs)/2)] h-[12px] w-[12px]"
            height={12}
            src="/images/vdp/vdp_arrow_right_gray.svg"
            width={12}
          />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage
            style={{
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--color-core-surfaces-foreground)",
            }}
          >
            {slugParams.vin}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
