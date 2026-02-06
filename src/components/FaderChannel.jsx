import React from 'react';

const FaderChannel = ({ label, volume, threshold, onVolumeChange, onThresholdChange, isMain = false }) => {
  return (
    <div className={`flex flex-col gap-6 p-6 ${isMain ? 'bg-primary/5 border-primary/20 shadow-[0_0_40px_rgba(0,170,255,0.05)]' : 'bg-black/40 border-white/5'} rounded-xl border relative z-10`}>
      <div className={`flex justify-between items-center border-b ${isMain ? 'border-primary/20' : 'border-white/5'} pb-2`}>
        <span className={`text-[10px] font-black uppercase ${isMain ? 'text-primary' : 'text-white/50'} tracking-[0.2em]`}>
          {label}
        </span>
        <div className="flex gap-1.5">
          <div className="size-1.5 rounded-full led-indicator-blue"></div>
          {isMain && <div className="size-1.5 rounded-full led-indicator-blue"></div>}
        </div>
      </div>

      <div className="flex gap-10 h-64 justify-center items-center">
        {/* Main/Volume Fader */}
        <div className="h-56 w-2 fader-groove rounded-full relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
            style={{ writingMode: 'bt-lr', appearance: 'slider-vertical' }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 w-12 h-6 sleek-fader rounded flex items-center justify-center pointer-events-none transition-all duration-150"
            style={{ bottom: `calc(${volume * 100}% - 12px)` }}
          >
            <div className="w-full h-[3px] bg-primary shadow-[0_0_8px_var(--primary)]"></div>
          </div>
        </div>

        {/* Threshold Fader (only if not main, or show two for main to match design) */}
        {(!isMain || true) && (
          <div className="h-56 w-1.5 fader-groove rounded-full relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMain ? volume : threshold}
              onChange={(e) => {
                if (!isMain) {
                   onThresholdChange && onThresholdChange(parseFloat(e.target.value));
                } else {
                   onVolumeChange && onVolumeChange(parseFloat(e.target.value));
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
              style={{ writingMode: 'bt-lr', appearance: 'slider-vertical' }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 w-12 h-6 sleek-fader rounded flex items-center justify-center pointer-events-none transition-all duration-150"
              style={{ bottom: `calc(${(isMain ? volume : threshold) * 100}% - 12px)` }}
            >
              <div className={`w-full h-[3px] ${isMain ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-primary/40'}`}></div>
            </div>
          </div>
        )}
      </div>

      <div className={`bg-black/80 py-2 rounded-lg border ${isMain ? 'border-primary/30' : 'border-white/10'} text-center shadow-inner`}>
        <span className="text-[11px] font-mono font-bold text-primary">
          {(volume * 10).toFixed(1)} dB
        </span>
      </div>
    </div>
  );
};

export default FaderChannel;
