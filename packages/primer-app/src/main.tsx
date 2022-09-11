import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import { NoMatch } from "@hackworthltd/primer-components";
import ChooseSession from "./ChooseSession";
import App from "./App";

const queryClient = new QueryClient();
const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "The HTML root element doesn't exist. Please report this error!"
  );
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Navigate to="/sessions" />} />
          <Route path="/sessions">
            <Route index element={<ChooseSession />} />
            <Route path=":sessionId" element={<App />} />
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
