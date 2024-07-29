import GetBalance from "./GetBalance";
import { NodeStatus } from "./NodeStatus";

function Header() {
  return (
    <header className="flex flex-row justify-around my-8 p-8">
      <NodeStatus />
      <GetBalance />
    </header>
  );
}

export default Header;
