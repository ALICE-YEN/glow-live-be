import { FastifyInstance } from "fastify";
import { createStreamSchema } from "../schemas/streams.schema";
import { createStreamHandler } from "../controllers/streams.controller";

// 利用 Fastify 在路由註冊時綁定 schema，讓 Fastify
// 1. 自動驗證請求參數，若驗證失敗回傳 400 error（不進入 controller）
// 2. 自動幫你移除不必要的欄位
// 3. 產生 Swagger 文件（藉由 fastify-swagger 插件）
async function streamsRoutes(fastify: FastifyInstance) {
  fastify.post("/", { schema: createStreamSchema }, createStreamHandler);
}

export default streamsRoutes;
