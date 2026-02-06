import React, { useEffect, useRef } from 'react';
import { Midi } from '@tonejs/midi';

const MidiPianoRoll = ({ url }) => {
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

    let midiData = null;

    const draw = () => {
      if (!midiData) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridX = width / 16;
      for (let x = 0; x < width; x += gridX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      let min = 127, max = 0, dur = 0;
      midiData.tracks.forEach(t => t.notes.forEach(n => {
        if (n.midi < min) min = n.midi;
        if (n.midi > max) max = n.midi;
        if (n.time + n.duration > dur) dur = n.time + n.duration;
      }));

      if (dur === 0) return;

      min -= 2; max += 2;
      const range = max - min;

      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0, 170, 255, 0.6)';

      midiData.tracks.forEach((t, trackIdx) => {
        // Use different shades or glows for different tracks if needed
        ctx.fillStyle = trackIdx === 0 ? '#00aaff' : 'rgba(0, 170, 255, 0.5)';

        t.notes.forEach(n => {
          const x = (n.time / dur) * width;
          const wd = (n.duration / dur) * width;
          const y = height - ((n.midi - min) / range) * height;
          const ht = height / range;

          // Draw note with rounded corners if possible, or just rect
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y - ht, Math.max(wd, 2), ht - 2, 2) : ctx.rect(x, y - ht, Math.max(wd, 2), ht - 2);
          ctx.fill();
        });
      });

      ctx.shadowBlur = 0;
    };

    Midi.fromUrl(url).then(midi => {
      midiData = midi;
      updateCanvasSize();
    }).catch(err => console.error("Error loading MIDI for piano roll:", err));

    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [url]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default MidiPianoRoll;
