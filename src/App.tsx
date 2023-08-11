import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider, useCookies } from "react-cookie";
import { CookieSetOptions } from "universal-cookie";
import { v4 as uuidv4 } from "uuid";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Resizable } from "re-resizable";

import "@/index.css";

import { ChooseSession, Edit, NoMatch } from "@/components";

// This ensures that we don't unnecessarily load the tools in production.
// https://tanstack.com/query/v4/docs/react/devtools#devtools-in-production
const ReactQueryDevtoolsPanel = lazy(() =>
  import("@tanstack/react-query-devtools/build/lib/index.prod.js").then(
    (d) => ({
      default: d.ReactQueryDevtoolsPanel,
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
  const [enableDevtools, setEnableDevtools] = useState(import.meta.env.DEV);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  const devToolsMinHeight = 250;
  const devToolsMaxHeight = 500;

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
    window.toggleDevtools =
      // This comment forces a line break to limit the scope of `@ts-ignore`.
      () => setEnableDevtools((old) => !old);
  }, []);

  return (
    <CookiesProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {enableDevtools && (
            <Suspense fallback={null}>
              <button
                className="absolute right-0 z-20 p-4"
                onClick={() => setDevtoolsOpen((old) => !old)}
              >
                <WrenchScrewdriverIcon className="h-10 fill-grey-primary"></WrenchScrewdriverIcon>
              </button>
              {devtoolsOpen && (
                <Resizable
                  enable={{ bottom: true }}
                  defaultSize={{ height: devToolsMinHeight, width: "100%" }}
                  className="fixed z-10 grid grid-cols-[minmax(0,2fr)_1fr]"
                  minHeight={devToolsMinHeight}
                  maxHeight={devToolsMaxHeight}
                >
                  <ReactQueryDevtoolsPanel
                    className="z-20"
                    style={{ height: "inherit", maxHeight: devToolsMaxHeight }}
                    setIsOpen={setDevtoolsOpen}
                    onDragStart={(_) => {}}
                  />

                  <div className="bg-blue-primary"></div>
                </Resizable>
              )}
            </Suspense>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/sessions" />} />
            <Route path="/sessions">
              <Route index element={<ChooseSession />} />
              <Route path=":sessionId" element={<Edit />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

export default App;
