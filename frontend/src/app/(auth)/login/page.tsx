export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mesa de Servicio TI</h1>
          <p className="text-gray-500 mt-1">Ingresa a tu cuenta institucional</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
            <input type="email" placeholder="usuario@uts.edu.co" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          </div>
          <button className="w-full bg-green-800 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
