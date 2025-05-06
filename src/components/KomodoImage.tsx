import React, { useState, useEffect } from 'react';

type KomodoState = 'open' | 'closed' | 'blink';

export function KomodoImage() {
  const [currentState, setCurrentState] = useState<KomodoState>('open');
  const [isQuickBlink, setIsQuickBlink] = useState(true);

  useEffect(() => {
    // Function to trigger quick blink sequence
    const triggerQuickBlink = () => {
      // Sequence: open -> blink -> open
      setCurrentState('blink');
      setTimeout(() => {
        setCurrentState('open');
      }, 150); // Blink frame for 150ms
    };

    // Function to trigger closed eyes sequence
    const triggerClosedEyes = () => {
      // Sequence: open -> closed -> open
      setCurrentState('closed');
      setTimeout(() => {
        setCurrentState('open');
      }, 300); // Keep eyes closed for 300ms
    };

    // Function to schedule the next animation
    const scheduleNextAnimation = () => {
      // Random time between 2 and 6 seconds
      const nextAnimationIn = Math.random() * 4000 + 2000;
      return setTimeout(() => {
        if (isQuickBlink) {
          triggerQuickBlink();
        } else {
          triggerClosedEyes();
        }
        setIsQuickBlink(!isQuickBlink); // Toggle for next time
        blinkTimer = scheduleNextAnimation(); // Schedule next animation
      }, nextAnimationIn);
    };

    // Start the animation cycle
    let blinkTimer = scheduleNextAnimation();

    // Cleanup
    return () => {
      clearTimeout(blinkTimer);
    };
  }, [isQuickBlink]);

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