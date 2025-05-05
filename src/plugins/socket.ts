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
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
});
