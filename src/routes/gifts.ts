import { FastifyInstance } from "fastify";
import { createGiftSchema, getGiftsSchema } from "../schemas/gifts.schema";
import {
  createGiftHandler,
  getGiftsHandler,
} from "../controllers/gifts.controller";

export default async function giftRoutes(fastify: FastifyInstance) {
  fastify.post("/", { schema: createGiftSchema }, createGiftHandler);
  fastify.get("/", { schema: getGiftsSchema }, getGiftsHandler);
}
