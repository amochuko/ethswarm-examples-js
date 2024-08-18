import React, { useEffect, useState } from "react";
import { usePostageBatch } from "../hooks/usePostageBatch";
import useUpload from "../hooks/useUpload";
import utils from "../utils";
import MultipleUploadResult from "./MultipleUploadResult";
import SingleUploadResult from "./SingleUploadResult";

export interface IUpload {
  files: File[];
}

type UploadToSwarmProps = {
  selectedBatchId: string;
};

type PostageUpload = {
  numOfDays: number | string;
  depth: number | string;
};

type PostageUploadOptions = {
  label?: string;
  redundancyLevel?: number;
  mutable?: boolean;
  pin?: boolean;
  encrypt?: boolean;
  deferred?: boolean;
  contentType?: boolean;
  size?: boolean;
};

const uploadOptions: PostageUploadOptions = {
  contentType: false,
  deferred: false,
  encrypt: false,
  mutable: false,
  pin: false,
  size: false,
};

const UploadToSwarm = (props: UploadToSwarmProps) => {
  const bee = utils.getBee();
  const { getAllPostageError, postageBatches, isLoadingPostageBatch } =
    usePostageBatch();
  const { handleFileUpload, uploadResultWithCid, error, processing } =
    useUpload();

  const [fileSize, setFileSize] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [isMultipleFile, setIsMultipleFile] = useState(false);

  const [uploadData, setLoadData] = useState<IUpload>({
    files: [],
  });

  const [checkBoxes, setCheckboxes] = React.useState(
    new Array(Object.keys(uploadOptions).length).fill(false)
  );

  const [uploadDataTwo, setUploadData] = useState<PostageUploadOptions>({
    label: "",
    redundancyLevel: 1,
  });

  useEffect(() => {
    getFileSize();
    getUploadOptions();
  }, [uploadData]);

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    setIsRequired(false);
    setIsMultipleFile(false);

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

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
    index: number = 0
  ): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    if (target.type != "checkbox") {
      setLoadData((prevState) => ({ ...prevState, [name]: value }));
    } else {
      const updatedCheckedStatee = checkBoxes.map((c, i) =>
        i == index ? !c : c
      );
      setCheckboxes(updatedCheckedStatee);
    }
  };

  const handleReset = () => {
    setCheckboxes(checkBoxes.map((c, i) => {}));
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (uploadData.files.length == 0 || props.selectedBatchId == undefined) {
      setIsRequired(true);
      return;
    }

    setIsRequired(false);
    setIsMultipleFile(uploadData.files.length > 1);

    await handleFileUpload({
      postageBatchId: props.selectedBatchId,
      files: uploadData.files,
      options: { ...getUploadOptions() },
    });

    setLoadData({ files: [] });

    // Reset the form
    e.target.reset();
    handleReset();
  };

  const getFileSize = () => {
    // Calculate total size
    let numberOfBytes = 0;

    for (const file of uploadData.files) {
      numberOfBytes += file.size;
    }

    // Approximate to the closest prefixed unit
    const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const exponent = Math.min(
      Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
      units.length - 1
    );
    const approx = numberOfBytes / 1024 ** exponent;

    const size =
      exponent === 0
        ? `${numberOfBytes} bytes`
        : `${approx.toFixed(3)} ${units[exponent]} (${numberOfBytes} bytes)`;

    setFileSize(size);
  };

  const getUploadOptions = () => {
    const obj: Record<string, boolean> = {};

    Object.keys(uploadOptions).forEach((key, i) => {
      if (checkBoxes[i]) {
        obj[key] = checkBoxes[i];
      }
    });

    return obj;
  };
  return (
    <div className="container bg">
      <h2 style={{ fontSize: "2rem", margin: "48px 0" }}>Upload a file</h2>

      <div className="row">
        <form onSubmit={handleUpload}>
          <div>
            <label htmlFor="postageBatchId">
              Select a Postage Batch Id from the above list
            </label>
            <input
              type="text"
              name="postageBatchId"
              id="postageBatchId"
              disabled
              value={props.selectedBatchId}
              placeholder="Postage batch ID"
              style={{ color: "#000", backgroundColor: "#fff" }}
            />
            {isRequired && props.selectedBatchId === "" && (
              <span className="error">
                Please fill in your Postage stamp ID
              </span>
            )}
          </div>
          <div className="">
            <label htmlFor="fileSelected" className="sr-only">
              Upload File
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <input
                type="file"
                multiple
                id="fileSelected"
                name="fileSelected"
                onChange={handleOnChange}
                disabled={processing}
              />

              {uploadData.files.length > 0 && (
                <div style={{ color: "#666666", fontSize: "1rem" }}>
                  <label htmlFor="fileSize">Total size: {fileSize}</label>
                </div>
              )}
            </div>
            {isRequired && uploadData.files.length === 0 && (
              <p
                className="error"
                style={{ marginBottom: "32px", fontSize: "1.2rem" }}
              >
                Please select one or more files
              </p>
            )}
          </div>
          <div className="block">
            <div className="">
              <label htmlFor="redundancyLevel">Redundancy Level:</label>
              <select
                name="redundancyLevel"
                id="redundancyLevel"
                onChange={(e) => handleChange(e)}
              >
                {Array(4)
                  .fill(1)
                  .map((n, i) => (
                    <option defaultValue={n} key={i}>
                      {n + i}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div style={{ margin: "62px 0" }}>
            <h3 style={{ margin: "32px 0" }}>[Upload Options]</h3>

            {Object.keys(uploadOptions).map((key, i) => (
              <div
                key={key + i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label
                  id={key}
                  htmlFor={key}
                  style={{
                    width: "10px",
                    fontSize: "1.3rem",
                  }}
                >
                  {key[0].toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="checkbox"
                  id={`checkbox-${i + 1}`}
                  checked={checkBoxes[i]}
                  name={key}
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={processing}>
            {processing ? "Uploading..." : "Upload"}
          </button>
        </form>

        {error && (
          <>
            <p className="">{error}</p>
          </>
        )}

        {!isMultipleFile && uploadResultWithCid?.reference && (
          <SingleUploadResult
            link={`${utils.getNodeUrl()}/bzz`}
            uploadResultWithCid={uploadResultWithCid!}
          />
        )}

        {isMultipleFile && uploadResultWithCid?.reference && (
          <MultipleUploadResult
            link={`${utils.getNodeUrl()}/bzz`}
            uploadResultWithCid={uploadResultWithCid!}
          />
        )}
      </div>
    </div>
  );
};

export default UploadToSwarm;
