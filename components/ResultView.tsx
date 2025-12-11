import React, { useState } from 'react';
import { Button } from './Button';

interface ResultViewProps {
  originalImage: string;
  generatedImage: string;
  onEdit: (prompt: string) => Promise<void>;
  onReset: () => void;
  isProcessing: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  originalImage, 
  generatedImage, 
  onEdit, 
  onReset,
  isProcessing
}) => {
  const [prompt, setPrompt] = useState('');

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await onEdit(prompt);
      setPrompt('');
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pro-headshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onReset} disabled={isProcessing}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Start Over
        </Button>
        <div className="flex gap-3">
          <Button onClick={downloadImage} disabled={isProcessing}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Original */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-300">Original Selfie</h3>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
            <img src={originalImage} alt="Original" className="w-full h-full object-cover opacity-75 grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>

        {/* Generated */}
        <div className="space-y-3">
           <h3 className="text-lg font-medium text-indigo-400 flex items-center gap-2">
            AI Professional Headshot
            <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">Gemini 2.5</span>
           </h3>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 group">
             {isProcessing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                   <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-indigo-200 font-medium animate-pulse">Refining image...</p>
                </div>
             )}
            <img src={generatedImage} alt="Generated Headshot" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Editing Interface */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h4 className="text-white font-semibold text-lg mb-2">Refine with AI</h4>
            <p className="text-slate-400 text-sm mb-4">
              Not quite right? Ask the AI to adjust specific details. 
              Try: "Add a retro filter", "Make me smile more", "Change background to a library".
            </p>
            <form onSubmit={handleEditSubmit} className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your change (e.g., 'Remove glasses', 'Warmer lighting')..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                disabled={isProcessing}
              />
              <Button type="submit" disabled={!prompt.trim() || isProcessing} isLoading={isProcessing}>
                Edit Image
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};