import { BatchId, Tag, UploadResultWithCid } from "@ethersphere/bee-js";
import { useState } from "react";
import { bee } from "../utils/bee-node";

export interface IUpload {
  postageBatchId: string | BatchId;
  files: File[];
}

export function useUpload() {
  const [uploadResultWithCid, setUploadResultWithCid] =
    useState<UploadResultWithCid>();
  const [tag, setTag] = useState<Tag>();

  const [processing, setIsProcessing] = useState(false);
  const [error, setError] = useState<any>();

  const handleFileUpload = async (args: IUpload) => {
    try {
    
      let result;
      
      setIsProcessing(true);
      if (args) {
        if (args.files.length === 1) {
          result = await bee.uploadFile(
            args.postageBatchId,
            args.files[0],
            args.files[0].name
          );
        }

        if (args.files.length > 1) {
          result = await bee.uploadFiles(args.postageBatchId, args.files);
        }
      }
      setIsProcessing(false);
      setUploadResultWithCid(result);
    } catch (err) {
      console.log("error uploading 101", err);
      setIsProcessing(false);
      setError(err);
    }
  };

  const handleUploadProgress = async () => {
    try {
      if (uploadResultWithCid?.tagUid) {
        setIsProcessing(true);
        const tag = await bee.retrieveTag(uploadResultWithCid.tagUid);

        setTag(tag);
        setIsProcessing(false);
      }
    } catch (err) {
      setIsProcessing(false);
      setError(err);
    }
  };

  return {
    handleUploadProgress,
    tag,
    handleFileUpload,
    uploadResultWithCid,
    processing,
    error,
  };
}
