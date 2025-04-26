import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "./db";

// Chave secreta para JWT (deve ser armazenada em variável de ambiente em produção)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Interface para o payload do token JWT
interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

// Função para verificar autenticação
export async function verifyAuth(request: NextRequest) {
  try {
    // Obter token do cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return {
        authenticated: false,
        user: null,
      };
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Buscar usuário no banco de dados
    const userResult = await db
      .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
      .bind(decoded.userId)
      .all();

    if (userResult.results.length === 0) {
      return {
        authenticated: false,
        user: null,
      };
    }

    const user = userResult.results[0];

    return {
      authenticated: true,
      user,
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return {
      authenticated: false,
      user: null,
    };
  }
}

// Função para gerar token JWT
export function generateToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
