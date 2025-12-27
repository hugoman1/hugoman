export enum RiskSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface RiskItem {
  title: string;
  explanation: string;
  severity: RiskSeverity;
}

export interface AnalysisResult {
  score: number;
  verdict: string;
  summary: string;
  risks: RiskItem[];
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
  error?: string;
  result?: AnalysisResult;
  imagePreview?: string;
}