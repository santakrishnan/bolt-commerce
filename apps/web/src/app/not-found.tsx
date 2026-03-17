import { Button, Heading } from "@tfs-ucmp/ui";
import Link from "next/link";
import { ROUTES } from "~/lib/routes/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <Heading className="text-6xl md:text-6xl" level={1} weight="bold">
          404
        </Heading>
        <Heading className="text-2xl md:text-2xl" level={2} weight="semibold">
          Page Not Found
        </Heading>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link href={ROUTES.HOME}>Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
