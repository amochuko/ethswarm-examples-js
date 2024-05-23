import { BatchId, PostageBatch } from "@ethersphere/bee-js";
import { useCallback, useEffect, useState } from "react";
import { beeDebug } from "../utils/bee-node";

export interface CreatePostageBatchArgs {
  amount: number;
  depth: number;
}
export function usePostageBatch() {
  const [postageStamps, setPostageStamps] = useState<PostageBatch[]>();
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);
  const [isCreatePostageBatch, setIsCreatePostageBatch] = useState(false);
  const [isErrorCreatePostageBatch, setIsErrorCreatePostageBatch] =
    useState(false);
  const [getAllStampError, setGetAllStampError] = useState(false);
  const [newlyCreatedBatchId, setNewlyCreatedBatchId] = useState<BatchId>();

  useEffect(() => {
    // const timeoutId = setTimeout(() => {
    //   console.log("usePostageStamp timeout");
    //   setGetAllStampError(!getAllStampError);
    // }, 3000);
    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }, []);

  const getAllPostageStamps = useCallback(async () => {
    try {
      setIsLoadingStamps(true);

      const ps: PostageBatch[] = await beeDebug.getAllPostageBatch();
      setPostageStamps(ps);

      setIsLoadingStamps(false);
      setGetAllStampError(false);
    } catch (err) {
      setIsLoadingStamps(false);
      setGetAllStampError(true);
    }
  }, [postageStamps]);

  /**
   * This function creates a Postage Stamp Batch
   * @param args
   */
  const createPostageBatch = async (args: CreatePostageBatchArgs) => {
    try {
      setIsCreatePostageBatch(true);
      const resBatchId = await beeDebug.createPostageBatch(
        args.amount.toString(),
        args.depth
      );

      setNewlyCreatedBatchId(resBatchId);
      setIsCreatePostageBatch(false);
    } catch (err) {
      console.log(err);
      setIsCreatePostageBatch(false);
      setIsErrorCreatePostageBatch(true);
    }
  };

  return {
    getAllStampError,
    getAllPostageStamps,
    postageStamps,
    isLoadingStamps,
    createPostageBatch,
    isCreatePostageBatch,
    isErrorCreatePostageBatch,
    newlyCreatedBatchId,
  };
}
