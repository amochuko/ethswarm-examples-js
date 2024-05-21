import { useState } from "react";
import { usePostageBatch } from "../hooks/usePostageBatch";

type State = {
  amount: number;
  depth: number;
};

export const CreatePostageBatch = () => {
  const [values, setValues] = useState<State>({ amount: 0, depth: 0 });

  const { createPostageBatch } = usePostageBatch();

  const handleOnchange = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.currentTarget;
    const name = target.name;
    const value = target.value;

    setValues((preState) => ({ ...preState, [name]: value }));
  };

  const handleCreatePostage = () => {
    createPostageBatch(values);
  };

  return (
    <div>
      <label htmlFor="amount">
        Enter Amount
        <input
          type="number"
          value={values["amount"]}
          id="amount"
          name="amount"
          onChange={handleOnchange}
        />
      </label>
      <label htmlFor="dept">
        Enter Amount
        <input
          type="number"
          value={values["depth"]}
          id="dept"
          name="dept"
          onChange={handleOnchange}
        />
      </label>

      <button type="submit" onClick={handleCreatePostage}>
        Submit
      </button>
    </div>
  );
};
