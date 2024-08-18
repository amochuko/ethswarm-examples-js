import { Health } from "@ethersphere/bee-js";
import { useEffect, useState } from "react";
import utils from "../utils";

export const useNodeHealth = () => {
  const [nodeHealth, setNodeHealth] = useState<Health | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [healthError, setHealthError] = useState("");

  const bee = utils.getBee();

  useEffect(() => {
    handleIsNodeOnline();
  }, [nodeHealth?.status]);

  const handleIsNodeOnline = async () => {
    try {
      setIsLoading(true);
      const health = await bee.getHealth();

      setNodeHealth(health);
    } catch (err:any) {
      console.error("erro101:", err.statusText);
      setHealthError(err.statusText);

    } finally {
      setIsLoading(false);
    }
  };

  return {
    healthError,
    nodeHealth,
    isLoading,
  };
};
