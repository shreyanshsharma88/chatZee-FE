import { useMediaQuery, Theme } from "@mui/material";

export const useViewPort = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  return { isMobile, isDesktop };
};
