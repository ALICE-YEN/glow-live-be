import { Type, Static } from "@sinclair/typebox";

const ChatResponseSchema = Type.Object({
  id: Type.Number(),
  stream_id: Type.Number(),
  user_id: Type.Number(),
  content: Type.String(),
  type: Type.Enum({
    text: "text",
    emoji: "emoji",
    gift: "gift",
  }),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});

export const CreateChatParamsSchema = Type.Object({
  streamId: Type.Number(),
});
export type CreateChatParams = Static<typeof CreateChatParamsSchema>;

export const CreateChatBodySchema = Type.Object({
  content: Type.String({ minLength: 1 }),
  type: Type.Optional(
    Type.Enum({
      text: "text",
      emoji: "emoji",
      gift: "gift",
    })
  ),
});
export type CreateChatInput = Static<typeof CreateChatBodySchema>;

export const createChatSchema = {
  description: "建立一筆聊天室訊息",
  tags: ["chats"],
  params: CreateChatParamsSchema,
  body: CreateChatBodySchema,
  response: {
    201: ChatResponseSchema,
  },
};

export const UpdateChatParamsSchema = Type.Object({
  streamId: Type.Number(),
  chatId: Type.Number(),
});
export type UpdateChatParams = Static<typeof UpdateChatParamsSchema>;

export const UpdateChatBodySchema = Type.Object({
  content: Type.String({ minLength: 1 }),
});
export type UpdateChatInput = Static<typeof UpdateChatBodySchema>;

export const updateChatSchema = {
  description: "更新指定聊天室訊息",
  tags: ["chats"],
  params: UpdateChatParamsSchema,
  body: UpdateChatBodySchema,
  response: {
    200: ChatResponseSchema,
  },
};
