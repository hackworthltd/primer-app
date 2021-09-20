import React from "react";
import CallToAction from "./components/CallToAction";
import Logo from "./components/Logo";

function App() {
  return (
    <div className="container flex overflow-hidden flex-col justify-center items-center w-screen h-screen bg-gray-800">
      <Logo />
      <CallToAction />
    </div>
  );
}

export default App;
