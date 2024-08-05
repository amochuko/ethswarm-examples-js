import {
  BatchId,
  PostageBatch,
  PostageBatchOptions,
} from "@ethersphere/bee-js";
import { useCallback, useEffect, useState } from "react";
import { bee } from "../utils/bee-node";

export interface BuyPostageBatchArgs {
  amount: number;
  depth: number;
  options?: PostageBatchOptions;
}
export function usePostageBatch() {
  const [postageStamps, setPostageStamps] = useState<PostageBatch[]>();
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);
  const [isBuyPostageBatch, setIsBuyPostageBatch] = useState(false);
  const [isErrorBuyPostageBatch, setIsErrorBuyPostageBatch] = useState({
    hasError: false,
    msg: "",
  });
  const [getAllStampError, setGetAllStampError] = useState(false);
  const [newlyCreatedBatchId, setNewlyCreatedBatchId] = useState<BatchId>();
  const [nodeActive, setNodeActive] = useState(false);

  useEffect(() => {
    nodeIsConnected();
    getAllPostageStamps();

    let timeoutId: NodeJS.Timeout;

    if (getAllStampError) {
      timeoutId = setTimeout(() => {
        setGetAllStampError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [nodeActive]);

  const nodeIsConnected = async () => {
    if (await bee.isConnected()) {
      setNodeActive(true);
    }
  };

  const getAllPostageStamps = useCallback(async () => {
    try {
      setIsLoadingStamps(true);

      const ps: PostageBatch[] = await bee.getAllPostageBatch();
      setPostageStamps(ps);
    } catch (err) {
      setGetAllStampError(true);
    } finally {
      setGetAllStampError(false);
      setIsLoadingStamps(false);
    }
  }, [postageStamps]);

  /**
   * This function creates a Postage Stamp Batch
   * @param args
   */
  const buyPostageBatch = async (args: BuyPostageBatchArgs) => {
    try {
      setIsBuyPostageBatch(true);

      const resBatchId = await bee.createPostageBatch(
        args.amount.toString(),
        args.depth,
        {
          ...args.options,
        }
      );

      setNewlyCreatedBatchId(resBatchId);
      setIsBuyPostageBatch(false);
    } catch (err: any) {
      console.error(err);
      setIsBuyPostageBatch(false);
      setIsErrorBuyPostageBatch({ hasError: true, msg: err });
    }
  };

  return {
    getAllStampError,
    getAllPostageStamps,
    postageStamps,
    isLoadingStamps,
    buyPostageBatch,
    isBuyPostageBatch,
    isErrorBuyPostageBatch,
    newlyCreatedBatchId,
  };
}
