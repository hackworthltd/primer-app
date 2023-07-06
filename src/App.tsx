import { useEffect } from "react";
import { RouterProvider } from "@tanstack/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider, useCookies } from "react-cookie";
import { CookieSetOptions } from "universal-cookie";
import { v4 as uuidv4 } from "uuid";

import "@/index.css";

import { router } from "@/router";

const queryClient = new QueryClient();

const idCookieOptions = (path: string): CookieSetOptions => {
  const twoDaysInSeconds = 2 * 24 * 60 * 60;
  const secure = import.meta.env["VITE_WITH_CREDENTIALS"] === "true";
  return {
    path: path,
    maxAge: twoDaysInSeconds,
    secure: secure,
    sameSite: secure ? "strict" : "none",
  };
};

const App = (): JSX.Element => {
  const [cookies, setCookie] = useCookies(["id"]);

  useEffect(() => {
    if (!cookies.id) {
      // This is a dummy cookie in lieu of a proper account system. We
      // don't particularly care about this cookie expiring and/or
      // being cleared.
      const uuid = uuidv4();
      setCookie("id", uuid, idCookieOptions("/"));
    }
  }, [cookies, setCookie]);

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </CookiesProvider>
  );
};

export default App;
