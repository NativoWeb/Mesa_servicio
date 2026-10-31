"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthStore, ROLE_LABELS } from "@/stores/auth-store";
import { UserRole } from "@/types/user";
import { useState, useEffect } from "react";

export function Header() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const roleLabel = ROLE_LABELS[(user?.role || "end_user") as UserRole];
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="flex items-center justify-between sticky top-0 z-20 transition-[border-color] duration-200"
      style={{
        height: '68px',
        padding: '0 28px',
        background: 'color-mix(in srgb, var(--canvas) 82%, transparent)',
        backdropFilter: 'saturate(1.6) blur(14px)',
        WebkitBackdropFilter: 'saturate(1.6) blur(14px)',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <div className="flex items-center gap-4">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Sede:{" "}
          <span className="font-medium" style={{ color: 'var(--ink-2)' }}>
            {user?.campus || "Sin asignar"}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="relative flex items-center justify-center transition-colors"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
          }}
        >
          <svg className="w-5 h-5" style={{ color: 'var(--muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--crit, #cf3b35)' }} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-3 border-l px-2 py-1 transition-colors"
            style={{ borderColor: 'var(--line)', borderRadius: '12px' }}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight" style={{ color: 'var(--ink)' }}>{user?.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{roleLabel}</p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white"
              style={{ background: 'var(--selva-500, #1f6a4c)' }}
            >
              {initials}
            </div>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-full mt-1 w-48 z-40 py-1"
                style={{
                  background: 'var(--surface)',
                  borderRadius: '12px',
                  boxShadow: 'var(--sh-2)',
                  border: '1px solid var(--line)',
                }}
              >
                <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--line)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{user?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm transition-colors"
                  style={{ color: 'var(--crit)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--crit-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                >
                  Cerrar sesion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
