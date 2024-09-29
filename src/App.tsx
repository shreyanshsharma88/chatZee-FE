/* eslint-disable no-unused-vars */
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Chat, Login } from "./components";
import { AppThemeProvider } from "./providers";
import { SocketProvider } from "./providers/SocketProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
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
              maxWidth: "1400px !important",
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
                  <Route
                    path="/home"
                    element={
                      <Typography variant="h3" pt={4}>
                        Click on any group or user to chat!!
                      </Typography>
                    }
                  />
                  <Route path="/home/:groupId" element={<Chat />} />
                </Route>
              </Route>
            </Routes>
          </Container>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
