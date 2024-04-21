import { Stack, TextField, Button } from "@mui/material";
import React from "react";
import { useLogin } from "../hooks";

export const Login = () => {
  const { addUser, setValue, value } = useLogin();
  return (
    <Stack direction="column" gap={2}>
      <TextField value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={addUser} variant="contained">
        Login
      </Button>
    </Stack>
  );
};
