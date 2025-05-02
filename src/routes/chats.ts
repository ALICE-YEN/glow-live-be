import { FastifyInstance } from "fastify";
import {
  createChatSchema,
  updateChatSchema,
  getChatsSchema,
  deleteChatSchema,
} from "../schemas/chats.schema";
import {
  createChatHandler,
  updateChatHandler,
  getChatsHandler,
  deleteChatHandler,
} from "../controllers/chats.controller";

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
  fastify.get("/:streamId/chats", { schema: getChatsSchema }, getChatsHandler);
  fastify.delete(
    "/:streamId/chats/:chatId",
    { schema: deleteChatSchema },
    deleteChatHandler
  );
}

export default chatsRoutes;
