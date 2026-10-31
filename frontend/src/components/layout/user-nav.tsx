"use client";

export function UserNav() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-[var(--ink)]">Carlos Mejía</p>
        <p className="text-xs text-[var(--muted)]">Líder TIC</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-[var(--low-bg)] flex items-center justify-center text-[var(--selva-500)] font-semibold text-sm">
        CM
      </div>
    </div>
  );
}
