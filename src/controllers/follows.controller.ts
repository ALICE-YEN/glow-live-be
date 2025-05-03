import { FastifyRequest, FastifyReply } from "fastify";
import { UserIdParam } from "../schemas/follows.schema";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/follows.service";

export const followUserHandler = async (
  request: FastifyRequest<{ Params: UserIdParam }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();

  const userId = request.user?.id ?? 1; // TODO: 從 JWT middleware 注入 user
  if (!userId) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  try {
    const result = await followUser(client, userId, request.params.userId);

    if (!result) {
      return reply.status(409).send({
        message: "你已經追蹤過這位使用者",
        code: "ALREADY_FOLLOWED",
      });
    }

    return reply.status(201).send(result);
  } finally {
    client.release();
  }
};

export const unfollowUserHandler = async (
  request: FastifyRequest<{ Params: UserIdParam }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();

  const userId = request.user?.id ?? 1; // TODO: 從 JWT middleware 注入 user
  if (!userId) {
    return reply.status(401).send({ message: "Unauthorized" });
  }

  try {
    await unfollowUser(client, userId, request.params.userId);
    return reply.status(204).send();
  } finally {
    client.release();
  }
};

export const getFollowersHandler = async (
  request: FastifyRequest<{ Params: UserIdParam }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  try {
    const result = await getFollowers(client, request.params.userId);
    return reply.send(result);
  } finally {
    client.release();
  }
};

export const getFollowingHandler = async (
  request: FastifyRequest<{ Params: UserIdParam }>,
  reply: FastifyReply
) => {
  const client = await request.server.pg.connect();
  try {
    const result = await getFollowing(client, request.params.userId);
    return reply.send(result);
  } finally {
    client.release();
  }
};
