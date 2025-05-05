import "fastify";
import { Server } from "socket.io";

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
  interface FastifyRequest {
    user?: {
      id: number;
      username: string;
      // ...其他 JWT payload 欄位
    };
  }
}
