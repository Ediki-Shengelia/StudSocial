import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const Font = () => {
  const { setFontSize } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // We store the percentage string as the value
  const [previewSize, setPreviewSize] = useState('100%');

  const options = [
    { label: 'Normal', value: '100%' },   // 16px
    { label: 'Large', value: '125%' },    // 20px
    { label: 'Huge', value: '150%' },   
  
  ];

  const handleConfirm = () => {
    // 1. Save to Context (which should persist to localStorage/DB)
    setFontSize(previewSize); 
    
    // 2. Apply to the root HTML element immediately
    document.documentElement.style.fontSize = previewSize;
    
    navigate('/dashboard'); // Navigating to dashboard instead of login for better UX
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-center backdrop-blur-md">
        
        <h1 className="text-3xl font-bold mb-2">Select Text Size</h1>
        <p className="text-zinc-400 mb-8">This will scale your entire interface.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setPreviewSize(option.value)}
              className={`px-4 py-3 rounded-xl border transition-all ${
                previewSize === option.value 
                ? 'bg-emerald-500 border-emerald-400 text-zinc-950 font-bold' 
                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/30'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5 text-left overflow-hidden">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Live Preview</span>
          {/* We apply the font size as an inline style here for the preview box ONLY */}
          <div style={{ fontSize: previewSize }} className="mt-4 transition-all duration-300 leading-tight">
            <p className="font-semibold text-white">StudSocial Feed</p>
            <p className="text-zinc-400">Everything scales: text, padding, and icons.</p>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98]"
        >
          Looks Good, Let's Go!
        </button>
      </div>
    </div>
  );
};

export default Font;