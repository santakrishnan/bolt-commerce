"use client";

import { useEffect, useState } from "react";
import type { VehicleStatusData } from "~/lib/data/vehicle";
import { VehicleDetailsBanner } from "./vehicle-details-banner";

interface VehicleStatusBannersProps {
  status: VehicleStatusData;
}

export function VehicleStatusBanners({ status }: VehicleStatusBannersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="mb-6" style={{ height: "80px" }}>
        {/* Consistent placeholder during hydration */}
      </div>
    );
  }
  // Since only one status is true at a time, render the appropriate banner
  if (status.noLongerAvailable) {
    return (
      <VehicleDetailsBanner
        buttonLabel="Browse Similar Vehicles"
        className="mb-6"
        description="This listing has been removed or the vehicle has been sold. Browse similar vehicles instead."
        imageUrl="/images/vdp/attention_icon.svg"
        title="This Vehicle Is No Longer Available"
      />
    );
  }

  if (status.historyReportPending) {
    return (
      <VehicleDetailsBanner
        buttonLabel="View History Report"
        buttonVariant="outline"
        className="mb-6"
        description="We're getting the vehicle history report. Check back soon."
        imageUrl="/images/vdp/vehicle_report.svg"
        title="Vehicle History Report Pending"
      />
    );
  }

  if (status.inspectionInProgress) {
    return (
      <VehicleDetailsBanner
        className="mb-6"
        description="Our 160-point inspection is in progress. We'll update you with results."
        imageUrl="/images/vdp/inspection_icon.svg"
        title="160-Point Inspection In Progress"
      />
    );
  }

  if (status.limitedPhotos) {
    return (
      <VehicleDetailsBanner
        buttonLabel="Request More Photos"
        buttonVariant="outline"
        className="mb-6"
        description="Limited photos available. Request more details about this vehicle."
        imageUrl="/images/vdp/limited_photos_icon.svg"
        title="Limited Photos Available"
      />
    );
  }

  // No status is true, render nothing
  return null;
}
