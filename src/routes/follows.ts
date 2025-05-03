import { FastifyInstance } from "fastify";
import {
  followUserSchema,
  unfollowUserSchema,
  getFollowersSchema,
  getFollowingSchema,
} from "../schemas/follows.schema";
import {
  followUserHandler,
  unfollowUserHandler,
  getFollowersHandler,
  getFollowingHandler,
} from "../controllers/follows.controller";

export default async function followsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/:userId/follow",
    { schema: followUserSchema },
    followUserHandler
  );
  fastify.delete(
    "/:userId/follow",
    { schema: unfollowUserSchema },
    unfollowUserHandler
  );
  fastify.get(
    "/:userId/followers",
    { schema: getFollowersSchema },
    getFollowersHandler
  );
  fastify.get(
    "/:userId/following",
    { schema: getFollowingSchema },
    getFollowingHandler
  );
}
