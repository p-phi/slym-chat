import React from "react";
import { Box } from "ink";
import TextInput from "ink-text-input";

export function Input({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <Box marginTop={1}>
      <TextInput
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={disabled ? "(thinking…)" : "message  (\\to  \\new  \\del  \\q)"}
        focus={!disabled}
      />
    </Box>
  );
}
