import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const Font = () => {
  const { setFontSize, setBgColor, setTextColor, bgColor, textColor, fontSize } = useContext(AuthContext);
  const navigate = useNavigate();

  const [previewSize, setPreviewSize] = useState(fontSize);
  const [previewBg, setPreviewBg] = useState(bgColor);
  const [previewText, setPreviewText] = useState(textColor);

  const fontOptions = [
    { label: 'Normal', value: '100%' },
    { label: 'Large', value: '125%' },
    { label: 'Huge', value: '145%' },
  ];

  // Colors mapped directly from your reference images
  const themePresets = [
    { name: 'Default', bg: '#09090b', text: '#f4f4f5' }, // Dark Zinc
    { name: 'High Contrast (Yellow)', bg: '#ffff00', text: '#000000' }, 
    { name: 'High Contrast (Blue)', bg: '#0000ff', text: '#ffffff' },
    { name: 'High Contrast (Light)', bg: '#ffffff', text: '#000000' },
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
        <h1 className="text-3xl font-bold mb-2">Accessibility Settings</h1>
        <p className="text-zinc-400 mb-8">Select your preferred viewing mode.</p>

        {/* Font Size Section */}
        <div className="mb-8">
          <p className="text-sm text-left mb-3 text-zinc-400 uppercase tracking-wider">Font Size</p>
          <div className="grid grid-cols-3 gap-3">
            {fontOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPreviewSize(option.value)}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  previewSize === option.value
                    ? 'bg-emerald-500 text-zinc-950 font-bold border-emerald-500'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Presets Section */}
        <div className="mb-10">
          <p className="text-sm text-left mb-3 text-zinc-400 uppercase tracking-wider">Contrast Themes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themePresets.map((theme) => (
              <button
                key={theme.name}
                onClick={() => {
                  setPreviewBg(theme.bg);
                  setPreviewText(theme.text);
                }}
                className={`group flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
                  previewBg === theme.bg ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-white/10'
                }`}
              >
                <div 
                  className="w-full h-12 rounded-lg border border-white/20 flex items-center justify-center font-bold"
                  style={{ backgroundColor: theme.bg, color: theme.text }}
                >
                  Aa
                </div>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 uppercase">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Area */}
        <div 
          className="rounded-2xl p-8 mb-8 border border-white/10 text-left transition-colors duration-300" 
          style={{ backgroundColor: previewBg, color: previewText }}
        >
          <div className="flex justify-between items-center mb-4 opacity-60">
            <span className="text-[10px] uppercase font-bold tracking-widest">Live Preview</span>
            <div className="h-px flex-1 bg-current mx-4 opacity-20"></div>
          </div>
          
          <div style={{ fontSize: previewSize }}>
            <h2 className="text-2xl font-black mb-2">StudSocial</h2>
            <p className="leading-relaxed">
              This preview reflects exactly how your dashboard will appear. 
              High contrast modes help improve readability and reduce eye strain.
            </p>
          </div>
        </div>

        <button 
          onClick={handleConfirm} 
          className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-2xl hover:bg-emerald-400 hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
        >
          Save and Apply Settings
        </button>
      </div>
    </div>
  );
};

export default Font;