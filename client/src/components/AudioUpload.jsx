import React, { useState, useRef, useEffect } from "react";

function AudioUpload({ setAudioFile, onReset }) {
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioURL, setAudioURL] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Draw waveform on canvas
  const drawWaveform = (analyser) => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0)";
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2563EB";
      ctx.beginPath();
      const sliceWidth = w / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(w, h / 2);
      ctx.stroke();
    };
    draw();
  };

  const handleFile = (file) => {
    if (!file) return;
    const validTypes = ["audio/wav","audio/mpeg","audio/ogg","audio/flac","audio/mp3","audio/x-flac","audio/x-wav"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|ogg|flac)$/i)) {
      alert("Please upload a valid audio file (.wav, .mp3, .ogg, .flac)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10 MB");
      return;
    }
    setAudioFile(file);
    setFileName(file.name);
    setAudioURL(URL.createObjectURL(file));
    drawStaticWaveform(file);
  };

  const drawStaticWaveform = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const data = decoded.getChannelData(0);
      const w = canvas.width;
      const h = canvas.height;
      const step = Math.ceil(data.length / w);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < w; i++) {
        const slice = Array.from(data.slice(i * step, (i + 1) * step));
        const max = Math.max(...slice.map(Math.abs));
        const yH = max * (h / 2);
        ctx.moveTo(i, h / 2 - yH);
        ctx.lineTo(i, h / 2 + yH);
      }
      ctx.stroke();
      audioCtx.close();
    } catch (e) {}
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleRemove = () => {
    setFileName("");
    setAudioFile(null);
    setAudioURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (onReset) onReset();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      drawWaveform(analyserRef.current);

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const file = new File([blob], "recording.wav", { type: "audio/wav" });
        setAudioFile(file);
        setFileName("recording.wav");
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioCtxRef.current) audioCtxRef.current.close();
      };

      recorder.start();
      setRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="audio-upload-container">
      <div className="upload-controls">
        {/* Upload Action */}
        <div 
          className={`upload-zone ${dragOver ? "drag-over" : ""} ${fileName ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".wav,.mp3,.ogg,.flac,audio/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <span className="upload-icon">📂</span>
          <span className="upload-text">{fileName ? "Change Selection" : "Select Audio File"}</span>
        </div>

        <div className="control-divider">or</div>

        {/* Record Action */}
        <button
          className={`record-button ${recording ? "is-recording" : ""}`}
          onClick={recording ? stopRecording : startRecording}
        >
          <span className="record-icon">{recording ? "⏹" : "🎤"}</span>
          <span className="record-text">{recording ? `Stop (${formatTime(timer)})` : "Capture Live"}</span>
        </button>
      </div>

      {(fileName || recording) && (
        <div className="upload-status-bar">
          <div className="file-info-chip">
            <span className="active-file-name">{fileName || "Live Input..."}</span>
            {fileName && <button className="clear-file" onClick={handleRemove}>✕</button>}
          </div>
          <div className="waveform-container">
            <canvas ref={canvasRef} width={400} height={40} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioUpload;