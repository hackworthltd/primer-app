import "@/index.css";

export const CallToAction = (): JSX.Element => (
  <div className="flex flex-col justify-items-center items-center">
    <p className="text-3xl font-light leading-4 text-white">
      Edit <code>src/App.tsx</code> and save to reload.
    </p>
    <a
      className="mt-4 font-serif text-3xl text-blue-400 hover:text-[#ff69b4]"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </div>
);
