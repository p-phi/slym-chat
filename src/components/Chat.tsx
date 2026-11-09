import React from "react";
import { Box, Text } from "ink";
import type { Turn } from "../transcript.js";

export function Chat({
  turns,
  pending,
}: {
  turns: Turn[];
  pending: boolean;
}) {
  const visible = turns.slice(-20);
  return (
    <Box flexDirection="column">
      {visible.map((t, i) => {
        if (t.role === "system") return null;
        if (t.role === "tool") {
          return (
            <Text key={i} dimColor>
              · {t.content.split("\n")[0]}
            </Text>
          );
        }
        const label = t.role === "user" ? "you" : "ai ";
        return (
          <Text key={i}>
            <Text color={t.role === "user" ? "cyan" : "green"}>{label}: </Text>
            {t.content}
          </Text>
        );
      })}
      {pending && <Text dimColor>thinking…</Text>}
    </Box>
  );
}
