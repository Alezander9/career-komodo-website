import React, { useEffect, useRef } from "react";

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  delay: number;
}

export function StarBackground() {
  const [stars, setStars] = React.useState<Star[]>([]);
  const [shootingStars, setShootingStars] = React.useState<
    {
      id: number;
      x: number;
      y: number;
      length: number;
      active: boolean;
      angle: number;
      speed: number;
    }[]
  >([]);
  const shootingTimeouts = useRef<NodeJS.Timeout[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const numberOfStars = 200;
    const newStars: Star[] = [];
    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: Math.random() * 10 + 5,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 10,
      });
    }
    setStars(newStars);
  }, []);

  // Multiple shooting stars logic
  useEffect(() => {
    function launchShootingStar() {
      const id = nextId.current++;
      const newStar = {
        id,
        x: Math.random() * 60 + 10,
        y: Math.random() * 20 + 5,
        length: Math.random() * 80 + 100,
        active: true,
        angle: Math.random() * 20 - 10,
        speed: Math.random() * 1.5 + 1.5,
      };
      setShootingStars((prev) => [...prev, newStar]);
      // Remove after 1s
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, 1000);
    }
    // Launch several shooting stars at random intervals
    for (let i = 0; i < 3; i++) {
      const timeout = setTimeout(
        function schedule() {
          launchShootingStar();
          shootingTimeouts.current[i] = setTimeout(
            schedule,
            Math.random() * 4000 + 2000
          );
        },
        Math.random() * 3000 + 1000
      );
      shootingTimeouts.current.push(timeout);
    }
    return () => {
      shootingTimeouts.current.forEach(clearTimeout);
      shootingTimeouts.current = [];
    };
  }, []);

  // Animate all shooting stars
  useEffect(() => {
    let frame: number;
    function animate() {
      setShootingStars((prevStars) =>
        prevStars.map((star) => {
          const dx = Math.cos((star.angle * Math.PI) / 180) * star.speed;
          const dy = Math.sin((star.angle * Math.PI) / 180) * star.speed;
          let newX = star.x + dx;
          let newY = star.y + dy;
          if (newX > 100 || newY > 100) return { ...star, active: false };
          return { ...star, x: newX, y: newY };
        })
      );
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            opacity: star.opacity,
            animation: `twinkle ${star.speed}s infinite ease-in-out`,
            animationDelay: `${star.delay}s`,
            willChange: "opacity, transform",
          }}
        />
      ))}
      {shootingStars
        .filter((s) => s.active)
        .map((shootingStar) => (
          <div
            key={shootingStar.id}
            style={{
              position: "absolute",
              left: `${shootingStar.x}%`,
              top: `${shootingStar.y}%`,
              width: `${shootingStar.length}px`,
              height: "2px",
              background:
                "linear-gradient(90deg, #ffffff 0%, #ffffff 60%, rgba(255,255,255,0) 100%)",
              borderRadius: "2px",
              boxShadow: "0 0 8px 2px #ffffff",
              transform: `rotate(${shootingStar.angle}deg)`,
              opacity: 0.85,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        ))}
    </div>
  );
}
