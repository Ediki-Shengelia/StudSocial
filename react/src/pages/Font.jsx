import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const Font = () => {
  const { setFontSize, setBgColor, setTextColor, bgColor, textColor, fontSize } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [previewSize, setPreviewSize] = useState(fontSize);
  const [previewBg, setPreviewBg] = useState(bgColor);
  const [previewText, setPreviewText] = useState(textColor);

  const options = [
    { label: 'Normal', value: '100%' },
    { label: 'Large', value: '125%' },
    { label: 'Huge', value: '145%' },
  ];

  const handleConfirm = () => {
    setFontSize(previewSize); 
    setBgColor(previewBg);
    setTextColor(previewText);
    navigate('/dashboard'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-2xl text-center backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-2">Interface Settings</h1>
        <p className="text-zinc-400 mb-8">Personalize your view.</p>
        
        <div className="grid grid-cols-3 gap-3 mb-8">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setPreviewSize(option.value)}
              className={`px-4 py-3 rounded-xl border transition-all ${
                previewSize === option.value 
                ? 'bg-emerald-500 text-zinc-950 font-bold' 
                : 'bg-white/5 border-white/10 text-zinc-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-sm mb-2 text-zinc-400">Background</p>
            <input type="color" value={previewBg} onChange={(e) => setPreviewBg(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-none" />
          </div>
          <div>
            <p className="text-sm mb-2 text-zinc-400">Text Color</p>
            <input type="color" value={previewText} onChange={(e) => setPreviewText(e.target.value)} className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-none" />
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-8 border border-white/10 text-left" style={{ backgroundColor: previewBg, color: previewText }}>
          <span className="text-[10px] uppercase opacity-50 font-bold">Preview</span>
          <div style={{ fontSize: previewSize }} className="mt-2">
            <p className="font-bold">StudSocial Dashboard</p>
            <p className="opacity-70">This is how your text and colors will look.</p>
          </div>
        </div>

        <button onClick={handleConfirm} className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all">
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default Font;