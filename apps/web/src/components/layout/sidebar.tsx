/**
 * Sidebar - Server Component
 * Sidebar navigation (can be used for filters, categories, etc.)
 */
export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="w-64 border-r bg-muted/40 p-6">
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        {children}
      </div>
    </aside>
  );
}
