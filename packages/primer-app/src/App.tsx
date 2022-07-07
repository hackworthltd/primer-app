// TODO this is very much a placeholder
import { TreeReactFlow, tree1, tree4 } from "@hackworthltd/primer-components";
import "@hackworthltd/primer-components/style.css";
import { useParams } from "react-router-dom";

const App = (): JSX.Element => {
  const params = useParams();

  return (
    <div>
      {"Session: " + params["sessionId"]}
      <TreeReactFlow
        trees={[tree1, tree4]}
        width={1000}
        height={800}
        nodeWidth={100}
        nodeHeight={40}
      ></TreeReactFlow>
    </div>
  );
};

export default App;
