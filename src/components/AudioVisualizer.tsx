import { useEffect, useRef, useState } from "react";

// https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
export function AudioVisualizer({ audioStream }: { audioStream: MediaStream }) {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    audioCtxRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    sourceRef.current = source;

    sourceRef.current.connect(analyser);

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      setAudioData(dataArray);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafIdRef.current as number);
      analyser.disconnect();
      source.disconnect();
    };
  }, [audioStream]);

  return <textarea value={audioData?.toString()} />;
}
