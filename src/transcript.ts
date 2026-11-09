export type Turn = { role: string; content: string; tool_calls?: unknown };

/**
 * Parse wrapped JSONL (`{"app":"slym","trace":{...}}`) or bare JSONL
 * (`{"role":...}`) into a list of turns. Malformed lines are skipped.
 */
export function parseTrace(raw: string): Turn[] {
    const turns: Turn[] = [];
    for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        try {
            const parsed = JSON.parse(line);
            const msg = parsed?.trace ?? parsed;
            if (typeof msg?.role === "string") {
                turns.push({
                    role: msg.role,
                    content: typeof msg.content === "string" ? msg.content : "",
                    tool_calls: msg.tool_calls,
                });
            }
        } catch {
            // Skip malformed lines: the chat file may have partial writes.
        }
    }
    return turns;
}
