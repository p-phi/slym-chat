import React, { type ReactNode } from "react";
import { Box } from "ink";

export function Layout({
  chat,
  right,
}: {
  chat: ReactNode;
  right: ReactNode;
}) {
  return (
    <Box height="100%">
      <Box
        width="60%"
        height="100%"
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        {chat}
      </Box>
      <Box
        width="40%"
        height="100%"
        flexDirection="column"
        marginLeft={1}
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
      >
        {right}
      </Box>
    </Box>
  );
}
