import { useEffect, useState } from "react";
import { usePostageBatch } from "../hooks/usePostageBatch";
import { format } from "../utils/format";

type State = {
  amount: number | string;
  depth: number | string;
  label?: string;
  mutable: boolean;
  [index: string]: any;
};

export const BuyPostageStamp = () => {
  const minimumBatchDepthValue = 21;

  const [buyBtn, setBuyBtn] = useState(false);
  const [values, setValues] = useState<State>({
    amount: "",
    depth: minimumBatchDepthValue,
    label: "",
    mutable: false,
  });

  const {
    buyPostageBatch,
    isBuyPostageBatch,
    newlyCreatedBatchId,
    isErrorBuyPostageBatch,
  } = usePostageBatch();

  useEffect(() => {
    newlyCreatedBatchId &&
      alert(`Newly created Postage Batch ID: ${newlyCreatedBatchId}`);
    isErrorBuyPostageBatch.hasError && alert(`${isErrorBuyPostageBatch.msg}`);
  }, [newlyCreatedBatchId, isErrorBuyPostageBatch.hasError]);

  const handleOnchange = (
    e: React.FormEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    console.log(name, value);
    setValues((preState) => ({ ...preState, [name]: value }));
  };

  const handleBuyPostage = async () => {
    if (+values.depth < 17) {
      alert("Minimal depth is 17");
    }
    if (values.amount == "" && values.label == "" && values.depth == "") {
      console.log("noting... ");
      return;
    } else {
      values.amount = format.parsexBZZ(Number(values.amount));
      console.log("values... ", values);

      // const { amount, depth, mutable, label } = values;
      // await buyPostageBatch({
      //   amount,
      //   depth: Number(depth),
      //   options: {
      //     label,
      //     immutableFlag: Boolean(mutable),
      //   },
      // });

      setValues({ amount: "", depth: 17, label: "", mutable: false });
    }
  };

  const handleCostEstimate = () => {
    // PostageBatchBucket = 2 ** bucketDepth

    // batchDepth :~ how much data can be stored (stamped) by a batch =  2 ** batchDepth
    // ex: if batchDepth = 24, then 2 ** 24 of chunks can be stored.
    // theoretical maxBatchVolume = (2 ** batchDept) * 4kb (one chunk)

    // bucketDepth :~ how many chunks are allowed in each bucket = 2 ** (batchDepth - bucketDepth)
    // ex: with batchDepth = 24, and bucketDepth = 16
    // 2 ** (24 - 16) = 2 ** 8 = 256 chucks/bucket

    const minimumBatchDepthValue = 21;
    const dataOrChunkSize = 2 ** minimumBatchDepthValue; // can be stamped

    // batch Amount (batchCost) : amount of xBZZ in PLUR (1 * 10**16) per chunk in the batch
    // total batchAmount paid for a batch = (2 ** batchDepth) * amount (xBZZ in PLUR)
    // example:
    // batchDepth = 24, amount = 1000000000 PLUR
    // total batchAmount = (2 ** 24) * 1000000000 PLUR = 16777216000000000 PLUR ~ 1.6777216 xBZZ

    // Estimating `amount` needed for desired TTL
    // (stampPrice / gnosisBlocktimeInSeconds) * storageTimeInSeconds (duration)
    // ex: stampPrice = 24000 PLUR, blocktime = 5, duration = 12 days (1 day = 24 hr * 60 min * 60 secs)
    // ttlAmountNeeded for 4 days = (24000 / 5) * (5 * 24 * 60 * 60) = 4976640000 PLUR

    const secsPerDay = 24 * 60 * 60;
    const ttlInDays = 12;
    const storageTimeInSeconds = ttlInDays * secsPerDay;
    const gnosisBlocktimeInSeconds = 5;
    const postpageStampPrice = 24000;

    const ttlAmountNeeded =
      (postpageStampPrice / gnosisBlocktimeInSeconds) * storageTimeInSeconds;

    // console.log("ttlAmountNeeded: ", format.parsePlur(ttlAmountNeeded));

    const batchDepth = 24;
    const totalBatchAmount = ttlAmountNeeded * 2 ** batchDepth;
    const pricePerGBPerMonth = 0.00005435817984;
    const price = pricePerGBPerMonth * 2 ** batchDepth;

    // console.log("totalBatchAmount: ", format.formatPlur(16777216000000000));
  };

  return (
    <section className="flex flex-col space-y-4 bg-slate-200 p-8">
      <h2 className="text-2xl mb-6">Postage Stamp</h2>
      {!buyBtn && (
        <button
          className={`text-xl border-2 border-solid bg-gray-600 text-white w-56 p-2 hover:bg-yellow-500 hover:cursor-pointer hover:text-black`}
          type="submit"
          onClick={() => setBuyBtn(!buyBtn)}
        >
          Buy Stamp
        </button>
      )}

      {buyBtn && (
        <>
          <div className="flex flex-col justify-between sm:flex-row ">
            <div className="flex-col space-y-2 mb-4 text-stone-500 font-medium sm:min-w-[45%]">
              <label htmlFor="label">Batch Label </label>
              <input
                className="p-4 border-[1px] w-full"
                type="text"
                value={values["label"]}
                id="label"
                name="label"
                placeholder="Name of Batch"
                onChange={handleOnchange}
              />
            </div>
            <div className="flex-col space-y-2 text-stone-500 font-medium sm:min-w-[45%]">
              <label htmlFor="amount">Batch Size</label>
              <select
                name="amount"
                id="amount"
                className="p-4 border-[1px] w-full"
                onChange={handleOnchange}
              >
                <option value={" Select size in GB"} style={{ color: "red" }}>
                  Select size in GB
                </option>
                {Array.from([1, 2, 3, 4, 5, 10, 12, 15]).map((e, i) => (
                  <option key={i} value={e * 2}>
                    {e * 2} GB
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="flex-col space-y-2 mb-4 text-stone-500 font-medium sm:min-w-[45%]">
              <label htmlFor="depth">Depth</label>
              <input
                className="p-4 border-[1px] w-full"
                type="number"
                value={values["depth"]}
                id="depth"
                name="depth"
                placeholder="Number of days"
                min={minimumBatchDepthValue}
                onChange={handleOnchange}
              />
            </div>
            <div className="flex-col space-y-2 text-stone-500 font-medium sm:min-w-[45%]">
              <label htmlFor="mutable">Is Mutable</label>
              <select
                name="mutable"
                id="mutable"
                className="p-4 text-stone-500 border-[1px] w-full"
                onChange={handleOnchange}
              >
                <option
                  disabled
                  className="text-slate-600 font-semibold"
                  value={"Select option"}
                >
                  Select option
                </option>
                {Array.from(["false", "true"]).map((e, i) => (
                  <option defaultValue={e} key={i} selected={i === 0}>
                    {e.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-x-4">
            <button
              className={`text-xl border-2 border-solid bg-gray-600 text-white w-32 ${
                values.amount === "" &&
                (values.depth === ""
                  ? "hover:cursor-not-allowed hover:bg-slate-600 text-slate-400"
                  : "hover:bg-yellow-500 hover:cursor-pointer  hover:text-black")
              } p-4`}
              type="submit"
              // disabled={values.amount == "" || values.depth == ""}
              onClick={handleBuyPostage}
            >
              {isBuyPostageBatch ? "Process..." : "Buy"}
            </button>
            <button
              className={`text-xl border-2 border-solid bg-gray-600 text-white w-32 p-4 hover:bg-yellow-500 hover:cursor-pointer hover:text-black`}
              type="submit"
              onClick={() => setBuyBtn(!buyBtn)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </section>
  );
};
