/* eslint-disable no-unused-vars */
import { Stack } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { GroupContainer, LandingPage, Login } from "./components";
import { AppThemeProvider } from "./providers";
import { SocketProvider } from "./providers/SocketProvider";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <Stack
          width="100%"
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Routes>
            <Route path="" element={<Login />} />
            <Route element={<SocketProvider />}>
              <Route path="/:userId" element={<LandingPage />} />
              <Route path="/:userId/:groupId" element={<GroupContainer />} />
            </Route>
          </Routes>
        </Stack>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
