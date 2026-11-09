import React from "react";
import { Box, Text } from "ink";

export function RightPanel({ agent }: { agent: string }) {
  return (
    <Box flexDirection="column" height="100%" justifyContent="flex-end">
      <Text bold>agent</Text>
      <Text color="green">{agent || "(none)"}</Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold>commands</Text>
        <Text dimColor>\to   switch agent</Text>
        <Text dimColor>\new  new chat</Text>
        <Text dimColor>\del  delete chat</Text>
        <Text dimColor>\q    quit</Text>
      </Box>
    </Box>
  );
}
