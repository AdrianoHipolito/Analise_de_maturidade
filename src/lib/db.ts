import { D1Database } from "@cloudflare/workers-types";

// Variável global para armazenar a instância do banco de dados
let dbInstance: D1Database | null = null;

// Função para inicializar o banco de dados
export function initializeDb(db: D1Database) {
  dbInstance = db;
}

// Exportar a instância do banco de dados
export const db = {
  prepare: (query: string) => {
    if (!dbInstance) {
      throw new Error("Database not initialized");
    }
    return dbInstance.prepare(query);
  },
  exec: async (query: string) => {
    if (!dbInstance) {
      throw new Error("Database not initialized");
    }
    return dbInstance.exec(query);
  }
};
