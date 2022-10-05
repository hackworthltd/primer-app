import { createRoot } from "react-dom/client";
import { useState } from "react";
import { hookLib } from "@georgefst/lib";

const hookApp = useState;

const Component = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resLib = hookLib({}); // external - crashes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resApp = hookApp({}); // local - fine
  return <div>Success!</div>;
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No root!");
}
const root = createRoot(rootElement);
root.render(<Component />);
