import React from 'react';
import { ScanSearch } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-8 relative overflow-hidden">
      
      {/* Scanner Effect Container */}
      <div className="relative w-64 h-64 border-2 border-blue-500/30 rounded-2xl overflow-hidden bg-dark-800/50">
        <div className="absolute inset-0 flex items-center justify-center">
            <ScanSearch size={64} className="text-blue-500 opacity-50" />
        </div>
        
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/0 to-blue-500/20 border-b-2 border-blue-500 animate-scan"></div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br"></div>
      </div>

      <div className="text-center space-y-2 relative z-10">
        <h3 className="text-2xl font-bold text-white tracking-wide">专家正在鉴别中...</h3>
        <p className="text-zinc-400 text-sm">正在提取关键信息，分析潜在风险</p>
      </div>
      
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-fast pointer-events-none"></div>
    </div>
  );
};