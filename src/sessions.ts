import { promises as fs } from "node:fs";
import { join } from "node:path";
import { CHATS_DIR } from "./config.js";

export type Chat = { path: string; name: string; mtime: Date };

export async function ensureDirs(): Promise<void> {
    await fs.mkdir(CHATS_DIR, { recursive: true });
}

export async function listChats(): Promise<Chat[]> {
    await ensureDirs();
    const names = await fs.readdir(CHATS_DIR).catch(() => []);
    const chats = await Promise.all(
        names
            .filter((n) => n.endsWith(".jsonl"))
            .map(async (name) => {
                const path = join(CHATS_DIR, name);
                const st = await fs.stat(path);
                return { path, name, mtime: st.mtime };
            })
    );
    return chats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

export async function newChatPath(): Promise<string> {
    return join(CHATS_DIR, `${Date.now()}.jsonl`);
}

export async function tailLines(path: string, n: number): Promise<string> {
    const raw = await fs.readFile(path, "utf8").catch(() => "");
    const lines = raw.split("\n").filter(Boolean);
    return lines.slice(-n).join("\n");
}

export async function appendLine(path: string, line: string): Promise<void> {
    await fs.appendFile(path, line.endsWith("\n") ? line : line + "\n");
}
