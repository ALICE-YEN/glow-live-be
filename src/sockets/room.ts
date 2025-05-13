import { FastifyInstance } from "fastify";
import { Server, Socket } from "socket.io";
import { PoolClient } from "pg";
import { emitError } from "../helpers/socketHelpers";
import { callInternalApi } from "../helpers/callInternalApi";
import { getStream } from "../services/streams.service";
import { isFollower } from "../services/follows.service";

export default function registerRoomHandlers(
  io: Server,
  socket: Socket,
  fastify: FastifyInstance
) {
  socket.onAny((event, ...args) => {
    console.log(`🔥 received event: ${event}`);
  });

  socket.on("offer", ({ streamId, sdp, type }) => {
    const room = `room-${streamId}`;
    console.log(`📡 Host sent offer to room ${room}`);
    socket.to(room).emit("offer", { sdp, type });
  });

  socket.on("answer", ({ streamId, sdp, type }) => {
    const room = `room-${streamId}`;
    console.log(`📩 Viewer sent answer to room ${room}`);
    socket.to(room).emit("answer", { sdp, type });
  });

  socket.on("ice-candidate", ({ streamId, candidate }) => {
    const room = `room-${streamId}`;
    socket.to(room).emit("ice-candidate", { candidate });
  });

  socket.on("endStream", async ({ streamId }) => {
    try {
      const room = `room-${streamId}`;
      console.log(`主播結束直播：${room}`);
      socket.to(room).emit("stream-ended");

      await callInternalApi(fastify, "PATCH", `/api/streams/${streamId}/end`);
    } catch (err) {
      console.error(`❌ [${err?.code}] ${err?.message}`); // 之後再統整處理
    }
  });

  socket.on(
    "joinRoom",
    async ({ streamId, userId, userName }, ack: () => void) => {
      const room = `room-${streamId}`;
      console.log(`🔥 joinRoom: ${room}`);

      console.log("檢查", streamId, userId, userName);
      if (!Number.isInteger(streamId) || !Number.isInteger(userId)) {
        return emitError(socket, "INVALID_PARAMS", "參數錯誤");
      }

      // 加入一個虛擬房間（server-side 群組），以便之後廣播時只針對房間內的人
      socket.join(room); // 同步執行，不需要 await

      if (ack) {
        console.log(`🧍‍♂️ ${socket.id} (${userName}) joined ${room}`);
        ack();
      }

      // 通知房間內的其他人
      socket.to(room).emit("new-viewer", {
        viewerId: socket.id,
        userId,
        userName,
      });

      // 若是主播本人且 status 是 waiting → 更新為 live
      let client = await fastify.pg.connect();
      const stream = await getStream(client, streamId, userId);

      if (!stream) {
        console.warn(`Stream ${streamId} 不存在`);
        return emitError(socket, "STREAM_NOT_FOUND", "找不到直播間");
      }

      if (stream && stream.userId === userId && stream.status === "waiting") {
        try {
          await callInternalApi(fastify, "PATCH", `/api/streams/${streamId}`, {
            payload: { status: "live" },
          });
          console.log("✅ 主播加入，已更新直播狀態為 live");
        } catch (err) {
          console.error("❌ 更新直播狀態失敗", err);
        }
      }
    }
  );

  // socket.on(
  //   "joinRoom",
  //   async ({
  //     streamId,
  //     userId,
  //     userName,
  //   }: {
  //     streamId: number;
  //     userId: number;
  //     userName: string;
  //   }) => {
  //     let client: PoolClient;

  //     const room = `room-${streamId}`;

  //     if (!Number.isInteger(streamId) || !Number.isInteger(userId)) {
  //       return emitError(socket, "INVALID_PARAMS", "參數錯誤");
  //     }

  //     try {
  //       client = await fastify.pg.connect();

  //       // 查詢該 stream 的 host（user_id）
  //       const stream = await getStream(client, streamId, userId);

  //       if (!stream) {
  //         console.warn(`Stream ${streamId} 不存在`);
  //         return emitError(socket, "STREAM_NOT_FOUND", "找不到直播間");
  //       }

  //       const hostId = stream.user_id;

  //       socket.data.userId = userId;
  //       socket.data.userName = userName;
  //       socket.data.streamId = streamId;
  //       socket.data.hostId = hostId; // 問資料庫取得，直播主的 user_id

  //       socket.join(room); // 加入一個虛擬房間（server-side 群組），以便之後廣播時只針對房間內的人

  //       console.log(
  //         `🧍‍♂️ ${socket.id} (${userName}) joined ${room}, hostId = ${hostId}`
  //       );

  //       // 可擴充：更新人數 & 廣播通知
  //       const count = io.sockets.adapter.rooms.get(room)?.size || 0;
  //       io.to(room).emit("userCountUpdate", { count });

  //       const isUserFollower = await isFollower(client, userId, hostId);

  //       if (isUserFollower) {
  //         io.to(room).emit("userJoined", {
  //           userId,
  //           userName,
  //           message: `${userName} 加入了聊天室`,
  //         });
  //       }
  //     } catch (err) {
  //       console.error("joinRoom 發生錯誤", err);
  //       socket.emit("error", {
  //         code: "SERVER_ERROR",
  //         message: "無法加入直播間",
  //       });
  //     } finally {
  //       client.release();
  //     }
  //   }
  // );

  socket.on("leaveRoom", ({ streamId }: { streamId: number }) => {
    const room = `room-${streamId}`;
    console.log(`🔥 leaveRoom: ${room}`);
    socket.leave(room);
    console.log(`🚪 ${socket.id} left ${room}`);
  });
}
