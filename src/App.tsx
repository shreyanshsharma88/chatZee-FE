/* eslint-disable no-unused-vars */
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Chat, Login } from "./components";
import { AppThemeProvider } from "./providers";
import { SocketProvider } from "./providers/SocketProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { Layout } from "./components";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <Container
          sx={{
            backgroundColor: "primary.light",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            justifySelf: "center",
            borderRadius: 10,
            height: "90vh",
            overflow: "scroll",
            scrollbarWidth: "none",
            mt: 6,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "&-ms-overflow-style:": {
              display: "none",
            },
          }}
        >
          <Routes>
            <Route path="" element={<Login />} />
            <Route element={<Layout />}>
              <Route element={<SocketProvider />}>
                <Route path="/:userId" />
                <Route path="/:userId/:groupId" element={<Chat />} />
              </Route>
            </Route>
          </Routes>
        </Container>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
