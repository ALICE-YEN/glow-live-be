import { PoolClient } from "pg";
import camelcaseKeys from "camelcase-keys";

export const followUser = async (
  client: PoolClient,
  followerId: number,
  followingId: number
) => {
  const query = `
    INSERT INTO followers (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;

  const values = [followerId, followingId];
  const result = await client.query(query, values);
  return camelcaseKeys(result.rows[0], { deep: true });
};

export const unfollowUser = async (
  client: PoolClient,
  followerId: number,
  followingId: number
) => {
  const query = `
    DELETE FROM followers
    WHERE follower_id = $1 AND following_id = $2;
  `;

  const values = [followerId, followingId];

  await client.query(query, values);
};

export const getFollowers = async (client: PoolClient, userId: number) => {
  const query = `
    SELECT users.id, users.username
    FROM followers
    JOIN users ON users.id = followers.follower_id
    WHERE followers.following_id = $1;
  `;

  const values = [userId];

  const result = await client.query(query, values);
  return camelcaseKeys(result.rows, { deep: true });
};

export const getFollowing = async (client: PoolClient, userId: number) => {
  const query = `
    SELECT users.id, users.username
    FROM followers
    JOIN users ON users.id = followers.following_id
    WHERE followers.follower_id = $1;
  `;

  const values = [userId];

  const result = await client.query(query, values);
  return camelcaseKeys(result.rows, { deep: true });
};

export const isFollower = async (
  client: PoolClient,
  followerId: number,
  followingId: number
): Promise<boolean> => {
  const query = `
    SELECT 1 FROM followers
    WHERE follower_id = $1 AND following_id = $2
    LIMIT 1;
  `;

  const values = [followerId, followingId];

  const result = await client.query(query, values);
  return result.rowCount > 0;
};
