/**
 * Sidebar - Server Component
 * Sidebar navigation (can be used for filters, categories, etc.)
 */
import { Heading } from "@tfs-ucmp/ui";
export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="w-64 border-r bg-muted/40 p-6">
      <div className="space-y-4">
        <Heading className="text-lg md:text-lg" level={2} weight="semibold">
          Filters
        </Heading>
        {children}
      </div>
    </aside>
  );
}
