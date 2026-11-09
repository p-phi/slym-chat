import { spawn } from "node:child_process";
import { SLYM_BIN, HISTORY_LINES } from "./config.js";
import { tailLines, appendLine } from "./sessions.js";

export type RunResult = {
    answer: string;
    traceLines: string[];
};

/**
 * Run `slym <bundle> --run <task> --trace` with the chat history on stdin.
 *
 * The runtime's interface (see AGENTS.md):
 *   - stdout: wrapped JSONL, one `{"app":"slym","trace":{...}}` per line
 *   - stderr: logs/errors only
 *   - the answer: the last non-empty assistant `content` in the trace
 */
export async function runSlym(
    bundlePath: string,
    chatPath: string,
    task: string
): Promise<RunResult> {
    const history = await tailLines(chatPath, HISTORY_LINES);

    return new Promise((resolve, reject) => {
        const child = spawn(SLYM_BIN, [bundlePath, "--run", task, "--trace"], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (b: Buffer) => (stdout += b.toString()));
        child.stderr.on("data", (b: Buffer) => (stderr += b.toString()));

        child.on("error", reject);
        child.on("close", async (code) => {
            if (code !== 0) {
                return reject(new Error(`slym exited ${code}: ${stderr}`));
            }

            const traceLines = stdout
                .split("\n")
                .filter((l) => l.startsWith('{"app":"slym"'));

            for (const line of traceLines) {
                await appendLine(chatPath, line);
            }

            let answer = "";
            for (const line of traceLines) {
                try {
                    const msg = JSON.parse(line).trace;
                    if (
                        msg?.role === "assistant" &&
                        typeof msg.content === "string" &&
                        msg.content.trim()
                    ) {
                        answer = msg.content;
                    }
                } catch {
                    // skip malformed lines
                }
            }

            resolve({ answer, traceLines });
        });

        child.stdin.write(history + "\n");
        child.stdin.end();
    });
}
