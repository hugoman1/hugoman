import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';
import { AnalysisResultView } from './components/AnalysisResultView';
import { AnalysisResult, AnalysisState } from './types';
import { analyzeImage } from './services/geminiService';
import { Upload, Camera, FileText, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
       setState({ status: 'error', error: '图片太大，请上传10MB以内的图片' });
       return;
    }

    setState({ status: 'uploading' });

    try {
      // Create local preview
      const previewUrl = URL.createObjectURL(file);
      setState({ status: 'analyzing', imagePreview: previewUrl });

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Content = base64String.split(',')[1];
        const mimeType = file.type || 'image/jpeg';
        
        try {
          const result = await analyzeImage(base64Content, mimeType);
          setState({ status: 'success', result, imagePreview: previewUrl });
        } catch (err: any) {
          console.error(err);
          setState({ 
            status: 'error', 
            error: err.message || '鉴别失败，请检查网络或更换图片重试。',
            imagePreview: previewUrl 
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setState({ status: 'error', error: '无法读取文件' });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const resetAnalysis = () => {
    setState({ status: 'idle' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-dark-900 text-zinc-100 font-sans selection:bg-blue-500/30">
      <Header />
      
      <main className="container mx-auto max-w-lg px-4 pt-6 pb-20">
        
        {/* Idle State / Upload Area */}
        {state.status === 'idle' && (
          <div className="flex flex-col gap-8 animate-fade-in mt-4">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white">打破信息不对称</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                上传配料表、租房合同或体检报告，<br/>让20年经验的专家帮你避坑。
              </p>
            </div>

            <div 
              onClick={triggerUpload}
              className="border-2 border-dashed border-zinc-700 hover:border-blue-500 hover:bg-dark-800 transition-all rounded-3xl p-10 flex flex-col items-center justify-center gap-6 cursor-pointer group active:scale-95 duration-200 bg-dark-800/30"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform">
                <Camera size={40} className="text-white" />
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">点击上传图片</span>
                <span className="text-sm text-zinc-500">支持 JPG, PNG</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FeatureCard icon={<FileText size={20} />} title="配料表分析" desc="识别科技与狠活" />
               <FeatureCard icon={<AlertCircle size={20} />} title="合同避坑" desc="发现霸王条款" />
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Loading State */}
        {(state.status === 'analyzing' || state.status === 'uploading') && (
           <LoadingState />
        )}

        {/* Error State */}
        {state.status === 'error' && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
            <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center border border-red-900">
               <AlertCircle size={40} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">出错了</h3>
              <p className="text-zinc-400 px-4 break-words text-sm max-w-xs mx-auto">
                {state.error}
              </p>
            </div>
            <button 
              onClick={resetAnalysis}
              className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white font-medium transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {/* Success Result State */}
        {state.status === 'success' && state.result && (
          <AnalysisResultView result={state.result} onReset={resetAnalysis} />
        )}

      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-dark-800/50 border border-dark-700 p-4 rounded-xl flex flex-col gap-2">
    <div className="text-blue-400">{icon}</div>
    <div className="font-bold text-zinc-200">{title}</div>
    <div className="text-xs text-zinc-500">{desc}</div>
  </div>
);

export default App;