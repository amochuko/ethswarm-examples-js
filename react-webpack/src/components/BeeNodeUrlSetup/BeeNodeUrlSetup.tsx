import React, { useEffect, useState } from "react";

import { useNodeHealth } from "../../hooks/useNodeHealth";
import utils from "../../utils";

export default function BeeNodeUrlSetup() {
  const [inputUrl, setInputUrl] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isRequired, setIsRequird] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateUrl, setUpdateUrl] = useState(false);

  const { healthError, isLoading: loadingHealth, nodeHealth } = useNodeHealth();

  useEffect(() => {
    getNodeUrl();
    return () => {};
  }, []);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = e.currentTarget.value;

    if (value) {
      setIsRequird(false);
      setInputUrl(value);
    }
  };

  const getNodeUrl = () => {
    const url = utils.getNodeUrl();
    console.log("url", url);
    setUrl(url);
  };

  const handleSetBeeNodeUrl = () => {};

  const handleSubmit = () => {
    try {
      if (inputUrl === "") {
        setIsRequird(true);
        setUrlError("Enter a Bee node URL");
        return;
      }

      if (!utils.isValidURL(inputUrl.trim())) {
        setIsRequird(true);
        setUrlError("Not a valid Bee node URL");
        return;
      }

      setIsSaving(true);

      utils.setBeeNodeUrl(utils.removeSlashFromUrl(inputUrl.trim()));
      setInputUrl("");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container bg">
      {loadingHealth && (
        <p style={{ fontSize: "1.2rem", textAlign: "center" }}>Loading...</p>
      )}
      {healthError && (
        <p style={{ textAlign: "center", fontWeight: 500 }}>
          <span className="error" style={{ fontSize: "1.25rem" }}>
            {healthError === "ERR_NETWORK" && "Error with the network..."}
          </span>{" "}
        </p>
      )}

      {!healthError && url && nodeHealth?.status === "ok" && (
        <div className="container">
          <div className="row">
            <div
              className="bg"
              style={{
                display: "inline-flex",
                gap: "4px",
                flexDirection: "column",
                margin: "48px 0",
                fontWeight: 500,
                fontSize: "1.12rem",
              }}
            >
              <span>Status: {nodeHealth?.status}</span>
              <span>Api Version: {nodeHealth?.apiVersion}</span>
              <span>Version: {nodeHealth?.version}</span>
              <div>Connected to node via: {url}</div>
            </div>
          </div>

          <div className="row">
            <div
              style={{
                display: "inline-flex",
                gap: "4px",
                margin: "48px 0",
              }}
            >
              <button onClick={() => setUpdateUrl(!updateUrl)}>
                {url ? "Update Bee node url" : "Set Bee Node Url"}
              </button>
            </div>
          </div>

          {updateUrl && (
            <div className="row">
              <div>
                <h1 style={{ fontSize: "2rem" }}>
                  Connect to your Bee Node by submitting its URL.
                </h1>
                <p style={{ fontSize: "1.25rem", marginBottom: "24px" }}>
                  (Url would be saved to your browser local storage)
                </p>
              </div>

              <div>
                <label
                  htmlFor="nodeUrl"
                  style={{
                    fontSize: "1.2rem",
                    display: "inline-block",
                    fontWeight: "bolder",
                    marginTop: "24px",
                  }}
                >
                  Bee Node Url
                </label>

                <input
                  onChange={onChange}
                  type="text"
                  name="nodeUrl"
                  id="nodeUrl"
                  height="80px"
                  value={inputUrl}
                  placeholder="Enter node url"
                />
              </div>

              <div className="row">
                {isRequired && (
                  <span style={{ fontSize: "1rem" }} className="error">
                    {urlError}
                  </span>
                )}
              </div>
              <div
                className="row"
                style={{ display: "inline-flex", gap: "24px" }}
              >
                {/* <input
                  style={{ maxWidth: "120px" }}
                  onChange={onChange}
                  type="button"
                  name="nodeUrl"
                  id="nodeUrl"
                  height="80px"
                  value={isSaving ? "Saving..." : "Save"}
                  onClick={handleSubmit}
                /> */}

                <button onClick={handleSubmit}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setUpdateUrl(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
