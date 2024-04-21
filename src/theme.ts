import { createTheme } from "@mui/material";

export const customTheme = () => {
  const getTheme = createTheme({
    palette: {
      primary: {
        main: "#4C7AED",
      },
      secondary: {
        main: "#898EBA",
        light: "#F7F8FF",
      },
      background: {
        default: "#E6F4F1",
      },
    },
  });
  return { getTheme };
};
