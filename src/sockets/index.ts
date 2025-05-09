import { FastifyInstance } from "fastify";
import { Server, Socket } from "socket.io";
import registerRoomHandlers from "./room";
// import registerChatHandlers from "./chat";
// import registerGiftHandlers from "./gift";
// import registerSystemHandlers from "./system";

export default function registerSocketEvents(
  io: Server,
  socket: Socket,
  fastify: FastifyInstance
) {
  registerRoomHandlers(io, socket, fastify);
  //   registerChatHandlers(io, socket);
  //   registerGiftHandlers(io, socket);
  //   registerSystemHandlers(io, socket);
}
