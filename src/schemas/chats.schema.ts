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

export const StreamIdParamSchema = Type.Object({
  streamId: Type.Number(),
});
export type StreamIdParams = Static<typeof StreamIdParamSchema>;

export const ChatIdParamSchema = Type.Intersect([
  StreamIdParamSchema,
  Type.Object({
    chatId: Type.Number(),
  }),
]);
export type ChatRouteParams = Static<typeof ChatIdParamSchema>;

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
  params: StreamIdParamSchema,
  body: CreateChatBodySchema,
  response: {
    201: ChatResponseSchema,
  },
};

export const UpdateChatBodySchema = Type.Object({
  content: Type.String({ minLength: 1 }),
});
export type UpdateChatInput = Static<typeof UpdateChatBodySchema>;

export const updateChatSchema = {
  description: "更新指定聊天室訊息",
  tags: ["chats"],
  params: ChatIdParamSchema,
  body: UpdateChatBodySchema,
  response: {
    200: ChatResponseSchema,
  },
};

export const getChatsSchema = {
  description: "取得聊天室訊息清單",
  tags: ["chats"],
  params: StreamIdParamSchema,
  response: {
    200: Type.Array(ChatResponseSchema),
  },
};

export const deleteChatSchema = {
  description: "刪除指定聊天室訊息",
  tags: ["chats"],
  params: ChatIdParamSchema,
  response: {
    204: Type.Null(),
  },
};
