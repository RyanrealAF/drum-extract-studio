import React, { useEffect, useRef } from 'react';

const WaveformVisualizer = ({ url }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateCanvasSize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth * window.devicePixelRatio;
        canvas.height = containerRef.current.clientHeight * window.devicePixelRatio;
        draw();
      }
    };

    let audioData = null;

    const draw = () => {
      if (!audioData) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const step = Math.ceil(audioData.length / width);
      const amp = height / 2;

      // Draw gradient background lines (grid)
      ctx.strokeStyle = 'rgba(0, 170, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Waveform
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0, 170, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(0, 170, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 170, 255, 0.1)');

      ctx.strokeStyle = '#00aaff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 170, 255, 0.5)';
      ctx.beginPath();

      for (let i = 0; i < width; i++) {
        let min = 1, max = -1;
        for (let j = 0; j < step; j++) {
          const idx = i * step + j;
          if (idx >= audioData.length) break;
          const d = audioData[idx];
          if (d < min) min = d;
          if (d > max) max = d;
        }
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();

      // Reset shadow for performance
      ctx.shadowBlur = 0;
    };

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(b => audioCtx.decodeAudioData(b))
      .then(buf => {
        audioData = buf.getChannelData(0);
        updateCanvasSize();
      })
      .catch(err => console.error("Error loading audio for visualizer:", err));

    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [url]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[150px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default WaveformVisualizer;
