import { useNodeHealth } from "../hooks/useNodeHealth";

export function NodeStatus() {
  const { nodeHealth } = useNodeHealth();


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
