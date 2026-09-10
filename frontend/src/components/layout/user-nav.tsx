"use client";

export function UserNav() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-gray-900">Carlos Mejía</p>
        <p className="text-xs text-gray-500">Líder TIC</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-sm">
        CM
      </div>
    </div>
  );
}
