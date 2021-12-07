import "@/index.css";

export const NoMatch = (): JSX.Element => (
  <div className="grid overflow-hidden grid-cols-1 grid-rows-[auto,1fr] h-screen">
    <div className="mx-1 lg:mx-4">
      <p>Sorry, this page doesn't exist.</p>
    </div>
  </div>
);
