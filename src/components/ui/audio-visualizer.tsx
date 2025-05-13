import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  mediaStream: MediaStream | null;
  numberOfBars?: number;
  barColor?: string;
  gap?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  mediaStream,
  numberOfBars = 64,
  barColor = '#4A90E2',
  gap = 2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mediaStream || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = Math.max(256, Math.pow(2, Math.ceil(Math.log2(numberOfBars)) + 1)); // Ensure fftSize is adequate
    }
    const analyser = analyserRef.current;

    if (!sourceRef.current || sourceRef.current.mediaStream !== mediaStream) {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (mediaStream.getAudioTracks().length === 0) {
        console.warn("AudioVisualizer: Received MediaStream has no audio tracks.");
        return;
      }
      sourceRef.current = audioContext.createMediaStreamSource(mediaStream);
      sourceRef.current.connect(analyser);
    }
    
    if (!dataArrayRef.current || dataArrayRef.current.length !== analyser.frequencyBinCount) {
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    const dataArray = dataArrayRef.current;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current || !ctx) {
        animationFrameIdRef.current = requestAnimationFrame(draw);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const totalBarWidth = (canvasWidth - (numberOfBars - 1) * gap) / numberOfBars;
      const barWidth = Math.max(1, totalBarWidth); // Ensure bar width is at least 1
      let x = 0;

      // Determine the step to pick frequency bins for the number of bars
      const relevantBinCount = Math.floor(analyserRef.current.frequencyBinCount * 0.75); // Focus on lower/mid frequencies
      const step = Math.max(1, Math.floor(relevantBinCount / numberOfBars));


      for (let i = 0; i < numberOfBars; i++) {
        const barIndex = i * step;
        const barHeight = dataArrayRef.current[barIndex % dataArrayRef.current.length] * (canvasHeight / 255);

        ctx.fillStyle = barColor;
        ctx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
        x += barWidth + gap;
      }
      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Source and analyser are intentionally not disconnected here
      // to allow seamless transition if the stream changes but component persists.
      // They are reconnected if mediaStream prop changes.
      // AudioContext is also kept alive for the same reason.
    };
  }, [mediaStream, numberOfBars, barColor, gap]);
  
  // Cleanup AudioContext on component unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      dataArrayRef.current = null;
    };
  }, []);


  return <canvas ref={canvasRef} width="300" height="100" />;
}; 