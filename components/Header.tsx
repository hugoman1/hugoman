import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-900 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-white">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/50">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wide">消除信息差</h1>
      </div>
      <div className="text-xs text-zinc-500 border border-zinc-700 px-2 py-1 rounded-full">
        鉴别专家 v1.0
      </div>
    </header>
  );
};