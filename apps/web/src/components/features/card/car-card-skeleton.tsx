const ShimmerBlock = ({ className }: { className?: string }) => (
  <div className={`shimmer rounded ${className ?? ""}`} />
);

export default function CarCardSkeleton() {
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Image Placeholder */}
      <div className="relative h-78 overflow-hidden p-4">
        <ShimmerBlock className="h-full w-full rounded-lg" />

        {/* Top Overlay — Badge + Icons */}
        <div className="absolute top-0 right-0 left-0 flex items-start justify-between p-4">
          <ShimmerBlock className="h-6 w-24 rounded" />
          <div className="flex gap-1">
            <ShimmerBlock className="h-9 w-9 rounded-full" />
            <ShimmerBlock className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 pb-3">
        {/* Divider */}
        <div className="h-px bg-black opacity-10" />

        {/* Car Name + Price */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <ShimmerBlock className="h-4 w-36" />
            <ShimmerBlock className="h-3.5 w-24" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <ShimmerBlock className="h-3 w-14" />
            <ShimmerBlock className="h-6 w-20" />
          </div>
        </div>

        {/* Mileage + Payment */}
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-4 w-28" />
          <ShimmerBlock className="h-4 w-24" />
        </div>

        {/* Divider */}
        <div className="h-px bg-black opacity-10" />

        {/* Exterior Color */}
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-4 w-16" />
          <div className="flex items-center gap-3">
            <ShimmerBlock className="h-4 w-20" />
            <ShimmerBlock className="h-6 w-6 rounded" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-black opacity-10" />

        {/* Interior Color */}
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-4 w-14" />
          <div className="flex items-center gap-3">
            <ShimmerBlock className="h-4 w-16" />
            <ShimmerBlock className="h-6 w-6 rounded" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-black opacity-10" />

        {/* Match Badge + Refine Search */}
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-6 w-24 rounded" />
          <ShimmerBlock className="h-4 w-28" />
        </div>

        {/* Divider */}
        <div className="h-px bg-black opacity-10" />

        {/* Dealer Info */}
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-4 w-32" />
          <ShimmerBlock className="h-4 w-16" />
        </div>

        {/* Divider */}
        <div className="h-px bg-black opacity-10" />

        {/* Features */}
        <div className="flex items-center justify-between gap-2 px-2 sm:gap-4 sm:px-4">
          <ShimmerBlock className="h-4 w-18 flex-1" />
          <ShimmerBlock className="h-4 w-18 flex-1" />
          <ShimmerBlock className="h-4 w-18 flex-1" />
        </div>
      </div>
    </div>
  );
}
