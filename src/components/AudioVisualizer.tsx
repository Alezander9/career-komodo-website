import { useEffect, useRef, useState } from "react";

// https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
export function AudioVisualizer({ audioStream }: { audioStream: MediaStream }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    audioCtxRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    sourceRef.current = source;

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      setAudioData(new Uint8Array(dataArray));
      rafIdRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafIdRef.current as number);
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [audioStream]);

  useEffect(() => {
    if (audioData) {
      draw();
    }
  }, [audioData]);

  function draw() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const height = canvas.height;
    const width = canvas.width;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const dataArray = audioData ?? new Uint8Array(0);
    let x = 0;
    const sliceWidth = (width * 1.0) / dataArray.length;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    console.log(dataArray);

    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i] - 128.0;
      const scale =
        1.0 - Math.abs(i - dataArray.length / 2) / (dataArray.length / 2);
      const y = (item / 255.0) * height * scale + height / 2;
      ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  return <canvas width={300} height={100} ref={canvasRef} />;
}
