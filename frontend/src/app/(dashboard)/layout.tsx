export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar placeholder */}
        <aside className="w-64 min-h-screen bg-gradient-to-b from-green-950 to-green-900 text-white p-4 hidden lg:block">
          <div className="mb-8">
            <h2 className="text-lg font-bold">Mesa de Servicio</h2>
            <p className="text-green-300 text-xs">Unidades Tecnológicas</p>
          </div>
          <nav className="space-y-1 text-sm">
            <p className="text-green-400 text-xs uppercase tracking-wider mb-2">Principal</p>
            <a href="#" className="block py-2 px-3 rounded-lg bg-green-800/50">Dashboard</a>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1">
          <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Usuario</span>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium text-sm">U</div>
            </div>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
