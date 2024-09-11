import {
  BatchId,
  Bee,
  PostageBatch,
  PostageBatchOptions,
} from "@ethersphere/bee-js";
import { useCallback, useEffect, useState } from "react";
import utils from "../utils";

export interface BuyPostageBatchArgs {
  amount: number;
  depth: number;
  options?: PostageBatchOptions;
}

export function usePostageBatch() {

   const bee = utils.getBee();

  const [postageBatches, setPostageBatch] = useState<PostageBatch[]>();
  const [isLoadingPostageBatch, setIsLoadingStamps] = useState(false);
  const [creatingPostageBatch, setCreatingPostageBatch] = useState(false);
  const [errorCreatingPostageBatch, setErrorCreatingPostageBatch] = useState({
    hasError: false,
    msg: "",
  });
  const [getAllPostageError, setGetAllPostageError] = useState(false);
  const [newlyCreatedStampId, setNewlyCreatedStampId] = useState<BatchId>();
  const [nodeActive, setNodeActive] = useState(false);

  useEffect(() => {
    nodeIsConnected();
    getAllPostageBatches();

    let timeoutId: NodeJS.Timeout;
    console.log("loading...");
    if (getAllPostageError) {
      timeoutId = setTimeout(() => {
        setGetAllPostageError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [nodeActive]);

  const nodeIsConnected = async () => {
    console.log('connected: ', 'conn');
    if (bee) {
      const conn = await bee.isConnected();
      console.log('connected: ', conn);

      setNodeActive(conn);
    }
  };

  const getAllPostageBatches = useCallback(async () => {
    try {
      setIsLoadingStamps(true);

      const ps: PostageBatch[] = await bee.getAllPostageBatch();
      setPostageBatch(ps);
      console.log("ps: ", ps);
    } catch (err) {
      setGetAllPostageError(true);
    } finally {
      setGetAllPostageError(false);
      setIsLoadingStamps(false);
    }
  }, [postageBatches]);

  /**
   * This function creates a Postage Stamp Batch
   * @param args
   */
  const createPostageBatch = async (args: BuyPostageBatchArgs) => {
    console.log("args: ", args);

    // return;
    try {
      setCreatingPostageBatch(true);

      const resBatchId = await bee.createPostageBatch(
        BigInt(args.amount).toString(),
        args.depth,

        {
          ...args.options,
        }
      );

      setCreatingPostageBatch(false);
      setNewlyCreatedStampId(resBatchId);
    } catch (err: any) {
      console.error(err);
      setCreatingPostageBatch(false);
      setErrorCreatingPostageBatch({ hasError: true, msg: err });
    }
  };

  return {
    setErrorCreatingPostageBatch,
    getAllPostageBatches,
    createPostageBatch,
    getAllPostageError,
    postageBatches,
    isLoadingPostageBatch,
    creatingPostageBatch,
    newlyCreatedStampId,
    errorCreatingPostageBatch,
  };
}
