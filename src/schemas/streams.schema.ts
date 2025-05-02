import { Type, Static } from "@sinclair/typebox";

const StreamResponseSchema = Type.Object({
  id: Type.Number(),
  user_id: Type.Number(),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  stream_key: Type.String(),
  status: Type.Enum({
    waiting: "waiting",
    live: "live",
    ended: "ended",
  }),
  started_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  ended_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  thumbnail_url: Type.Optional(Type.String()),
  is_recorded: Type.Boolean(),
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

export const createStreamSchema = {
  description: "建立一個新的直播",
  tags: ["streams"],
  body: CreateStreamBodySchema,
  response: {
    201: StreamResponseSchema,
  },
};

// 抽出 params schema（可重用 + 推導 TS 類型）
const GetStreamParamsSchema = Type.Object({
  streamId: Type.Number(),
});

// 直接推導 TypeScript 類型，不需重複寫
export type GetStreamParams = Static<typeof GetStreamParamsSchema>;

export const getStreamSchema = {
  description: "取得一個直播細節",
  tags: ["streams"],
  params: GetStreamParamsSchema,
  response: {
    200: StreamResponseSchema,
  },
};

export const getStreamsSchema = {
  description: "取得直播清單",
  tags: ["streams"],
  response: {
    200: Type.Array(StreamResponseSchema),
  },
};

const UpdateStreamBodySchema = Type.Partial(
  Type.Object({
    title: Type.String({ minLength: 1 }),
    description: Type.String(),
    status: Type.Enum({
      waiting: "waiting",
      live: "live",
    }), // 只允許更新為 waiting 或 live
    started_at: Type.String({ format: "date-time" }),
    ended_at: Type.String({ format: "date-time" }),
    thumbnail_url: Type.String({ format: "uri" }),
    is_recorded: Type.Boolean(),
    playback_url: Type.String({ format: "uri" }),
  })
);

export type UpdateStreamInput = Static<typeof UpdateStreamBodySchema>;

export const updateStreamSchema = {
  description: "更新指定直播（可部分欄位）",
  tags: ["streams"],
  params: GetStreamParamsSchema,
  body: UpdateStreamBodySchema,
  response: {
    200: StreamResponseSchema,
  },
};

export const endStreamSchema = {
  description: "結束指定直播（更新為 ended 狀態）",
  tags: ["streams"],
  params: GetStreamParamsSchema,
  response: {
    200: StreamResponseSchema,
  },
};
