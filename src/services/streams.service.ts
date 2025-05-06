// service 的責任只有：接收乾淨的資料（純變數，不包含 HTTP 或框架物件）、根據業務邏輯處理資料、不包含參數驗證、錯誤回傳格式、HTTP 狀態碼等與框架有關的處理
// 保持與框架（Fastify、Express）無關，確保可被單元測試與複用

import type { PoolClient } from "pg";
import type {
  CreateStreamInput,
  UpdateStreamInput,
  SendGiftInput,
} from "../schemas/streams.schema";

export const createStream = async (
  client: PoolClient,
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

export const getStream = async (client: PoolClient, streamId: number) => {
  const query = `
      SELECT * FROM streams WHERE id = $1;
      `;

  const values = [streamId];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const getStreams = async (client: PoolClient) => {
  const query = `
      SELECT * FROM streams;
      `;

  const result = await client.query(query);
  return result.rows;
};

export const updateStream = async (
  client: PoolClient,
  streamId: number,
  updateData: UpdateStreamInput
) => {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (updateData.title !== undefined) {
    fields.push(`title = $${index++}`);
    values.push(updateData.title);
  }
  if (updateData.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(updateData.description);
  }
  if (updateData.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(updateData.status);
  }
  if (updateData.started_at !== undefined) {
    fields.push(`started_at = $${index++}`);
    values.push(updateData.started_at);
  }
  if (updateData.ended_at !== undefined) {
    fields.push(`ended_at = $${index++}`);
    values.push(updateData.ended_at);
  }
  if (updateData.thumbnail_url !== undefined) {
    fields.push(`thumbnail_url = $${index++}`);
    values.push(updateData.thumbnail_url);
  }
  if (updateData.is_recorded !== undefined) {
    fields.push(`is_recorded = $${index++}`);
    values.push(updateData.is_recorded);
  }
  if (updateData.playback_url !== undefined) {
    fields.push(`playback_url = $${index++}`);
    values.push(updateData.playback_url);
  }

  fields.push(`updated_at = NOW()`);

  const query = `
    UPDATE streams
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;
  values.push(streamId);

  const result = await client.query(query, values);
  return result.rows[0];
};

export const endStream = async (client: PoolClient, streamId: number) => {
  const query = `
      UPDATE streams
      SET status = 'ended', ended_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *;
      `;

  const values = [streamId];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const sendGift = async (
  client: PoolClient,
  streamId: number,
  data: SendGiftInput
) => {
  const { senderId, giftId, price, amount } = data;

  const query = `INSERT INTO gift_transactions
     (stream_id, sender_id, gift_id, price, amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *;`;

  const values = [streamId, senderId, giftId, price, amount];

  const result = await client.query(query, values);
  return result.rows[0];
};
