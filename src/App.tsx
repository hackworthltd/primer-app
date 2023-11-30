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
import { DevOptions } from "@/components/Edit";

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
  const [devOpts, setDevOpts] = useState<DevOptions>({
    showIDs: false,
    alwaysShowLabels: false,
  });

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
                className="absolute right-0 z-50 p-4"
                onClick={() => setDevtoolsOpen((old) => !old)}
              >
                <WrenchScrewdriverIcon className="h-10 fill-grey-primary"></WrenchScrewdriverIcon>
              </button>
              {devtoolsOpen && (
                <Resizable
                  enable={{ bottom: true }}
                  defaultSize={{ height: devToolsMinHeight, width: "100%" }}
                  className="fixed grid grid-cols-[minmax(0,2fr)_1fr]"
                  minHeight={devToolsMinHeight}
                  maxHeight={devToolsMaxHeight}
                >
                  <ReactQueryDevtoolsPanel
                    style={{ height: "inherit", maxHeight: devToolsMaxHeight }}
                    setIsOpen={setDevtoolsOpen}
                    onDragStart={(_) => {}}
                  />
                  <DevMenu opts={devOpts} set={setDevOpts} />
                </Resizable>
              )}
            </Suspense>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/sessions" />} />
            <Route path="/sessions">
              <Route index element={<ChooseSession />} />
              <Route path=":sessionId" element={<Edit {...devOpts} />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

const DevMenu = (p: { opts: DevOptions; set: (opts: DevOptions) => void }) => (
  <div className="bg-blue-primary pl-1 text-white-primary">
    <div>
      <input
        type="checkbox"
        id="showIDs"
        checked={p.opts.showIDs}
        onChange={(e) => p.set({ ...p.opts, showIDs: e.target.checked })}
        className="mr-1"
      />
      <label htmlFor="showIDs">show node IDs</label>
    </div>
    <div>
      <input
        type="checkbox"
        id="alwaysShowLabels"
        checked={p.opts.alwaysShowLabels}
        onChange={(e) =>
          p.set({ ...p.opts, alwaysShowLabels: e.target.checked })
        }
        className="mr-1"
      />
      <label htmlFor="alwaysShowLabels">always show labels</label>
    </div>
  </div>
);

export default App;
