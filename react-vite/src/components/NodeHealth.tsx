import { Health } from "@ethersphere/bee-js";
import { useEffect, useState } from "react";
import { beeDebug } from "../utils/bee-node";

export function NodeHealth() {
  const [nodeHealth, setNodeHealth] = useState<Health>();

  useEffect(() => {
    handleIsNodeOnline();
  }, []);

  const handleIsNodeOnline = async () => {
    const health = await beeDebug.getHealth();
    setNodeHealth(health);
  };

  return (
    <section className="connection-status">
      <p>
        Node status:{" "}
        <span
          className={nodeHealth?.status == "ok" ? "online" : "offline"}
        ></span>
        {nodeHealth?.status == "ok" ? "Connected" : "Disconnected"}
      </p>
    </section>
  );
}
