// service 的責任只有：接收乾淨的資料（純變數，不包含 HTTP 或框架物件）、根據業務邏輯處理資料、不包含參數驗證、錯誤回傳格式、HTTP 狀態碼等與框架有關的處理
// 保持與框架（Fastify、Express）無關，確保可被單元測試與複用

import { PoolClient } from "pg";
import { CreateChatInput, UpdateChatInput } from "../schemas/chats.schema";

export const createChat = async (
  client: PoolClient,
  body: CreateChatInput,
  userId: number,
  streamId: number
) => {
  const { content, type = "text" } = body;

  const query = `
      INSERT INTO chat_messages (stream_id, user_id, content, type)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `;

  const values = [streamId, userId, content, type];

  const result = await client.query(query, values);
  return result.rows[0];
};
export const updateChat = async (
  client: PoolClient,
  chatId: number,
  data: UpdateChatInput
) => {
  const query = `
    UPDATE chat_messages
    SET content = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;

  const values = [data.content, chatId];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const getChats = async (client: PoolClient, streamId: number) => {
  const query = `
    SELECT *
    FROM chat_messages
    WHERE stream_id = $1
    ORDER BY created_at ASC;
  `;

  const values = [streamId];

  const result = await client.query(query, values);
  return result.rows;
};

export const deleteChat = async (client: PoolClient, chatId: number) => {
  const query = `
    DELETE FROM chat_messages
    WHERE id = $1
    RETURNING *;
  `;

  const values = [chatId];

  const result = await client.query(query, values);
  return result.rows[0];
};
