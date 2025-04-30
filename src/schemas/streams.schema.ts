import { Type, Static } from "@sinclair/typebox";

// 抽出 body schema（可重用 + 推導 TS 類型）
const CreateStreamBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  thumbnailUrl: Type.Optional(Type.String({ format: "uri" })),
});

// 直接推導 TypeScript 類型，不需重複寫
export type CreateStreamInput = Static<typeof CreateStreamBodySchema>;

export const createStreamSchema = {
  description: "建立一個新的直播",
  tags: ["streams"],
  body: CreateStreamBodySchema,
  response: {
    201: Type.Object({
      id: Type.Number(),
      user_id: Type.Number(),
      title: Type.String(),
      description: Type.Optional(Type.String()),
      stream_key: Type.String(),
      status: Type.Literal("waiting"),
      started_at: Type.Union([
        Type.String({ format: "date-time" }),
        Type.Null(),
      ]),
      ended_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
      thumbnail_url: Type.Optional(Type.String()),
      is_recorded: Type.Literal(false),
      playback_url: Type.Union([Type.String(), Type.Null()]),
      created_at: Type.String({ format: "date-time" }),
      updated_at: Type.String({ format: "date-time" }),
    }),
  },
};
