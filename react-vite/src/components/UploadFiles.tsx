import React, { useState } from "react";
import { API_URL } from "../constant";
import { IUpload, useUpload } from "../hooks/useUpload";

type UploadFileState = {} & IUpload;

export const UploadFile = () => {
  const [uploadData, setLoadData] = useState<UploadFileState>({
    files: [],
    postageBatchId: "",
  });

 
  const {
    handleFileUpload,
    uploadResultWithCid,
    error,
    handleUploadProgress,
    processing,
    tag,
  } = useUpload();

  const handleOnchange = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    if (target.type === "file") {
      setLoadData((preState) => ({
        ...preState,
        files: Array.from(target.files as any),
      }));
    } else {
      setLoadData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (uploadData.files.length == 0 || uploadData.postageBatchId == "") {
      return;
    }

    await handleFileUpload({
      postageBatchId: uploadData.postageBatchId,
      files: uploadData.files,
    });

    setLoadData({ files: [], postageBatchId: "" });
  };

  return (
    <section>
      <div className="flex flex-col space-y-12 bg-slate-200 p-8">
        <h2 className="text-2xl mb-6">Upload a file</h2>

        <div className="flex flex-col sm:items-baseline justify-between">
          <label
            htmlFor="postageBatchId"
            className="text-stone-500 font-bold mb-4"
          >
            Batch ID:
          </label>

          <input
            className="p-4 text-stone-500 border-[1px] w-full"
            placeholder="Enter Postage Batch ID"
            type="text"
            value={uploadData.postageBatchId}
            id="postageBatchId"
            name="postageBatchId"
            onChange={handleOnchange}
            disabled={processing}
          />
        </div>

        <div className="flex flex-col sm:items-baseline justify-between">
          <label htmlFor="fileSelected" className="sr-only">
            Upload File
          </label>
          <input
            className="text-stone-500 file:mr-12 file:py-4 file:w-[50%] file:px-12 file:border-[0.5px]
               file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-yellow-500 hover:file:text-black"
            type="file"
            multiple
            id="fileSelected"
            name="fileSelected"
            onChange={handleOnchange}
            disabled={processing}
          />
        </div>
        <button
          onClick={handleUpload}
          className="text-xl border-2 border-solid bg-gray-600 text-white w-56 hover:bg-yellow-500 hover:cursor-pointer hover:text-black p-2"
          disabled={processing}
        >
          {processing ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && (
        <>
          <p className="">{error}</p>
        </>
      )}

      {uploadResultWithCid && (
        <div className="flex flex-col space-y-2 bg-slate-200 p-8">
          <h2 className="text-2xl mb-6">Preview file</h2>
          <p>Reference: {uploadResultWithCid.reference}</p>
          <p>Tag Uid: {uploadResultWithCid.tagUid}</p>
          <p>CID: {uploadResultWithCid.cid()}</p>
          <p className="text-gray-900">
            <a
              href={`${API_URL}/bzz/${uploadResultWithCid.reference}/`}
              target="_blank"
              referrerPolicy="same-origin"
            >
              {`${API_URL}/bzz/${uploadResultWithCid.reference}/`}
            </a>
          </p>
        </div>
      )}
    </section>
  );
};
