# Constraints for this project

`slym-chat` is a **client** of `slym`. It does not modify `slym`.

- **State is files.** Chats are `chats/*.jsonl`; config is `config.json`. No database, no in-memory store that outlives the process.
- **`slym` is invoked with `child_process.spawn`**, never with a shell string. Do not use `exec` or `execSync`.
- **The trace is JSONL.** Each line is `{"app":"slym","trace":{...}}`. Parse with `JSON.parse` per line. Do not use a JSONL schema library.
- **Truncation is `tail -n N`.** The chat history is truncated *before* it is passed to `slym`. Do not pass a `--max-history` flag.
- **No session manager.** The chat file *is* the session. `cp` forks it; `rm` deletes it.
- **The TUI is a shell script in TypeScript.** Prefer standard library and Ink. No state management library, no router, no ORM.

