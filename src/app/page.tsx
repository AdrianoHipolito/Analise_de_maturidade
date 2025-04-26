import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Portal de Análise de Maturidade Empresarial
          </h1>
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Registrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Bem-vindo ao Portal de Análise de Maturidade Empresarial
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Avalie o grau de maturidade da sua empresa em diferentes dimensões
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-700 mb-4">
                  Este portal permite avaliar o grau de maturidade da sua empresa em diferentes dimensões,
                  identificando pontos fortes e oportunidades de melhoria.
                </p>
                <p className="text-gray-700 mb-4">
                  Com base em questionários específicos para cada segmento de negócio, o sistema analisa
                  a maturidade da empresa e fornece recomendações personalizadas para evolução.
                </p>
                <p className="text-gray-700 mb-4">
                  Para começar, faça login ou registre-se no sistema.
                </p>
                <div className="mt-6">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Começar Agora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Portal de Análise de Maturidade Empresarial. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
