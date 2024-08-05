import { UploadResultWithCid } from "@ethersphere/bee-js";
import { useEffect, useState } from "react";
import { useManifest } from "../hooks/useManifest";

type MultipleUploadResultProps = {
  uploadResultWithCid: UploadResultWithCid;
  link: string;
};

export default function MultipleUploadResult(props: MultipleUploadResultProps) {
  const { getHashes } = useManifest();
  const [refHashes, setRefHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    getHashes(props.uploadResultWithCid.reference)
      .then((hash) => {
        setRefHashes(hash);
      })
      .catch((err) => console.error(err));

  }, [props.uploadResultWithCid]);

  const getHashDetails = () => {
    return Object.keys(refHashes).map((key, i) => (
      <li key={i + key} className="text-gray-900 truncate hover:text-clip">
        <span className="font-semibold"> {i+1}. {key}: </span>{" "}
        <a
          href={`${props.link}/${refHashes[key]}`}
          target="_blank"
          referrerPolicy="same-origin"
        >
          {`${props.link}/${refHashes[key]}`}
        </a>
      </li>
    ));
  };

  return (
    <div className="flex flex-col space-y-2 bg-slate-200 p-8">
      <h2 className="text-2xl mb-6">Preview file</h2>
      <ul className="space-y-4">
        {getHashDetails()}
      </ul>
    </div>
  );
}
