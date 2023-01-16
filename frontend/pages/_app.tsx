import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import {
  CssBaseline,
  PaletteMode,
  StyledEngineProvider,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/system";
import getTheme from "../styles/theme";
import { SWRConfig } from "swr";
import swrConfig from "../config/swrConfig";
import { UserProvider } from "../contexts/UserContext";
import { NextPageWithLayout } from "../types";
import { ToastContainer } from "react-toastify";
import { RouteGuard } from "../components/auth/RouteGuard";
import { NavProvider } from "../contexts/NavContext";
import { SocketProvider } from "../contexts/SocketContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const systemDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<PaletteMode>(
    // systemDarkMode ? "dark" : "light"
    "dark"
  );
  const getLayout = Component.getLayout ?? ((page) => page);

  const componentWithLayout = getLayout(<Component {...pageProps} />);

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <SWRConfig value={swrConfig}>
          <GoogleOAuthProvider
            clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
          >
            <UserProvider>
              <SocketProvider>
                <NavProvider>
                  <RouteGuard>{componentWithLayout}</RouteGuard>
                  <ToastContainer autoClose={2000} />
                </NavProvider>
              </SocketProvider>
            </UserProvider>
          </GoogleOAuthProvider>
        </SWRConfig>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}

export default MyApp;
