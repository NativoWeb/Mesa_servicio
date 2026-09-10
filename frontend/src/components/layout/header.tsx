"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthStore, ROLE_LABELS } from "@/stores/auth-store";
import { UserRole } from "@/types/user";
import { useState } from "react";

export function Header() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const roleLabel = ROLE_LABELS[(user?.role || "end_user") as UserRole];
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">
          Sede:{" "}
          <span className="font-medium text-gray-700">
            {user?.campus || "Sin asignar"}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-3 border-l hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-gray-500">{roleLabel}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-sm">
              {initials}
            </div>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border z-40 py-1">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
