import { PoolClient } from "pg";
import { CreateGiftInput } from "../schemas/gifts.schema";

export const createGift = async (client: PoolClient, data: CreateGiftInput) => {
  const { name, emoji, price } = data;
  const query = `
    INSERT INTO gifts (name, emoji, price)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, emoji, price];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const getGifts = async (client: PoolClient) => {
  const query = `SELECT * FROM gifts ORDER BY id ASC;`;

  const result = await client.query(query);
  return result.rows;
};
