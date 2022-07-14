import { TreeReactFlow, Error } from "@hackworthltd/primer-components";
import "@hackworthltd/primer-components/style.css";
import { useParams } from "react-router-dom";
import { useGetApiProgram } from "./primer-api";

const App = (): JSX.Element => {
  const params = useParams();
  const session = params["sessionId"];

  if (!session) {
    return (
      <Error string={"No session id parameter: " + JSON.stringify(params)} />
    );
  }
  // This hook is *technically* conditional.
  // But if the condition above fails, then the app is broken anyway.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryRes = useGetApiProgram({ session });

  if (!queryRes.isSuccess) {
    return (
      <Error
        string={
          "Failed to get program from backend: " +
          JSON.stringify(queryRes.error)
        }
      />
    );
  }
  const prog = queryRes.data;

  const editableModules = prog.modules.filter((m) => m.editable);
  if (editableModules.length > 1) {
    return (
      <Error
        string={"Multiple editable modules: " + JSON.stringify(editableModules)}
      />
    );
  }
  const module = editableModules[0];
  if (!module) {
    return <Error string="No editable modules" />;
  }
  const trees = module.defs.flatMap((def) => def.term || []);

  return (
    <div>
      <TreeReactFlow
        trees={trees}
        width={1500}
        height={800}
        nodeWidth={200}
        nodeHeight={100}
      ></TreeReactFlow>
    </div>
  );
};

export default App;
