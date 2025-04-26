import { AuthProvider } from "../lib/auth";
import "./globals.css";

export const metadata = {
  title: "Portal de Análise de Maturidade Empresarial",
  description: "Avalie o grau de maturidade da sua empresa em diferentes dimensões",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
