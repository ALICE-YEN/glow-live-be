import fp from "fastify-plugin";
import { Server } from "socket.io";
import { FastifyInstance } from "fastify";
import registerSocketEvents from "../sockets";

export default fp(async function (fastify: FastifyInstance) {
  const io = new Server(fastify.server, {
    cors: {
      origin: "*", // 開發階段允許所有
    },
  });

  // 將 io 加到 fastify instance 上，方便全站使用
  fastify.decorate("io", io);

  // 當有 client 連上來
  io.on("connection", (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    registerSocketEvents(io, socket, fastify);

    socket.on("disconnect", () => {
      // 當使用者關掉瀏覽器、刷新頁面、斷線，或 router.push 前沒來得及 emit leaveRoom，前端都可能來不及通知後端自己離開房間。
      // TODO: 這時後端要自己偵測：這個 socket 斷線了，要不要移除使用者、釋放資源
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
});
