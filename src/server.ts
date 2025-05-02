import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyPostgres from "@fastify/postgres";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import streamsRoutes from "./routes/streams.js";
import chatsRoutes from "./routes/chats.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: FRONTEND_URL,
});

fastify.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
});

fastify.register(swagger, {
  openapi: {
    info: {
      title: "fastify-api",
      version: "1.0.0",
    },
  },
});
fastify.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

fastify.register(streamsRoutes, { prefix: "/api/streams" });
fastify.register(chatsRoutes, { prefix: "/api/streams" });

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
