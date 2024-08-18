import { BatchId, Tag, UploadResultWithCid } from "@ethersphere/bee-js";
import { useState } from "react";
import utils from "../utils";

export interface IUpload {
  postageBatchId: string | BatchId;
  files: File[];
  options: Record<string, boolean>;
}

const useUpload = () => {
  const bee = utils.getBee();

  const [uploadResultWithCid, setUploadResultWithCid] =
    useState<UploadResultWithCid>();
  const [tagProgress, setTagProgress] = useState<Tag>();
  const [processing, setIsProcessing] = useState(false);
  const [error, setError] = useState<any>();

  const handleFileUpload = async (args: IUpload) => {
    console.log(args);

    try {
      let result;
      setIsProcessing(true);

      if (args) {
        if (args.files.length === 1) {
          result = await bee!.uploadFile(
            args.postageBatchId,
            args.files[0],
            args.files[0].name,
            { ...args.options }
          );
        }

        if (args.files.length > 1) {
          result = await bee!.uploadFiles(args.postageBatchId, args.files, {
            ...args.options,
          });
        }
      }
      setIsProcessing(false);
      setUploadResultWithCid(result);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setError(err);
    }
  };

  const getTagProgress = async () => {
    try {
      if (uploadResultWithCid?.tagUid) {
        setIsProcessing(true);
        const tag = await bee!.retrieveTag(uploadResultWithCid.tagUid);

        setTagProgress(tag);
        setIsProcessing(false);
      }
    } catch (err) {
      setIsProcessing(false);
      setError(err);
    }
  };

  return {
    getTagProgress,
    tagProgress,
    handleFileUpload,
    uploadResultWithCid,
    processing,
    error,
  };
};

export default useUpload;
