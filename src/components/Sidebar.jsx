import React, { useState } from 'react';
import { ChevronDown, Volume2, Download, Activity, Terminal } from 'lucide-react';

const AdvancedParameters = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Activity size={40} />
      </div>

      <button 
        onClick={() => setShowAdvanced(!showAdvanced)} 
        className="w-full flex items-center justify-between group"
      >
        <span className="text-[11px] text-white/20 group-hover:text-primary transition-colors uppercase tracking-[0.5em] font-black">Advanced Ops</span>
        <ChevronDown className={`transition-all duration-700 ${showAdvanced ? 'rotate-180 text-primary' : 'text-white/10'}`} size={18} />
      </button>
      
      {showAdvanced && (
        <div className="mt-10 space-y-8 animate-in slide-in-from-top-4 duration-700">
          <div className="p-6 bg-black/60 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-6 font-bold border-b border-white/5 pb-3">Stem Artifacts</p>
            <div className="space-y-6">
              {['Vocals', 'Bass', 'Other'].map(stem => (
                <div key={stem} className="flex justify-between items-center group/item">
                  <span className="text-xs text-white/20 group-hover/item:text-white/60 transition-colors uppercase font-mono tracking-tight">{stem}.wav</span>
                  <div className="px-3 py-1 bg-white/5 rounded border border-white/5 opacity-50 group-hover/item:opacity-100 cursor-not-allowed">
                     <span className="text-[8px] font-black uppercase text-white/40">Locked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[9px] text-primary/40 font-black italic tracking-widest">
             <div className="size-1.5 rounded-full led-indicator-blue"></div>
             <span>PHASE_COHERENCE: OPTIMIZED</span>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosticLog = ({ status, results, progress }) => {
  const [logs] = useState([
    { time: '00:00:01', message: 'Core System Initialization...', type: 'info' },
    { time: '00:00:02', message: 'Neural Engine: Spleeter-v4 // BP-0x2A', type: 'info' }
  ]);

  return (
    <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 h-[350px] flex flex-col shadow-inner">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <p className="text-[11px] text-white/20 uppercase font-black flex items-center gap-4 tracking-[0.5em]">
          <Terminal size={16} className="text-primary/40" /> Kernel Log
        </p>
        <div className="flex gap-1.5">
           {[...Array(3)].map((_, i) => <div key={i} className="size-1 bg-white/5 rounded-full"></div>)}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar font-mono text-[10px]">
        {logs.map((log, index) => (
          <p key={index} className="text-white/10 leading-relaxed">
            <span className="text-white/5">[{log.time}]</span> {log.message}
          </p>
        ))}
        {status !== 'idle' && (
           <p className="text-primary/60 leading-relaxed">
             <span className="text-white/5">[{new Date().toLocaleTimeString()}]</span> ENGINE_STATE: {status.toUpperCase()}
           </p>
        )}
        {results?.taskId && (
          <p className="text-primary/80 leading-relaxed">
            <span className="text-white/5">[{new Date().toLocaleTimeString()}]</span> SIG: {results.taskId.slice(0,16).toUpperCase()}
          </p>
        )}
        {progress > 0 && (
          <p className="text-primary leading-relaxed animate-pulse">
            <span className="text-white/5">[{new Date().toLocaleTimeString()}]</span> >> SYNCING DATA BUFFERS: {progress}%
          </p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
         <div className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
            <span className="text-[9px] text-primary font-black tracking-widest">READY</span>
         </div>
         <span className="text-[9px] text-white/5 font-black uppercase tracking-[0.3em]">Module_Alpha</span>
      </div>
    </div>
  );
};

const Sidebar = ({ status, results, progress }) => {
  return (
    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
      <AdvancedParameters />
      <DiagnosticLog status={status} results={results} progress={progress} />
    </div>
  );
};

export default Sidebar;
