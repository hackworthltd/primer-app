import type { AriaProgressBarProps } from "@react-types/progress";
import { useProgressBar } from "react-aria";

import "@/index.css";

export const Spinner = (props: AriaProgressBarProps): JSX.Element => {
  const { progressBarProps } = useProgressBar(props);
  return (
    <div {...progressBarProps}>
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-secondary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_10.0s_linear_infinite]"
        role="presentation"
      />
    </div>
  );
};

export default Spinner;
