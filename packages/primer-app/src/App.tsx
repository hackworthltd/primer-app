import { TreeReactFlow, Error } from "@hackworthltd/primer-components";
import "@hackworthltd/primer-components/style.css";
import { useParams } from "react-router-dom";
import { useGetApiProgram } from "./primer-api";

const App = (): JSX.Element => {
  const params = useParams();
  const session = params["sessionId"];

  if (session) {
    const queryRes = useGetApiProgram({ session });

    if (queryRes.isSuccess) {
      const prog = queryRes.data;

      const editableModules = prog.modules.filter((m) => m.editable);
      if (editableModules.length > 1) {
        return (
          <Error
            string={
              "Multiple editable modules: " + JSON.stringify(editableModules)
            }
          />
        );
      }
      const module = editableModules[0];

      if (module) {
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
      } else {
        return <Error string="No editable modules" />;
      }
    } else {
      return (
        <Error
          string={
            "Failed to get program from backend: " +
            JSON.stringify(queryRes.error)
          }
        />
      );
    }
  } else {
    return (
      <Error string={"No session id parameter: " + JSON.stringify(params)} />
    );
  }
};

export default App;
