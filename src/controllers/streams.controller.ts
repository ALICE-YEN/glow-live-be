// controller 的責任只有：參數檢查、錯誤處理、回傳格式

import { FastifyRequest, FastifyReply } from "fastify";
import {
  createStream,
  getStream,
  getStreams,
  updateStream,
  endStream,
} from "../services/streams.service";
import type {
  CreateStreamInput,
  GetStreamParams,
  UpdateStreamInput,
} from "../schemas/streams.schema";
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

export const getStreamHandler = async (
  request: FastifyRequest<{ Params: GetStreamParams }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  const streamId = request.params.streamId;

  try {
    const result = await getStream(client, streamId);

    if (!result) {
      return reply.status(404).send({
        message: "找不到指定直播",
        code: "NOT_FOUND",
      });
    }

    return reply.status(200).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "取得直播細節失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const getStreamsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();

  try {
    const result = await getStreams(client);
    return reply.status(200).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "取得直播清單失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const updateStreamHandler = async (
  request: FastifyRequest<{ Params: GetStreamParams; Body: UpdateStreamInput }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  const streamId = request.params.streamId;
  const { body } = request;

  const streamUpdatableFields: (keyof UpdateStreamInput)[] = [
    "title",
    "description",
    "status",
    "started_at",
    "ended_at",
    "thumbnail_url",
    "is_recorded",
    "playback_url",
  ];

  const hasAnyField = streamUpdatableFields.some(
    (key) => body[key as keyof typeof body] !== undefined
  );

  if (!hasAnyField) {
    return reply
      .status(400)
      .send({ message: "請至少提供一個欄位進行更新", code: "BAD_REQUEST" });
  }

  try {
    const result = await updateStream(client, streamId, body);

    return reply.status(200).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "更新直播細節失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const endStreamHandler = async (
  request: FastifyRequest<{ Params: GetStreamParams }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  const streamId = request.params.streamId;

  try {
    const result = await endStream(client, streamId);

    return reply.status(200).send(result);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: "關閉直播失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};
