import { FastifyInstance } from "fastify";
import {
  createGiftHandler,
  getGiftsHandler,
} from "../controllers/gifts.controller";
import { createGiftSchema, getGiftsSchema } from "../schemas/gifts.schema";

export default async function giftRoutes(fastify: FastifyInstance) {
  fastify.post("/", { schema: createGiftSchema }, createGiftHandler);
  fastify.get("/", { schema: getGiftsSchema }, getGiftsHandler);
}
