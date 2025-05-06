import React from "react";
import { StarBackground } from "../components/StarBackground";

export function StarMapBackgroundPage() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <StarBackground />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "3rem",
            textShadow: "0 2px 16px #000, 0 0 8px #00f",
            fontWeight: 700,
            letterSpacing: 2,
            margin: 0,
          }}
        >
          Star Map Background
        </h1>
      </div>
    </div>
  );
} 