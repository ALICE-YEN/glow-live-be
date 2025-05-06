import { Type, Static } from "@sinclair/typebox";

const StreamResponseSchema = Type.Object({
  id: Type.Number(),
  userId: Type.Number(),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  streamKey: Type.String(),
  status: Type.Enum({
    waiting: "waiting",
    live: "live",
    ended: "ended",
  }),
  startedAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  endedAt: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  thumbnailUrl: Type.Optional(Type.String()),
  isRecorded: Type.Boolean(),
  playbackUrl: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
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

const GetStreamsQuerySchema = Type.Object({
  status: Type.Optional(
    Type.Union([
      Type.Literal("waiting"),
      Type.Literal("live"),
      Type.Literal("ended"),
    ])
  ),
});

export type GetStreamsQuery = Static<typeof GetStreamsQuerySchema>;

export const getStreamsSchema = {
  description: "取得直播清單",
  tags: ["streams"],
  querystring: GetStreamsQuerySchema,
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
    startedAt: Type.String({ format: "date-time" }),
    endedAt: Type.String({ format: "date-time" }),
    thumbnailUrl: Type.String({ format: "uri" }),
    isRecorded: Type.Boolean(),
    playbackUrl: Type.String({ format: "uri" }),
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

export const SendGiftBodySchema = Type.Object({
  senderId: Type.Number(),
  giftId: Type.Number(),
  price: Type.Number({ minimum: 0 }),
  amount: Type.Number({ minimum: 1 }),
});
export type SendGiftInput = Static<typeof SendGiftBodySchema>;

export const sendGiftSchema = {
  description: "送出禮物（建立交易）",
  tags: ["streams"],
  params: GetStreamParamsSchema,
  body: SendGiftBodySchema,
  response: {
    201: Type.Object({
      id: Type.Number(),
      streamId: Type.Number(),
      senderId: Type.Number(),
      giftId: Type.Number(),
      price: Type.Number(),
      amount: Type.Number(),
      createdAt: Type.String({ format: "date-time" }),
    }),
  },
};
