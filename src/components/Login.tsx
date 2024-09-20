import { Stack, TextField, Button, Typography, Chip } from "@mui/material";
import React from "react";
import { useLogin } from "../hooks";

export const Login = () => {
  const { handleClick, setValue, value, password, setPassword, form, setForm } =
    useLogin();
  return (
    <Stack direction="column" gap={2}>
      <Stack>
        <Chip
          label={form}
          sx={{
            textTransform: "capitalize",
            backgroundColor: "secondary.main",
            color: "#fff",
            fontWeight: 700,
          }}
        />
      </Stack>
      <TextField
        label="Username"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <TextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleClick} variant="contained">
        {form === "login" ? "Login" : " Join"}
      </Button>
      <Typography
        onClick={() => {
          setForm(form === "login" ? "signup" : "login");
        }}
      >
        {form === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
      </Typography>
    </Stack>
  );
};
