export default function NuevoEquipoPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Registrar nuevo equipo</h1>
      <p className="text-gray-500 mb-6">Completa la información del nuevo activo tecnológico</p>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {[
          'SECCIÓN 1 — Identificación',
          'SECCIÓN 2 — Adquisición',
          'SECCIÓN 3 — Ubicación',
          'SECCIÓN 4 — Responsabilidad',
          'SECCIÓN 5 — Información adicional',
        ].map((section) => (
          <div key={section} className="border rounded-lg p-4">
            <h2 className="font-semibold text-sm">{section}</h2>
            <div className="text-center py-4 text-gray-400 text-sm">Campos del formulario</div>
          </div>
        ))}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
          <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium">Guardar equipo</button>
        </div>
      </div>
    </div>
  );
}
