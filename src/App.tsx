import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/index.css";

import { NoMatch } from "@/components";
import ChooseSession from "@/ChooseSession";
import Edit from "@/Edit";

const queryClient = new QueryClient();

const App = (): JSX.Element => (
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
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
