// controller 的責任只有：參數檢查、錯誤處理、回傳格式

import { FastifyRequest, FastifyReply } from "fastify";
import {
  createChat,
  updateChat,
  getChats,
  deleteChat,
} from "../services/chats.service";
import {
  StreamIdParams,
  CreateChatInput,
  ChatRouteParams,
  UpdateChatInput,
} from "../schemas/chats.schema";

export const createChatHandler = async (
  request: FastifyRequest<{ Params: StreamIdParams; Body: CreateChatInput }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  const streamId = request.params.streamId;

  const userId = request.user?.id ?? 1; // TODO: 從 JWT middleware 注入 user
  if (!userId) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  try {
    const result = await createChat(client, request.body, userId, streamId);
    return reply.status(201).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "建立聊天室訊息失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const updateChatHandler = async (
  request: FastifyRequest<{ Params: ChatRouteParams; Body: UpdateChatInput }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();

  if (!request.body.content) {
    return reply
      .status(400)
      .send({ message: "請提供要更新的內容", code: "BAD_REQUEST" });
  }
  try {
    const result = await updateChat(
      client,
      request.params.chatId,
      request.body
    );
    return reply.status(200).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "更新聊天室訊息失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const getChatsHandler = async (
  request: FastifyRequest<{ Params: StreamIdParams }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  try {
    const result = await getChats(client, request.params.streamId);
    return reply.send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "取得聊天室列表失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const deleteChatHandler = async (
  request: FastifyRequest<{ Params: ChatRouteParams }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  try {
    await deleteChat(client, request.params.chatId);
    return reply.status(204).send();
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "刪除聊天室訊息失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};
