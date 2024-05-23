import { usePostageBatch } from "../hooks/usePostageBatch";
import { copyText, trimText } from "../utils/format";

export function PostageStamps() {
  const {
    getAllPostageStamps,
    postageStamps,
    getAllStampError,
    isLoadingStamps,
  } = usePostageBatch();

  return (
    <section className="flex flex-col space-y-6 bg-slate-200 p-8">
      <button
        className="text-xl border-2 border-solid bg-gray-600 text-white w-56 hover:bg-yellow-500 hover:cursor-pointer hover:text-black p-2"
        onClick={getAllPostageStamps}
      >
        Get All Postage Stamp
      </button>
      <ul>
        {isLoadingStamps && <li className="p-8 bg-slate-400">Loading...</li>}
        {getAllStampError && (
          <li className="text-red-500 text-">Error fetching Postage stamps!</li>
        )}

        {postageStamps &&
          postageStamps.length > 0 &&
          postageStamps.map((ps) => (
            <li key={ps.batchID} className="flex flex-col mb-4 space-y-1">
              <p onClick={copyText} className="hover:cursor-pointer">
                <span className="text-gray-600 text-ellipsis text-wrap">
                  {" "}
                  BatchID:
                </span>{" "}
                {trimText(ps.batchID)}
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
      {postageStamps && (
        <p className="text-slate-500">
          Total number of Postage Stamps: {postageStamps?.length}
        </p>
      )}
    </section>
  );
}
