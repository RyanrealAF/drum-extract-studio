import React, { useState, Suspense, lazy } from 'react';
import { useAudioProcessor } from './useAudioProcessor';
import MainConsole from './src/components/MainConsole';
import Sidebar from './src/components/Sidebar';

const App = () => {
  const { status, progress, results, error, processFile, startMidi, reset } = useAudioProcessor();
  const [sensitivity, setSensitivity] = useState(0.5);
  const [frameThreshold, setFrameThreshold] = useState(0.3);

  const handleUpload = (file) => { file && processFile(file); };

  return (
    <div className="min-h-screen bg-[#020202] text-white/90 font-sans selection:bg-primary/30 selection:text-white p-6 md:p-12">
      {/* Master Studio Header */}
      <header className="max-w-[1400px] mx-auto mb-16 border-b border-white/5 pb-10 flex justify-between items-end relative">
        <div className="absolute top-0 left-0 w-20 h-[2px] bg-primary shadow-[0_0_15px_var(--primary)]"></div>
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
            Studio<span className="text-primary drop-shadow-[0_0_10px_var(--primary)]">Console</span>
            <span className="text-white/10 not-italic font-thin text-3xl ml-2">PRO</span>
          </h1>
          <p className="text-[11px] text-white/20 tracking-[0.8em] uppercase mt-4 font-bold">Precision Stem Extraction & MIDI Synthesis Suite</p>
        </div>
        <div className="text-right hidden md:block group">
          <div className="flex items-center gap-3 justify-end mb-2">
             <div className={`size-2 rounded-full ${status === 'error' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'led-indicator-blue'}`}></div>
             <p className="text-[10px] text-white/30 uppercase font-black tracking-widest group-hover:text-primary transition-colors">Core Engine Status</p>
          </div>
          <p className={`text-sm font-black tracking-widest ${status === 'error' ? 'text-red-500' : 'text-white'}`}>{status.toUpperCase()}</p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <MainConsole
          status={status}
          progress={progress}
          results={results}
          error={error}
          onUpload={handleUpload}
          onStartMidi={startMidi}
          onReset={reset}
          sensitivity={sensitivity}
          setSensitivity={setSensitivity}
          frameThreshold={frameThreshold}
          setFrameThreshold={setFrameThreshold}
        />

        <Sidebar status={status} results={results} progress={progress} />
      </main>

      <footer className="max-w-[1400px] mx-auto mt-32 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] text-white/5 font-black uppercase tracking-[1em]">
         <span>Ref: ST-PRO-2024</span>
         <div className="flex gap-10">
            <span>Latency: 2.4ms</span>
            <span>DSP: 64-bit Float</span>
         </div>
         <span>Node: 0x7FF1</span>
      </footer>
    </div>
  );
};

export default App;
