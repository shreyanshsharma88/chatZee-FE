import { FC, PropsWithChildren } from "react";
import { customTheme } from "../theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React from "react";

export const AppThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { getTheme } = customTheme();

  return (
    <ThemeProvider theme={getTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  );
};
