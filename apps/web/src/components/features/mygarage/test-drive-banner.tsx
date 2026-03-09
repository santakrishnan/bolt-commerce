import Image from "next/image";
import type React from "react";

export interface TestDriveBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  imageAlt?: string;
}

export const TestDriveBanner: React.FC<TestDriveBannerProps> = ({
  title = "SCHEDULE A TEST DRIVE",
  description = "Book a test drive at a time that works for you. Choose your preferred model and we'll have it ready when you arrive.",
  buttonText = "Book Your Test Drive",
  onButtonClick,
  imageAlt = "Car rear view for test drive banner",
}) => {
  return (
    <section className="relative flex h-auto w-full flex-col items-stretch overflow-hidden bg-black md:flex-row lg:h-[500px] xl:h-[660px]">
      {/* Full-width gradient overlay spanning both text and image */}
      <div
        className="pointer-events-none absolute inset-0 z-10 hidden md:block"
        style={{ background: "linear-gradient(90deg, #000 35%, rgba(0, 0, 0, 0.00) 65%)" }}
      />
      <div className="mx-auto flex w-full max-w-[var(--container-2xl)] flex-col-reverse items-stretch md:flex-row">
        <div className="z-20 flex shrink-0 flex-col justify-center px-4 py-8 sm:px-6 md:w-[45%] md:py-12 lg:w-[40%] lg:px-12 lg:py-0 xl:w-[38%] xl:px-20">
          <h2 className="mb-3 font-bold text-background text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-nowrap">
            {title}
          </h2>
          <p className="mb-5 text-primary-foreground/80 text-sm md:text-base">{description}</p>
          <button
            className="w-fit rounded-full bg-destructive px-5 py-2 font-semibold text-destructive-foreground text-sm transition-colors duration-200 hover:bg-(--primary-hover)"
            onClick={onButtonClick}
            type="button"
          >
            {buttonText}
          </button>
        </div>
        <div className="relative h-[280px] w-full shrink-0 overflow-hidden sm:h-[350px] md:h-auto md:min-h-[300px] md:w-[55%] md:shrink lg:min-h-full lg:w-[60%] xl:w-[62%]">
          <Image
            alt={imageAlt}
            className="object-cover object-center md:object-right"
            draggable={false}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src="/images/vehicle-toyota/car6.png"
          />
          {/* Mobile gradient at bottom of image */}
          <div
            className="pointer-events-none absolute inset-0 md:hidden"
            style={{ background: "linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0.00) 35%)" }}
          />
        </div>
      </div>
    </section>
  );
};
