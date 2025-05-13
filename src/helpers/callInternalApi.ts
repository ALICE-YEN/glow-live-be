/**
 * 用於在 Fastify 內部模擬呼叫自己的 REST API 路由。
 * 常用於 WebSocket、CLI、plugin 等非 HTTP 流程中，呼叫已實作好的 API。
 */

// 不會進入 Fastify 的路由層，registerErrorHandler(fastify) 完全捕捉不到這些錯誤。
import { AppError } from "../utils/AppError"; // 視專案位置而定

export async function callInternalApi(
  fastify,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  options: {
    headers?: Record<string, string>;
    payload?: any;
  } = {}
) {
  // fastify.inject：模擬內部 API 請求，會走所有驗證與中介層
  const response = await fastify.inject({
    method,
    url,
    headers: options.headers,
    payload: options.payload,
  });

  const status = response.statusCode;

  if (status >= 200 && status < 300) {
    return JSON.parse(response.body || "{}");
  }

  let body: any;
  try {
    body = JSON.parse(response.body);
  } catch (e) {
    body = { message: "Invalid error response", code: "ERR_UNKNOWN" };
  }

  throw new AppError(
    body.code || "ERR_UNKNOWN",
    status,
    body.message || "Internal Error",
    body.errors // optional AJV validation errors
  );
}
