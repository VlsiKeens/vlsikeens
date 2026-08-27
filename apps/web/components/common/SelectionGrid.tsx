import type { ReactNode } from "react";

interface SelectionGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export default function SelectionGrid({
  children,
  columns = 2,
}: SelectionGridProps) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid gap-5 ${gridClass}`}>
      {children}
    </div>
  );
}
