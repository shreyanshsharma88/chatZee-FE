import { createTheme } from "@mui/material";

export const customTheme = () => {
  const getTheme = createTheme({
    typography: {
      allVariants: {
        color: "#fff",
        fontFamily: "Poppins",
      },
    },
    palette: {
      primary: {
        main: "#4C7AED",
        light: "#3E3E5E",
      },
      secondary: {
        main: "#3C3E50",
        light: "#F7F8FF",
      },
      background: {
        default: "#11111D",
        paper: "#1D1D2B",
      },
      info: {
        main: "#8561D8",
      },
      error: {
        main: "#DE4F50",
      },
    },
    components: {
      MuiIconButton: {
        defaultProps: {
          color: "secondary",
        },
      },
    
    },
  });

  return { getTheme };
};
