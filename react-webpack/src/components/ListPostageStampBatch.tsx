import { Utils } from "@ethersphere/bee-js";
import React, { useState } from "react";
import { usePostageBatch } from "../hooks/usePostageBatch";
import CreatePostageStamp from "./CreatePostageStamp";
import UploadToSwarm from "./UploadToSwarm";
import { useNodeHealth } from "../hooks/useNodeHealth";

export default function ListPostageStampsBatch() {
  const { getAllPostageError, postageBatches, isLoadingPostageBatch } =
    usePostageBatch();

  const { nodeHealth } = useNodeHealth();

  const [name, setValue] = useState("");
  const [selectedBatchId, setSelectBatchId] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setValue(value);
    setSelectBatchId(value);
  };

  const toxBZZ = (plur: number) => {
    const amt = Utils.getAmountForTtl(7);
    // console.log("amount from ttl: ", amt);

    // const costInPlur = Utils.getStampCostInPlur(23)
    //    const costInBzz = Utils.getStampCostInBzz();
    return (plur / 10 ** 16).toFixed(4);
  };

  return (
    <>
      {nodeHealth?.status === "ok" && (
        <>
          <div className="container">
            <CreatePostageStamp />
            <div className="row">
              {getAllPostageError && (
                <p className="error">Error fetching Postage stamps!</p>
              )}
            </div>
            <div className="row">
              {postageBatches && postageBatches.length > 0 && (
                <h2 style={{ fontSize: "2rem", margin: "24px 0" }}>
                  Available Stamps ({postageBatches?.length})
                </h2>
              )}

              <ul className="postageStamps" style={{ margin: "24px 0" }}>
                {isLoadingPostageBatch && <li>Loading...</li>}
                {postageBatches &&
                  postageBatches.map((ps, i) => (
                    <li
                      key={i + ps.batchID.toString()}
                      className="postageStamps"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      id={ps.batchID.toString()}
                    >
                      <span className="unit">
                        <label>Label: </label>
                        <span>{ps.label}</span>
                      </span>
                      <span className="unit">
                        <label>BatchID: </label>
                        <span>
                          {ps.batchID.slice(0, 4) +
                            "...." +
                            ps.batchID.slice(-4)}
                        </span>
                      </span>
                      <span className="unit">
                        <label>Depth: </label>
                        <span>{ps.depth}</span>
                      </span>
                      <span className="unit">
                        <label>Amount: </label>
                        <span>{toxBZZ(+ps.amount)}</span>
                        {Utils.getStampCostInBzz(ps.depth, +ps.amount)}
                      </span>
                      <span className="unit">
                        <label>BucketDepth: </label>
                        <span>{ps.bucketDepth}</span>
                      </span>
                      <span className="unit">
                        <label>Usable: </label>
                        <span>{ps.usable ? "Yes" : "No"}</span>
                      </span>
                      <span className="unit">
                        <label>Utilization: </label>
                        <span>{ps.utilization}</span>
                      </span>
                      <span className="unit">
                        <span>Select</span>
                        <label style={{ display: "none" }}>
                          {ps.batchID.toString()}
                        </label>

                        <input
                          value={ps.batchID.toString()}
                          type="radio"
                          checked={true ? ps.batchID.toString() == name : false}
                          name={`radio-${i}`}
                          onChange={handleChange}
                        />
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            {postageBatches && postageBatches?.length === 0 && (
              <div className="row">
                <p>You don't have any Postage Stamp</p>
              </div>
            )}
          </div>

          <UploadToSwarm selectedBatchId={selectedBatchId} />
        </>
      )}
    </>
  );
}
