import React from 'react';
import { AnalysisResult, RiskSeverity } from '../types';
import { AlertTriangle, CheckCircle, AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-500 border-green-500';
  if (score >= 5) return 'text-yellow-500 border-yellow-500';
  return 'text-red-500 border-red-500';
};

const getRiskIcon = (severity: RiskSeverity) => {
  switch (severity) {
    case RiskSeverity.HIGH: return <AlertOctagon className="text-red-500 shrink-0" size={20} />;
    case RiskSeverity.MEDIUM: return <AlertTriangle className="text-yellow-500 shrink-0" size={20} />;
    case RiskSeverity.LOW: return <AlertTriangle className="text-blue-400 shrink-0" size={20} />;
  }
};

const getRiskBorder = (severity: RiskSeverity) => {
  switch (severity) {
    case RiskSeverity.HIGH: return 'border-red-900/50 bg-red-900/10';
    case RiskSeverity.MEDIUM: return 'border-yellow-900/50 bg-yellow-900/10';
    case RiskSeverity.LOW: return 'border-blue-900/50 bg-blue-900/10';
  }
};

export const AnalysisResultView: React.FC<Props> = ({ result, onReset }) => {
  const scoreColor = getScoreColor(result.score);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-24">
      {/* Verdict Card */}
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <ShieldCheckIcon size={120} />
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 relative z-10">
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center bg-dark-900 shadow-inner ${scoreColor}`}>
            <span className="text-5xl font-black">{result.score}</span>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-1">{result.verdict}</h2>
            <p className="text-zinc-400 text-sm">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-200 px-1 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
          深度解读
        </h3>
        
        {result.risks.length === 0 ? (
          <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 text-center text-zinc-400">
            <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
            <p>未发现明显风险，看来是个良心产品/合同。</p>
          </div>
        ) : (
          result.risks.map((risk, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex flex-col gap-2 ${getRiskBorder(risk.severity)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-bold text-zinc-100">
                  {getRiskIcon(risk.severity)}
                  <span>{risk.title}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                  risk.severity === RiskSeverity.HIGH ? 'bg-red-900 text-red-200' : 
                  risk.severity === RiskSeverity.MEDIUM ? 'bg-yellow-900 text-yellow-200' : 'bg-blue-900 text-blue-200'
                }`}>
                  {risk.severity === RiskSeverity.HIGH ? '高危' : risk.severity === RiskSeverity.MEDIUM ? '警惕' : '注意'}
                </span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed pl-7">
                {risk.explanation}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-6 left-0 right-0 px-6 z-40">
        <button
          onClick={onReset}
          className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg shadow-white/10 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-lg active:scale-95 duration-200"
        >
          <RotateCcw size={20} />
          鉴别下一张
        </button>
      </div>
    </div>
  );
};

// Helper icon component for background decoration
const ShieldCheckIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
