import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleSelector } from './components/StyleSelector';
import { ResultView } from './components/ResultView';
import { AppStep, HeadshotStyle } from './types';
import { generateHeadshot, editHeadshot } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setStep(AppStep.STYLE_SELECT);
  };

  const handleStyleSelected = async (style: HeadshotStyle) => {
    if (!originalImage) return;

    setStep(AppStep.PROCESSING);
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await generateHeadshot(originalImage, style.promptModifier);
      
      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        setStep(AppStep.RESULT);
      } else {
        setErrorMessage(result.error || "Failed to generate image");
        setStep(AppStep.STYLE_SELECT);
      }
    } catch (e) {
      setErrorMessage("An unexpected error occurred");
      setStep(AppStep.STYLE_SELECT);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async (prompt: string) => {
    // We edit the currently generated image if it exists, otherwise the original
    const sourceImage = generatedImage || originalImage;
    if (!sourceImage) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await editHeadshot(sourceImage, prompt);
      
      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      } else {
        setErrorMessage(result.error || "Failed to edit image");
      }
    } catch (e) {
      setErrorMessage("An unexpected error occurred during editing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setStep(AppStep.UPLOAD);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              ProHeadshot AI
            </h1>
          </div>
          {/* Progress Indicator */}
           <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
             <span className={`${step === AppStep.UPLOAD ? 'text-indigo-400' : ''}`}>1. Upload</span>
             <span className="w-4 h-px bg-slate-700"></span>
             <span className={`${step === AppStep.STYLE_SELECT ? 'text-indigo-400' : ''}`}>2. Style</span>
             <span className="w-4 h-px bg-slate-700"></span>
             <span className={`${step === AppStep.RESULT ? 'text-indigo-400' : ''}`}>3. Result</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 flex items-center justify-between animate-fadeIn">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-300 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {step === AppStep.UPLOAD && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Professional Headshots,<br />
                <span className="text-indigo-400">Instantly.</span>
              </h2>
              <p className="text-lg text-slate-400">
                Upload a casual selfie and let our AI transform it into a studio-quality professional headshot. No photographer needed.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} />
            
            <div className="grid grid-cols-3 gap-8 mt-12 text-center text-slate-500 text-sm">
              <div>
                <div className="font-semibold text-slate-300 mb-1">Fast & Private</div>
                Processed securely
              </div>
              <div>
                <div className="font-semibold text-slate-300 mb-1">High Resolution</div>
                Export in HD
              </div>
              <div>
                <div className="font-semibold text-slate-300 mb-1">AI Editing</div>
                Customize with text
              </div>
            </div>
          </div>
        )}

        {step === AppStep.STYLE_SELECT && (
          <div className="animate-fadeIn">
            <div className="flex justify-start mb-6">
              <button 
                onClick={() => setStep(AppStep.UPLOAD)}
                className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Upload
              </button>
            </div>
            <StyleSelector onSelect={handleStyleSelected} />
          </div>
        )}

        {step === AppStep.PROCESSING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fadeIn">
             <div className="relative w-24 h-24 mb-8">
               <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
               </div>
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Creating your headshot</h3>
             <p className="text-slate-400 max-w-md">
               The AI is analyzing features, adjusting lighting, and generating your new professional look. This usually takes about 10-15 seconds.
             </p>
          </div>
        )}

        {step === AppStep.RESULT && originalImage && generatedImage && (
          <ResultView 
            originalImage={originalImage}
            generatedImage={generatedImage}
            onEdit={handleEdit}
            onReset={handleReset}
            isProcessing={isProcessing}
          />
        )}
      </main>
    </div>
  );
};

export default App;