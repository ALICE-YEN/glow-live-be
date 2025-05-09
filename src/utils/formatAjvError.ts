// Fastify 內建使用 AJV 來驗證所有 schema。
// AJV（Another JSON Validator） 是一個超快、符合 JSON Schema 標準的資料驗證引擎。
import { FastifyError } from "fastify";

export function formatAjvErrors(errors: FastifyError["validation"] = []) {
  return errors.map((err) => ({
    field: err.instancePath.replace("/", ""), // "/email" → "email"
    message: err.message || "格式錯誤",
  }));
}
