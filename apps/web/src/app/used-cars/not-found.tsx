import Link from "next/link";
import { usedCarsMessages } from "~/lib/messages/used-cars";

/**
 * Not-found page for the /used-cars segment.
 * Rendered when `notFound()` is called from VDP or SRP pages.
 */
export default function UsedCarsNotFound() {
  const { vdp } = usedCarsMessages;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-bold text-4xl">{vdp.notFoundTitle}</h1>
      <p className="max-w-md text-muted-foreground">{vdp.notFoundDescription}</p>
      <div className="flex gap-3">
        <Link
          className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary-hover"
          href="/used-cars"
        >
          {vdp.searchCta}
        </Link>
        <Link className="rounded-md border px-4 py-2 font-medium text-sm hover:bg-accent" href="/">
          {vdp.homeCta}
        </Link>
      </div>
    </main>
  );
}
