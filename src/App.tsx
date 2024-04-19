/* eslint-disable no-unused-vars */
import "./App.css";
import { Button, Container, Stack, TextField } from "@mui/material";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import { SocketProvider } from "./providers/SocketProvider";
import { useEffect } from "react";
import React from "react";
import { GroupContainer, LandingPage } from "./components";

const Login = () => {
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

function App() {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos)})
    }
  
  }, [])
  
  return (
    <Stack width="100%" direction="column" alignItems="center" justifyContent='center'>
      <Routes>
        <Route path="" element={<Login />} />
        <Route element={<SocketProvider />}>
          {/* <Route path="/:userId" element={<Chat />} /> */}
          <Route path="/:userId" element={<LandingPage />} />
          <Route path="/:userId/:groupId" element={< GroupContainer/>} />
        </Route>
      </Routes>
    </Stack>
  );
}

export default App;
