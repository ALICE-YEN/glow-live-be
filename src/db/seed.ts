// Client：單一連線（Single Connection），你自己管理（connect / query / end），要手動結束連線，一次只能處理一個請求，沒特別快，用在測試、一次性的小工具（比如手動 seed）。
// Pool：連線池（Connection Pool），自動幫你管（取用、回收連線），不一定要手動結束連線，Pool 自己管理，只需要 release()，高併發時表現佳，可以同時處理很多 query，用在正式後端服務（高併發 API server）。
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  console.log("✅ Connected to database.");

  try {
    // 直接整張表清空，RESTART IDENTITY 可以重設 ID，CASCADE 可以自動清掉依賴表，比 DELETE FROM 快很多
    await client.query(`
      TRUNCATE TABLE
        gift_transactions,
        chat_messages,
        recordings,
        followers,
        gifts,
        streams,
        users
      RESTART IDENTITY CASCADE;
    `);

    console.log("🧹 Old data cleared.");

    // 插入 users
    const { rows: users } = await client.query(`
      INSERT INTO users (username, email, password, status)
      VALUES 
        ('streamer01', 'streamer01@example.com', 'hashed_password', 'active'),
        ('viewer01', 'viewer01@example.com', 'hashed_password', 'active'),
        ('viewer02', 'viewer02@example.com', 'hashed_password', 'active')
      RETURNING *;
    `);

    console.log("👤 Users seeded.");

    // 插入 streams
    const { rows: streams } = await client.query(`
      INSERT INTO streams (user_id, title, description, stream_key, status)
      VALUES 
        (${users[0].id}, 'First Stream', 'Welcome to my live stream!', 'key1', 'waiting'),
        (${users[0].id}, 'Second Stream', 'Another amazing stream!', 'key2', 'waiting')
      RETURNING *;
    `);

    console.log("📡 Streams seeded.");

    // 插入 gifts
    const { rows: gifts } = await client.query(`
      INSERT INTO gifts (name, emoji, price)
      VALUES
        ('Heart', '❤️', 10),
        ('Gift Box', '🎁', 50),
        ('Fire', '🔥', 30),
        ('Applause', '👏', 20)
      RETURNING *;
    `);

    console.log("🎁 Gifts seeded.");

    // 插入 chat_messages
    await client.query(`
      INSERT INTO chat_messages (stream_id, user_id, content, type)
      VALUES
        (${streams[0].id}, ${users[1].id}, 'This is so cool!', 'text'),
        (${streams[0].id}, ${users[2].id}, '🔥', 'emoji');
    `);

    console.log("💬 Chat messages seeded.");

    // 插入 gift_transactions
    await client.query(`
      INSERT INTO gift_transactions (stream_id, sender_id, receiver_id, gift_id, price, amount)
      VALUES
        (${streams[0].id}, ${users[1].id}, ${users[0].id}, ${gifts[0].id}, ${gifts[0].price}, 1),
        (${streams[0].id}, ${users[2].id}, ${users[0].id}, ${gifts[1].id}, ${gifts[1].price}, 2);
    `);

    console.log("💎 Gift transactions seeded.");

    // 插入 followers
    await client.query(`
      INSERT INTO followers (follower_id, following_id)
      VALUES
        (${users[1].id}, ${users[0].id}),
        (${users[2].id}, ${users[0].id});
    `);

    console.log("👥 Followers seeded.");

    // 插入 recordings
    await client.query(`
      INSERT INTO recordings (stream_id, file_url, duration)
      VALUES
        (${streams[0].id}, 'https://example.com/recordings/stream1.mp4', 3600);
    `);

    console.log("🎥 Recordings seeded.");

    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.end();
    console.log("🔌 Disconnected from database.");
  }
}

seed();
