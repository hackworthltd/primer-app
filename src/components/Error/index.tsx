import "@/index.css";

export type ErrorProps = {
  string: string;
};

export const Error = (p: ErrorProps): JSX.Element => (
  <p className="mx-4">Error: {p.string}</p>
);

export default Error;
