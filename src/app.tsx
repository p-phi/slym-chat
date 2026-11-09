import React, { useEffect, useState, useCallback } from "react";
import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import { Layout } from "./components/Layout.js";
import { Chat } from "./components/Chat.js";
import { RightPanel } from "./components/RightPanel.js";
import { Input } from "./components/Input.js";
import { listBundles, type Bundle } from "./bundles.js";
import { listChats, ensureDirs, newChatPath } from "./sessions.js";
import { parseTrace, type Turn } from "./transcript.js";
import { runSlym } from "./slym.js";
import { promises as fs } from "node:fs";

type Mode = "pick-agent" | "pick-chat" | "chat";

export function App() {
  const { exit } = useApp();
  const [mode, setMode] = useState<Mode>("pick-agent");
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [chats, setChats] = useState<{ label: string; value: string }[]>([]);
  const [agent, setAgent] = useState<Bundle | null>(null);
  const [chatPath, setChatPath] = useState<string>("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await ensureDirs();
      setBundles(await listBundles());
      const cs = await listChats();
      setChats([
        { label: "+ new chat", value: "__new__" },
        ...cs.map((c) => ({ label: c.name, value: c.path })),
      ]);
    })();
  }, []);

  const loadTurns = useCallback(async (path: string) => {
    const raw = await fs.readFile(path, "utf8").catch(() => "");
    setTurns(parseTrace(raw));
  }, []);

  const send = useCallback(
    async (task: string) => {
      if (!agent || !chatPath || !task.trim()) return;
      setPending(true);
      setError(null);
      try {
        const { answer } = await runSlym(agent.path, chatPath, task);
        setTurns((t) => [
          ...t,
          { role: "user", content: task },
          { role: "assistant", content: answer },
        ]);
      } catch (e) {
        setError(String(e));
      } finally {
        setPending(false);
        setInput("");
      }
    },
    [agent, chatPath]
  );

  const handleCommand = useCallback(
    (v: string): boolean => {
      if (v === "\\q") { exit(); return true; }
      if (v === "\\to") { setMode("pick-agent"); return true; }
      if (v === "\\new") { setChatPath(""); setTurns([]); setMode("pick-chat"); return true; }
      if (v === "\\del") { setMode("pick-chat"); return true; }
      return false;
    },
    [exit]
  );

  if (mode === "pick-agent") {
    return (
      <Box flexDirection="column">
        <Text bold>talk to:</Text>
        <SelectInput
          items={bundles.map((b) => ({ label: b.name, value: b.name }))}
          onSelect={(item) => {
            setAgent(bundles.find((b) => b.name === item.value) ?? null);
            setMode("pick-chat");
          }}
        />
      </Box>
    );
  }

  if (mode === "pick-chat") {
    return (
      <Box flexDirection="column">
        <Text bold>pick a chat (or new):</Text>
        <SelectInput
          items={chats}
          onSelect={async (item) => {
            const path = item.value === "__new__" ? await newChatPath() : item.value;
            setChatPath(path);
            await loadTurns(path);
            setMode("chat");
          }}
        />
      </Box>
    );
  }

  return (
    <Layout
      chat={
        <>
          <Box flexGrow={1} flexDirection="column" overflow="hidden">
            <Chat turns={turns} pending={pending} />
          </Box>
          <Box flexShrink={0} marginTop={1}>
            <Input
              value={input}
              onChange={setInput}
              disabled={pending}
              onSubmit={(v) => {
                if (handleCommand(v)) return;
                void send(v);
              }}
            />
          </Box>
          {error && <Text color="red">{error}</Text>}
        </>
      }    
      right={<RightPanel agent={agent?.name ?? ""} />}
    />
  );
}
