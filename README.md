# slym-chat

A TUI client for [`slym`](https://github.com/p-phi/SlyM).

The chat history is a `chats/*.jsonl` file; each turn invokes `slym` and appends the trace to the chat file. The TUI never owns
state; the file does.

## Run

```bash
npm install
npm run dev
```

Requires `slym` on `PATH`, and `SALARYMAN_ENDPOINT` / `SALARYMAN_MODEL` set.
```

