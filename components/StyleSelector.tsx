import React from 'react';
import { HEADSHOT_STYLES } from '../constants';
import { HeadshotStyle } from '../types';

interface StyleSelectorProps {
  onSelect: (style: HeadshotStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose your professional look</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {HEADSHOT_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style)}
            className="group relative flex flex-col items-start p-6 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-750 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 text-left"
          >
            <div className={`w-12 h-12 rounded-xl ${style.iconColor} mb-4 flex items-center justify-center shadow-lg`}>
              {/* Simple generic icon for abstract representation */}
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              {style.name}
            </h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              {style.description}
            </p>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};