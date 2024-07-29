import { useNodeHealth } from "../hooks/useNodeHealth";

export function NodeStatus() {
  const { nodeHealth } = useNodeHealth();

  return (
    <div className="connection-status">
      <p>
        <span
          className={nodeHealth?.status == "ok" ? "online" : "offline"}
        ></span>
        {nodeHealth?.status == "ok" ? "Connected" : "Disconnected"}
      </p>
    </div>
  );
}
