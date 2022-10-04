import { createRoot } from "react-dom/client";
import { useState } from "react";
import { hook1 } from "@georgefst/lib";

const hook2 = useState;

const Component = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const res1 = hook1({}); // external - crashes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const res2 = hook2({}); // local - fine
  return <div>Success!</div>;
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No root!");
}
const root = createRoot(rootElement);
root.render(<Component />);
