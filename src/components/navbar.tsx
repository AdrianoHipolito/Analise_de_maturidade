import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={user ? "/dashboard" : "/"} className="text-xl font-bold text-blue-600">
                Portal de Maturidade
              </Link>
            </div>
            {user && (
              <nav className="ml-6 flex space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/assessments/new"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Nova Avaliação
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Admin
                  </Link>
                )}
              </nav>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Olá, {user.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
