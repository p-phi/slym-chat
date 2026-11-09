import { homedir } from "node:os";
import { join } from "node:path";

export const CONFIG_DIR =
  process.env.SLYM_CHAT_CONFIG ?? join(homedir(), ".config", "slym-chat");
export const CHATS_DIR = join(CONFIG_DIR, "chats");
export const BUNDLES_DIR =
  process.env.SLYM_BUNDLES ?? join(process.cwd(), "bundles");

/** How many recent trace lines to send as history. */
export const HISTORY_LINES = Number(process.env.SLYM_CHAT_HISTORY ?? 20);

/** The  binary. */
export const SLYM_BIN = process.env.SLYM_BIN ?? "slym";

