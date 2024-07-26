import { usePostageBatch } from "../hooks/usePostageBatch";
import { format } from "../utils/format";

export function GetPostageStamps() {
  const { postageStamps, getAllStampError, isLoadingStamps } =
    usePostageBatch();

  return (
    <>
      <ul>
        {isLoadingStamps && <li className="p-8 bg-slate-400">Loading...</li>}
        {getAllStampError && (
          <li className="text-red-500 text-">Error fetching Postage stamps!</li>
        )}

        {postageStamps &&
          postageStamps.length > 0 &&
          postageStamps.map((ps) => (
            <li key={ps.batchID} className="flex flex-col mb-4 space-y-1">
              <p onClick={format.copyText} className="hover:cursor-pointer">
                <span className="text-gray-600 text-ellipsis text-wrap">
                  {" "}
                  BatchID:
                </span>{" "}
                {format.trimText(ps.batchID)}
              </p>
              <p>
                <span className="text-gray-600"> Label:</span> {ps.label}
              </p>
              <p>
                <span className="text-gray-600"> BlockNumber:</span>{" "}
                {ps.blockNumber}
              </p>
              <p>
                <span className="text-gray-600"> Amount:</span> {ps.amount}
              </p>
              <p>
                <span className="text-gray-600"> BucketDepth:</span>{" "}
                {ps.bucketDepth}
              </p>
              <p>
                <span className="text-gray-600"> Utilization:</span>{" "}
                {ps.utilization}
              </p>
              <p>
                <span className="text-gray-600"> Exists:</span>{" "}
                {ps.exists ? "Yes" : "No"}
              </p>
              <p>
                <span className="text-gray-600"> Depth:</span> {ps.depth}
              </p>
              <p>
                <span className="text-gray-600"> Immutable Flag:</span>{" "}
                {ps.immutableFlag}
              </p>
              <p>
                <span className="text-gray-600"> Usable:</span>{" "}
                {ps.usable ? "Yes" : "No"}
              </p>
              <p>
                <span className="text-gray-600"> BatchTTL:</span> {ps.batchTTL}
              </p>
            </li>
          ))}
      </ul>

      <section className="flex flex-col p-8 bg-slate-200 text-slate-600 text-lg">
        {postageStamps?.length === 0 && <p>You don't have any Postage Stamp</p>}

        {postageStamps && postageStamps?.length > 0 && (
          <p>Total number of Postage Stamps: {postageStamps?.length}</p>
        )}
      </section>
    </>
  );
}
