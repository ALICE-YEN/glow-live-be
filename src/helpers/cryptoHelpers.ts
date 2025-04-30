import { randomBytes } from "crypto";

export function generateStreamKey(length = 32): string {
  return randomBytes(length).toString("hex");
}
