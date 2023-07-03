import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CookiesProvider, useCookies } from "react-cookie";
import { CookieSetOptions } from "universal-cookie";
import { v4 as uuidv4 } from "uuid";

import "@/index.css";

import { ChooseSession, Edit, NoMatch } from "@/components";

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/lib/index.prod.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

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
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    if (!cookies.id) {
      // This is a dummy cookie in lieu of a proper account system. We
      // don't particularly care about this cookie expiring and/or
      // being cleared.
      const uuid = uuidv4();
      setCookie("id", uuid, idCookieOptions("/"));
    }
  }, [cookies, setCookie]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <CookiesProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Navigate to="/sessions" />} />
            <Route path="/sessions">
              <Route index element={<ChooseSession />} />
              <Route path=":sessionId" element={<Edit />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen position="top-left" />
          {showDevtools && (
            <Suspense fallback={null}>
              <ReactQueryDevtoolsProduction position="top-left" />
            </Suspense>
          )}
        </QueryClientProvider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

export default App;
