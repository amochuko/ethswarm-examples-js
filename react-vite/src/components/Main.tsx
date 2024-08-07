import { useNodeHealth } from "../hooks/useNodeHealth";
import { usePostageBatch } from "../hooks/usePostageBatch";
import { PostageStamps } from "./PostageStamps";
import { UploadFile } from "./UploadFiles";

function Main() {
  const { postageStamps } = usePostageBatch();
  const { nodeHealth } = useNodeHealth();

  return (
    <main className="flex-grow">
      {nodeHealth?.status == "ok" && (
        <>
          <PostageStamps />
          {postageStamps && postageStamps?.length > 0 && <UploadFile />}
        </>
      )}
    </main>
  );
}

export default Main;
