import React from "react";
import BeeNodeUrlSetup from "./BeeNodeUrlSetup/BeeNodeUrlSetup";
import ListPostageStampsBatch from "./ListPostageStampBatch";

export default function Home() {
  const date = new Date();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
      }}
    >
      <header>
        <BeeNodeUrlSetup />
      </header>
      <main style={{}}>
        <ListPostageStampsBatch />
      </main>
      <footer style={{ textAlign: "center", marginBottom: "12px" }}>
        {" "}
        &copy; {date.getFullYear()}
      </footer>
    </div>
  );
}
