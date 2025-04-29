import React, { useEffect } from 'react';

interface Star {
  id: number;
  size: number;
  x: number;
  y: number;
  speed: number;
}

export function StarBackground() {
  const [stars, setStars] = React.useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars
    const numberOfStars = 200; // Increased number of stars
    const newStars: Star[] = [];
    
    for (let i = 0; i < numberOfStars; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 3 + 1, // 1-4px
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        speed: Math.random() * 20 + 10 // 10-30s for one full animation
      });
    }
    
    setStars(newStars);
  }, []);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: -1,
        overflow: 'hidden'
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: `twinkle ${star.speed}s infinite linear`,
            opacity: Math.random() * 0.7 + 0.3, // Random opacity between 0.3 and 1
          }}
        />
      ))}
    </div>
  );
} 