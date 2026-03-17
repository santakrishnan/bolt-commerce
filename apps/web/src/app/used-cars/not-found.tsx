import { Heading } from "@tfs-ucmp/ui";
import Link from "next/link";
import { usedCarsMessages } from "~/lib/messages/used-cars";
import { ROUTES } from "~/lib/routes/constants";

/**
 * Not-found page for the /used-cars segment.
 * Rendered when `notFound()` is called from VDP or SRP pages.
 */
export default function UsedCarsNotFound() {
  const { vdp } = usedCarsMessages;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Heading className="text-4xl md:text-4xl" level={1} weight="bold">
        {vdp.notFoundTitle}
      </Heading>
      <p className="max-w-md text-muted-foreground">{vdp.notFoundDescription}</p>
      <div className="flex gap-3">
        <Link
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary-hover"
          href={ROUTES.USED_CARS}
        >
          {vdp.searchCta}
        </Link>
        <Link
          className="rounded-md border px-4 py-2 font-medium text-sm hover:bg-accent"
          href={ROUTES.HOME}
        >
          {vdp.homeCta}
        </Link>
      </div>
    </main>
  );
}
