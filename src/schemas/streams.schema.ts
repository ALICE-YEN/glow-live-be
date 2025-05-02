import { Type, Static } from "@sinclair/typebox";

// 可共用的 stream response schema
const StreamBaseResponseSchema = Type.Object({
  id: Type.Number(),
  user_id: Type.Number(),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  stream_key: Type.String(),
  // status
  started_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  ended_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  thumbnail_url: Type.Optional(Type.String()),
  // is_recorded
  playback_url: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});

// 抽出 body schema（可重用 + 推導 TS 類型）
const CreateStreamBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  thumbnailUrl: Type.Optional(Type.String({ format: "uri" })),
});

// 直接推導 TypeScript 類型，不需重複寫
export type CreateStreamInput = Static<typeof CreateStreamBodySchema>;

const NewStreamResponseSchema = Type.Intersect([
  StreamBaseResponseSchema,
  Type.Object({
    status: Type.Literal("waiting"),
    is_recorded: Type.Literal(false),
  }),
]);

export const createStreamSchema = {
  description: "建立一個新的直播",
  tags: ["streams"],
  body: CreateStreamBodySchema,
  response: {
    201: NewStreamResponseSchema,
  },
};

// 抽出 params schema（可重用 + 推導 TS 類型）
const GetStreamParamsSchema = Type.Object({
  streamId: Type.String(),
});

// 直接推導 TypeScript 類型，不需重複寫
export type GetStreamParams = Static<typeof GetStreamParamsSchema>;

const ExistingStreamResponseSchema = Type.Intersect([
  StreamBaseResponseSchema,
  Type.Object({
    status: Type.Enum({
      waiting: "waiting",
      live: "live",
      ended: "ended",
    }),
    is_recorded: Type.Boolean(),
  }),
]);

export const getStreamSchema = {
  description: "取得一個直播細節",
  tags: ["streams"],
  params: GetStreamParamsSchema,
  response: {
    200: ExistingStreamResponseSchema,
  },
};

export const getStreamsSchema = {
  description: "取得直播清單",
  tags: ["streams"],
  response: {
    200: Type.Array(ExistingStreamResponseSchema),
  },
};
