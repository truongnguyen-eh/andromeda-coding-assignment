import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HeroDesignProvider, theme } from "@hero-design/react";
import { ThemeProvider } from "styled-components";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <HeroDesignProvider>
        <RouterProvider router={router} />
      </HeroDesignProvider>
    </ThemeProvider>
  </StrictMode>,
);
