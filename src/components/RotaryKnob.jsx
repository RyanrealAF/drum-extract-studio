import React from 'react';

const RotaryKnob = ({ label, value, onChange, size = 176 }) => {
  // Map value (0-1) to rotation (-135 to 135 degrees)
  const rotation = (value * 270) - 135;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="relative group cursor-pointer"
        style={{ width: size, height: size }}
        onClick={() => onChange && onChange(Math.random())}
      >
        <div className="w-full h-full rounded-full recessed-knob-container flex items-center justify-center p-4">
          <div className="w-full h-full rounded-full border-4 border-black/40 flex items-center justify-center relative">
            {/* Illuminated Ring */}
            <div className="absolute inset-0 rounded-full illuminated-ring pointer-events-none opacity-40 shadow-[0_0_15px_rgba(0,170,255,0.4)]"></div>

            {/* Knob Body */}
            <div
              className="w-3/4 h-3/4 rounded-full glossy-knob relative transform transition-transform duration-300 ease-out ring-2 ring-black"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Indicator Dot/Line */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-primary rounded-full led-indicator-blue"></div>

              {/* Subtle Gradient Highlight */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-[11px] font-black tracking-[0.3em] text-white/40 uppercase mb-2">{label}</h3>
        <div className="text-3xl font-black text-primary tracking-tighter">
          {Math.round(value * 100)}<span className="text-sm ml-0.5 opacity-50">%</span>
        </div>
      </div>
    </div>
  );
};

export default RotaryKnob;
