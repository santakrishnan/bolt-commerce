interface HomeHeroTitleProps {
  title?: string;
  showSubtitle?: boolean;
  className?: string;
}
export function HomeHeroTitle({ title, showSubtitle = true, className = "" }: HomeHeroTitleProps) {
  return (
    <div className="space-y-4">
      <h1
        className={`text-center font-bold text-[length:var(--font-size-2xl)] text-[var(--color-core-surfaces-inverse-foreground)] uppercase leading-tight tracking-tight md:text-left md:text-[length:var(--font-size-4xl)] lg:text-left lg:text-[length:var(--font-size-4xl)] lg:leading-none ${className}`}
      >
        {title ?? (
          <>
            <span className="block">FIND YOUR</span>
            <span className="block">NEXT VEHICLE</span>
          </>
        )}
      </h1>
      {showSubtitle && (
        <p className="text-center text-[length:var(--font-size-sm)] text-[var(--color-core-surfaces-inverse-foreground)]/90 md:text-left md:text-[length:var(--font-size-lg)] md:text-base lg:text-left lg:text-base">
          With Transparent Pricing And Trusted Quality
        </p>
      )}
    </div>
  );
}
