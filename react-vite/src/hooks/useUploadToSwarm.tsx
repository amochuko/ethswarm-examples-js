import { BatchId, Readable, UploadResultWithCid } from "@ethersphere/bee-js";
import { useState } from "react";
import { bee } from "../utils/bee-node";

type UploadArgsType = {
  postageBatchId: string | BatchId;
  data: string | File | Uint8Array | Readable;
};
export function useUploadToSwarm() {
  const [uploadResultWithCid, setUploadResultWithCid] =
    useState<UploadResultWithCid>();

  const [isFileUploading, setIsFileUploading] = useState(false);
  const [errorUploadingFile, setErrorUploadingFile] = useState(false);

  const handleFileUpload = async (args: UploadArgsType) => {
    const file = args.data;
    try {
      const tag = await bee.createTag({});
      
      setIsFileUploading(true);
      const result = await bee.uploadFile(
        args.postageBatchId,
        file,
        file.toString(),
        // { tag }
      );

      setIsFileUploading(false);
      setUploadResultWithCid(result);
    } catch (err) {
      setIsFileUploading(false);
      setErrorUploadingFile(true);
    }
  };

  return {
    handleFileUpload,
    uploadResultWithCid,
    isFileUploading,
    errorUploadingFile,
  };
}
