import React, { useState, Suspense } from 'react';
import {
  Activity,
  Upload,
  Settings2,
  Download,
  RotateCcw,
  X,
  Layers,
  Sliders,
  Cpu,
  FileAudio,
  ChevronRight
} from 'lucide-react';
import RotaryKnob from './RotaryKnob';
import FaderChannel from './FaderChannel';
import WaveformVisualizer from './WaveformVisualizer';

const MidiPianoRoll = React.lazy(() => import('./MidiPianoRoll'));

const StatusBadge = ({ label, active }) => (
  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${active ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/5'} transition-all duration-500`}>
    <div className={`size-1.5 rounded-full ${active ? 'led-indicator-blue' : 'bg-white/10'}`}></div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-primary' : 'text-white/20'}`}>{label}</span>
  </div>
);

const ProcessingPhase = ({ progress }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-12 animate-in fade-in duration-700">
    <div className="relative">
      <div className="size-48 rounded-full border border-white/5 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Activity className="size-12 text-primary animate-pulse mb-2" />
          <span className="text-[10px] font-black text-primary tracking-[0.3em]">{progress}%</span>
        </div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-primary/40 rounded-full animate-spin"></div>
      </div>
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 rounded-full"></div>
    </div>

    <div className="text-center space-y-2">
      <h3 className="text-xl font-bold tracking-tight text-white uppercase italic">Extracting Core Audio</h3>
      <p className="text-[10px] text-white/40 uppercase tracking-[0.5em]">Decomposing Waveform Matrix...</p>
    </div>

    <div className="w-96 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div
        className="h-full bg-primary shadow-[0_0_15px_var(--primary)] transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const PreviewPhase = ({
  results,
  sensitivity,
  setSensitivity,
  frameThreshold,
  setFrameThreshold,
  onStartMidi
}) => {
  const [volumes, setVolumes] = useState({ vocals: 0.8, bass: 0.7, other: 0.6, main: 0.9 });
  const [thresholds, setThresholds] = useState({ vocals: 0.5, bass: 0.4, other: 0.5 });

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-1000">
      {/* Header Info */}
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Waveform Analysis</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mt-1 font-bold">Signal Pre-Processing & MIDI Parameterization</p>
        </div>
        <div className="flex gap-4">
          <StatusBadge label="Audio In" active />
          <StatusBadge label="DSP Ready" active />
          <StatusBadge label="MIDI Sync" active={false} />
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="bg-black/60 rounded-2xl border border-white/5 p-2 h-64 relative group overflow-hidden waveform-glow">
        <div className="absolute top-4 left-4 z-20 flex gap-4">
          <div className="px-3 py-1 bg-black/80 border border-white/10 rounded flex items-center gap-2">
            <div className="size-1 bg-primary animate-ping rounded-full"></div>
            <span className="text-[8px] font-mono text-primary/80 uppercase">Real-time Stream</span>
          </div>
        </div>
        <WaveformVisualizer url={results.audioUrl} />
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-12 gap-10">
        {/* Left: Parameter Knobs */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <Cpu size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em]">Extraction Engine</span>
          </div>

          <div className="grid grid-cols-2 gap-y-12 gap-x-6 justify-items-center bg-black/30 p-8 rounded-2xl border border-white/5 shadow-inner">
            <RotaryKnob label="Onset" value={sensitivity} onChange={setSensitivity} />
            <RotaryKnob label="Frame" value={frameThreshold} onChange={setFrameThreshold} />
            <RotaryKnob label="Width" value={0.5} onChange={() => {}} />
            <RotaryKnob label="Decay" value={0.3} onChange={() => {}} />
          </div>
        </div>

        {/* Right: Mix Faders */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <Sliders size={16} className="text-primary" />
               <span className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em]">Stem Mixing Matrix</span>
             </div>
             <div className="flex gap-1.5">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-3 bg-white/5 rounded-full"></div>)}
             </div>
          </div>

          <div className="flex justify-between items-end gap-2 bg-black/30 p-2 rounded-2xl border border-white/5 shadow-inner overflow-x-auto no-scrollbar">
            <FaderChannel
              label="Vocals"
              volume={volumes.vocals}
              threshold={thresholds.vocals}
              onVolumeChange={(v) => setVolumes(prev => ({...prev, vocals: v}))}
              onThresholdChange={(t) => setThresholds(prev => ({...prev, vocals: t}))}
            />
            <FaderChannel
              label="Bass"
              volume={volumes.bass}
              threshold={thresholds.bass}
              onVolumeChange={(v) => setVolumes(prev => ({...prev, bass: v}))}
              onThresholdChange={(t) => setThresholds(prev => ({...prev, bass: t}))}
            />
            <FaderChannel
              label="Other"
              volume={volumes.other}
              threshold={thresholds.other}
              onVolumeChange={(v) => setVolumes(prev => ({...prev, other: v}))}
              onThresholdChange={(t) => setThresholds(prev => ({...prev, other: t}))}
            />
            <div className="w-px h-64 bg-white/5 mx-2 self-center"></div>
            <FaderChannel
              label="Master"
              volume={volumes.main}
              onVolumeChange={(v) => setVolumes(prev => ({...prev, main: v}))}
              isMain
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onStartMidi(sensitivity, frameThreshold)}
        className="w-full py-10 bg-primary text-black font-black uppercase italic tracking-widest hover:brightness-110 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_20px_60px_rgba(0,170,255,0.2)] flex items-center justify-center gap-6 text-xl rounded-2xl group"
      >
        <Activity size={28} className="group-hover:animate-pulse" />
        Initialize MIDI Reconstruction
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

const CompletePhase = ({ results, onReset }) => (
  <div className="space-y-10 animate-in zoom-in-95 duration-700">
    <div className="flex items-center justify-between border-b border-white/5 pb-8">
      <div>
        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-primary">Extraction Finalized</h3>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] mt-2 font-bold italic">Artifact Protocol Ready for Deployment</p>
      </div>
      <div className="flex gap-4">
        <StatusBadge label="Complete" active />
        <StatusBadge label="Verified" active />
      </div>
    </div>
    
    <div className="h-96 bg-black/80 rounded-3xl border border-white/10 overflow-hidden relative group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-4 left-6 z-20 flex gap-4">
         <span className="text-[9px] text-primary/60 font-mono tracking-widest uppercase">Grid: 1/16 // Scale: Chromatic // Engine: Studio PRO</span>
      </div>
      <Suspense fallback={<div className="h-full flex items-center justify-center text-[10px] text-white/20 font-black uppercase tracking-widest animate-pulse">Reconstituting MIDI Grid...</div>}>
        <MidiPianoRoll url={results.midiUrl} />
      </Suspense>
    </div>

    <div className="grid grid-cols-2 gap-8">
      <a href={results.midiUrl} download className="flex items-center justify-center gap-4 py-8 bg-white text-black font-black uppercase italic text-sm hover:brightness-90 transition-all transform hover:-translate-y-1 shadow-2xl rounded-2xl">
        <Download size={22} /> Export MIDI Data
      </a>
      <a href={results.drumUrl} download className="flex items-center justify-center gap-4 py-8 border border-white/10 bg-black/40 text-white font-black uppercase italic text-sm hover:bg-white/5 transition-all transform hover:-translate-y-1 rounded-2xl">
        <FileAudio size={22} className="text-primary" /> Download Sample Pack
      </a>
    </div>

    <button
      onClick={onReset}
      className="w-full py-4 text-[10px] text-white/20 hover:text-primary transition-colors uppercase tracking-[0.8em] font-black flex items-center justify-center gap-4 group"
    >
      <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
      Initiate New Session Sequence
    </button>
  </div>
);

const ErrorPhase = ({ error, onReset }) => (
  <div className="bg-red-500/5 border border-red-500/20 p-12 rounded-3xl shadow-2xl relative overflow-hidden animate-in shake duration-500">
    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-6">
        <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
          <X size={32} className="text-red-500" />
        </div>
        <div>
          <span className="text-3xl font-black italic text-red-500 uppercase tracking-tighter">System Malfunction</span>
          <p className="text-[10px] text-red-500/40 uppercase tracking-[0.4em] mt-1 font-bold">Kernel Panic // Core Dump Initiated</p>
        </div>
      </div>
    </div>
    <div className="bg-black/80 p-8 rounded-2xl border border-red-500/10 font-mono text-xs text-red-400/60 mb-10 leading-relaxed shadow-inner">
      <span className="text-red-500 mr-2 font-bold">>></span> {error}
    </div>
    <button
      onClick={onReset}
      className="w-full py-8 bg-red-500 text-white text-sm font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all shadow-2xl rounded-2xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1"
    >
      Execute Emergency Recovery
    </button>
  </div>
);

const UploadPhase = ({ onUpload }) => (
  <div className="h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] hover:border-primary/40 transition-all group bg-black/20 relative overflow-hidden shadow-inner">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary-glow)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

    <div className="absolute top-10 flex gap-1.5">
       {[...Array(4)].map((_, i) => <div key={i} className="size-1.5 bg-white/5 rounded-full"></div>)}
    </div>

    <label className="cursor-pointer flex flex-col items-center z-10 px-20">
      <div className="size-32 border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:border-primary group-hover:scale-105 transition-all duration-700 bg-black/40 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Upload className="size-12 text-white/10 group-hover:text-primary transition-all duration-700" strokeWidth={1} />
      </div>
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black italic text-white/20 group-hover:text-white transition-all duration-700 uppercase tracking-tighter">Initialize Signal Path</h2>
        <p className="text-[11px] text-white/10 uppercase tracking-[0.8em] font-bold group-hover:text-primary/60 transition-colors">Mount Master Stem Audio</p>
      </div>
      <input type="file" className="hidden" onChange={(e) => onUpload(e.target.files[0])} />
    </label>

    <div className="absolute bottom-10 flex items-center gap-4 text-[9px] font-black text-white/5 uppercase tracking-[0.5em]">
      <span>Supported: WAV, MP3, FLAC</span>
      <div className="size-1 bg-white/5 rounded-full"></div>
      <span>Max: 50MB</span>
    </div>
  </div>
);

const MainConsole = ({ 
  status, 
  progress, 
  results, 
  error, 
  onUpload, 
  onStartMidi, 
  onReset, 
  sensitivity, 
  setSensitivity,
  frameThreshold,
  setFrameThreshold
}) => {
  return (
    <div className="lg:col-span-12 console-panel-bg border border-white/5 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)]">
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      {/* Build Info */}
      <div className="absolute bottom-6 right-10 text-[8px] text-white/5 font-black uppercase tracking-[1em] select-none pointer-events-none">
        Studio_PRO_Engine_v4.2.0
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        {status === 'idle' && <UploadPhase onUpload={onUpload} />}
        {(status === 'processing' || status === 'uploading' || status === 'connecting') && <ProcessingPhase progress={progress} />}
        {status === 'awaiting_midi' && (
          <PreviewPhase
            results={results}
            sensitivity={sensitivity}
            setSensitivity={setSensitivity}
            frameThreshold={frameThreshold}
            setFrameThreshold={setFrameThreshold}
            onStartMidi={onStartMidi}
          />
        )}
        {status === 'complete' && <CompletePhase results={results} onReset={onReset} />}
        {error && <ErrorPhase error={error} onReset={onReset} />}
      </div>

      {/* Aesthetic Side Marks */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-10">
         {[...Array(12)].map((_, i) => <div key={i} className="w-4 h-[1px] bg-white"></div>)}
      </div>
    </div>
  );
};

export default MainConsole;
