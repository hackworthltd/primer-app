import { CallToAction, Logo } from "@hackworthltd/primer-components";
import "@hackworthltd/primer-components/style.css";

const App = (): JSX.Element => (
  <div className="container flex overflow-hidden flex-col justify-center items-center w-screen h-screen bg-gray-800">
    <Logo />
    <CallToAction />
  </div>
);

export default App;
