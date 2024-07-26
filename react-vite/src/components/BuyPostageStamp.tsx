import { useEffect, useState } from "react";
import { usePostageBatch } from "../hooks/usePostageBatch";

type State = {
  amount: number | string;
  depth: number | string;
  label?: string;
  mutable: boolean;
};

export const BuyPostageStamp = () => {
  const minimumBatchDepthValue = 21;

  const [buyBtn, setBuyBtn] = useState(false);
  const [values, setValues] = useState<State>({
    amount: "",
    depth: "",
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

     setValues((preState) => ({ ...preState, [name]: value }));
  };

  const handleBuyPostage = async () => {
    values.amount = Number(values.amount) * 1e18;

    const { amount, depth, mutable, label } = values;

    await buyPostageBatch({
      amount,
      depth: Number(depth),
      options: {
        label,
        immutableFlag: Boolean(mutable),
      },
    });

    setValues({ amount: "", depth: "", label: "", mutable: false });
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
              <label htmlFor="label">Batch </label>
              <input
                className="p-4  border-[1px] w-full"
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
                <option defaultValue={" Select size in GB"} disabled>
                  Select size in GB
                </option>
                {Array.from([1, 2, 3, 4, 5, 10, 12, 15]).map((e, i) => (
                  <option key={i} value={e * 2} selected={i === 0}>
                    {e * 2} GB
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="flex-col space-y-2 mb-4 text-stone-500 font-medium sm:min-w-[45%]">
              <label htmlFor="depth">Duration</label>
              <input
                className="p-4  border-[1px] w-full"
                type="number"
                value={values["depth"]}
                id="depth"
                name="depth"
                placeholder="Number of days"
                onChange={handleOnchange}
              />
            </div>
            <div className="flex-col space-y-2 text-stone-500 font-medium sm:min-w-[45%]">
              <label htmlFor="mutable">Mutable</label>
              <select
                name="mutable"
                id="mutable"
                className="p-4 text-stone-500 border-[1px] w-full"
                onChange={handleOnchange}
              >
                <option
                  disabled
                  className="text-slate-600 font-semibold"
                  defaultValue={"Select option"}
                >
                  Select option
                </option>
                {Array.from(["false", "true"]).map((e, i) => (
                  <option value={e} key={i} selected={i === 0}>
                    {e}
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
            {/* <button
              className={`text-xl border-2 border-solid bg-gray-600 text-white w-32 p-4`}
              type="submit"
              onClick={handleBuyPostage}
            >
              {"Buy Me"}
            </button> */}

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
