import CallToAction from "./components/CallToAction";
import Logo from "./components/Logo";

// Required to activate local fonts via Fontsource.
import "@fontsource/source-sans-pro";
import "@fontsource/source-serif-pro";
import "@fontsource/source-code-pro";

const App = (): JSX.Element => (
  <div className="container flex overflow-hidden flex-col justify-center items-center w-screen h-screen bg-gray-800">
    <Logo />
    <CallToAction />
  </div>
);

export default App;
