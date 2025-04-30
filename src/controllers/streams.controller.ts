// controller 的責任只有：參數檢查、錯誤處理、回傳格式

import { FastifyRequest, FastifyReply } from "fastify";
import { createStream } from "../services/streams.service";
import type { CreateStreamInput } from "../schemas/streams.schema";
import { generateStreamKey } from "../helpers/cryptoHelpers";

export const createStreamHandler = async (
  request: FastifyRequest<{ Body: CreateStreamInput }>,
  reply: FastifyReply
) => {
  const { body } = request;

  const client = await request.server.pg.connect();

  const userId = request.user?.id ?? 1; // TODO: 從 JWT middleware 注入 user
  if (!userId) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  const streamKey = generateStreamKey(); // 後端產生

  try {
    const result = await createStream(client, body, userId, streamKey);
    return reply.status(201).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "建立直播失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};
