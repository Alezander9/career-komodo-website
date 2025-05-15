import { useState, useEffect, useRef } from "react";

const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayText("");

    const typingInterval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayText(text.substring(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayText;
};

const Typewriter = ({ text, speed }: { text: string; speed: number }) => {
  const displayText = useTypewriter(text, speed);
  return <p>{displayText}</p>;
};

export default Typewriter;
