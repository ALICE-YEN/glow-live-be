import { FastifyInstance } from "fastify";
import { Server, Socket } from "socket.io";
import { emitError } from "../helpers/socketHelpers";
import { createChat } from "../services/chats.service";

export default function registerChatHandlers(
  io: Server,
  socket: Socket,
  fastify: FastifyInstance
) {
  socket.onAny((event, ...args) => {
    console.log(`🔥 received event: ${event}`);
  });

  socket.on("sendMessage", async (payload) => {
    const room = `room-${payload.streamId}`;
    console.log("📨 收到 sendMessage:", payload);

    const {
      streamId,
      userId,
      username,
      content,
      type = "text",
    } = payload || {};

    if (!userId || !content || !streamId) {
      console.warn("sendMessage 參數不足", payload);
      return socket.emit("error", {
        code: "INVALID_PARAMS",
        message: "缺少必要參數",
      });
    }

    try {
      const client = await fastify.pg.connect();

      const savedMessage = await createChat(
        client,
        { content, type }, // CreateChatInput
        userId,
        streamId
      );

      client.release();

      // 廣播對象為房間內所有人（包含自己）
      io.to(room).emit("newMessage", {
        ...savedMessage,
        username,
      });
    } catch (err) {
      console.error("❌ sendMessage 處理錯誤", err);
      socket.emit("error", {
        code: "SERVER_ERROR",
        message: "送出訊息失敗，請稍後重試",
      });
    }
  });
}
