import { Socket } from "socket.io";

export function emitError(socket: Socket, code: string, message: string) {
  socket.emit("error", { code, message });
}
