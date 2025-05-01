import React, { useState, useEffect } from 'react';

type KomodoState = 'open' | 'closed' | 'blink';

export function KomodoImage() {
  const [currentState, setCurrentState] = useState<KomodoState>('open');

  useEffect(() => {
    // Function to trigger a blink sequence
    const triggerBlinkSequence = () => {
      // Blink sequence: open -> blink -> closed -> open
      setCurrentState('blink');
      setTimeout(() => {
        setCurrentState('closed');
        setTimeout(() => {
          setCurrentState('open');
        }, 100); // Keep eyes closed for 100ms
      }, 100); // Show blink frame for 100ms
    };

    // Function to schedule the next blink
    const scheduleNextBlink = () => {
      // Random time between 2 and 8 seconds
      const nextBlinkIn = Math.random() * 6000 + 2000;
      return setTimeout(triggerBlinkSequence, nextBlinkIn);
    };

    // Start the blink cycle
    let blinkTimer = scheduleNextBlink();

    // Cleanup
    return () => {
      clearTimeout(blinkTimer);
    };
  }, []);

  // Map state to image source
  const imageSource = {
    open: '/komodo_open.PNG',
    closed: '/komodo_closed.PNG',
    blink: '/komodo_blink.PNG'
  }[currentState];

  return (
    <img
      src={imageSource}
      alt="Komodo Dragon"
      className="w-24 h-24 object-cover rounded-lg"
    />
  );
} 