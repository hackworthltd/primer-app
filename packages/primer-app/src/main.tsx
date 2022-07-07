import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";

import { NoMatch } from "@hackworthltd/primer-components";
import ChooseSession from "./ChooseSession";

const queryClient = new QueryClient();
const rootElement: HTMLElement | null = document.getElementById("root");

render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<ChooseSession />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);
