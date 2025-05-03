import { FastifyRequest, FastifyReply } from "fastify";
import { createGift, getGifts } from "../services/gifts.service";
import { CreateGiftInput } from "../schemas/gifts.schema";

export const createGiftHandler = async (
  request: FastifyRequest<{ Body: CreateGiftInput }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  try {
    const result = await createGift(client, request.body);
    return reply.status(201).send(result);
  } catch (err) {
    return reply
      .status(500)
      .send({ message: "新增禮物失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};

export const getGiftsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  try {
    const result = await getGifts(client);
    return reply.send(result);
  } catch (err) {
    return reply
      .status(500)
      .send({ message: "取得禮物清單失敗", code: "INTERNAL_ERROR" });
  } finally {
    client.release();
  }
};
