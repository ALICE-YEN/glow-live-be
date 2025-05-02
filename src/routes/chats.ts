import { FastifyInstance } from "fastify";
import {
  createChatHandler,
  updateChatHandler,
} from "../controllers/chats.controller";
import { createChatSchema, updateChatSchema } from "../schemas/chats.schema";

async function chatsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/:streamId/chats",
    { schema: createChatSchema },
    createChatHandler
  );
  fastify.patch(
    "/:streamId/chats/:chatId",
    { schema: updateChatSchema },
    updateChatHandler
  );
}

export default chatsRoutes;
