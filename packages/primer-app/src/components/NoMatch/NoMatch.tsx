import "@/index.css";

export const NoMatch = (): JSX.Element => (
  <div className="grid h-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden">
    <div className="mx-1 lg:mx-4">
      <p>Sorry, this page doesn&rsquo;t exist.</p>
    </div>
  </div>
);
