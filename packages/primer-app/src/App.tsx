import { exampleSessionsMeta, exampleAccount, SessionsPage } from "@hackworthltd/primer-components";

import "@hackworthltd/primer-components/style.css";

const App = (): JSX.Element => (
  <SessionsPage account={exampleAccount} sessions={exampleSessionsMeta()} />
);

export default App;
