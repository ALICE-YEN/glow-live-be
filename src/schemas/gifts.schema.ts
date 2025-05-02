import { Type, Static } from "@sinclair/typebox";

export const GiftSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  emoji: Type.String(),
  price: Type.Number(),
});

export const CreateGiftBodySchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  emoji: Type.String({ minLength: 1 }),
  price: Type.Number({ minimum: 0 }),
});

export type CreateGiftInput = Static<typeof CreateGiftBodySchema>;

export const createGiftSchema = {
  description: "新增一個禮物 (管理用途)",
  tags: ["gifts"],
  body: CreateGiftBodySchema,
  response: {
    201: GiftSchema,
  },
};

export const getGiftsSchema = {
  description: "取得所有禮物清單",
  tags: ["gifts"],
  response: {
    200: Type.Array(GiftSchema),
  },
};
