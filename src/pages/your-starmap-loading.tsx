import React from "react";
import { StarBackground } from "../components/StarBackground";

export function YourStarmapLoadingPage() {
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "2.5rem",
            textShadow: "0 2px 16px #000, 0 0 8px #00f",
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 32,
          }}
        >
          Your starmap is loading...
        </h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#ffe066',
                opacity: 0.85,
                animation: `starmap-bounce 1.2s infinite cubic-bezier(.36,.07,.19,.97) both`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes starmap-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.7; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
} 