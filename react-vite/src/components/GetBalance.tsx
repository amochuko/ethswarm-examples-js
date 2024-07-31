import { Health } from "@ethersphere/bee-js";
import { useWallet } from "../hooks/useWallet";
import HandleCopy from "./HandleCopy";

type NodeStatusProps = {
  nodeHealth: Health | null | undefined;
};
export default function GetBalance(props: NodeStatusProps) {
  const { balance, error, isLoading } = useWallet();

  const bzzBalance = () => Number(balance?.bzzBalance) / 10 ** 16;
  const nativeTokenBalance = () =>
    Number(balance?.nativeTokenBalance) / 10 ** 18;

  return (
    <div className="">
      {props.nodeHealth?.status === "ok" && (
        <>
          <p>{isLoading && "Loading balance..."}</p>
          <p>{error && "Error loading balance..."}</p>

          {!isLoading && !error && (
            <div className="flex flex-col space-y-1">
              <span>{bzzBalance().toString().substring(0, 6)} xBzz</span>
              <span>
                {nativeTokenBalance().toString().substring(0, 6)} xDai
              </span>
              <div className="tooltip">
                {balance?.walletAddress.substring(0, 6)}...
                {balance?.walletAddress.substring(36)}
                <span className="tooltip inline-block">
                  <HandleCopy txt={String(balance?.walletAddress)} />
                  <span className="tooltip-text">{balance?.walletAddress}</span>
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
