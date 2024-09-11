import { WalletBalance } from "@ethersphere/bee-js";
import { useEffect, useState } from "react";
import utils from "../utils";

export function useWallet() {
  const bee  = utils.getBee()

  const [balance, setBalance] = useState<WalletBalance>();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleCostEstimate();
  }, []);

  const handleCostEstimate = async () => {
    try {
      setIsLoading(true);
      const bal = await bee!.getWalletBalance();
      setBalance(bal);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { balance, error, isLoading };
}
