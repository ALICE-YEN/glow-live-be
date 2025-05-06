import { Type, Static } from "@sinclair/typebox";

export const userIdParamSchema = Type.Object({
  userId: Type.Number(),
});
export type UserIdParam = Static<typeof userIdParamSchema>;

export const followUserSchema = {
  description: "追蹤使用者",
  tags: ["follows"],
  params: userIdParamSchema,
  response: {
    201: Type.Object({
      id: Type.Number(),
      followerId: Type.Number(),
      followingId: Type.Number(),
      createdAt: Type.String({ format: "date-time" }),
    }),
    409: Type.Object({
      message: Type.String(),
      code: Type.Literal("ALREADY_FOLLOWED"),
    }),
  },
};

export const unfollowUserSchema = {
  description: "取消追蹤使用者",
  tags: ["follows"],
  params: userIdParamSchema,
  response: {
    204: Type.Null(),
  },
};

export const userPreviewSchema = Type.Object({
  id: Type.Number(),
  username: Type.String(),
});

export const getFollowersSchema = {
  description: "取得追蹤該使用者的粉絲清單",
  tags: ["follows"],
  params: userIdParamSchema,
  response: {
    200: Type.Array(userPreviewSchema),
  },
};

export const getFollowingSchema = {
  description: "取得該使用者追蹤的對象清單",
  tags: ["follows"],
  params: userIdParamSchema,
  response: {
    200: Type.Array(userPreviewSchema),
  },
};
