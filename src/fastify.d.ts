import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: number;
      username: string;
      // ...其他 JWT payload 欄位
    };
  }
}
