// service 的責任只有：接收乾淨的資料（純變數，不包含 HTTP 或框架物件）、根據業務邏輯處理資料、不包含參數驗證、錯誤回傳格式、HTTP 狀態碼等與框架有關的處理
// 保持與框架（Fastify、Express）無關，確保可被單元測試與複用

import type { CreateStreamInput } from "../schemas/streams.schema";

export const createStream = async (
  client: any,
  body: CreateStreamInput,
  userId: number,
  streamKey: string
) => {
  const { title, description, thumbnailUrl } = body;

  const query = `
      INSERT INTO streams (user_id, title, description, stream_key, thumbnail_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `;

  const values = [userId, title, description, streamKey, thumbnailUrl];

  const result = await client.query(query, values);
  return result.rows[0];
};
