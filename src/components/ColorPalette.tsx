import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Color {
  rgb: string;
  hex: string;
  count: number;
}

interface ColorPaletteProps {
  colors: Color[];
  selectedColor: string | null;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { isDark } = useTheme();

  const copyToClipboard = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className={`${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-black/5 border-black/10'
    } backdrop-blur-sm rounded-3xl border p-6 transition-all duration-700 hover:backdrop-blur-md`}>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-medium ${
          isDark ? 'text-white/90' : 'text-black/90'
        } transition-colors duration-300`}>
          Color Palette
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isDark 
            ? 'bg-white/10 text-white/70 border border-white/20' 
            : 'bg-black/10 text-black/70 border border-black/20'
        } transition-all duration-300`}>
          {colors.length} colors
        </div>
      </div>
      
      {selectedColor && (
        <div className={`mb-6 p-4 rounded-2xl transition-all duration-500 ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-black/5 border-black/10'
        } border`}>
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl cursor-pointer transition-transform duration-300 hover:scale-110 shadow-lg"
              style={{ backgroundColor: selectedColor }}
              onClick={() => copyToClipboard(selectedColor)}
            />
            <div className="flex-1">
              <p className={`font-mono text-sm font-medium mb-2 ${
                isDark ? 'text-white/90' : 'text-black/90'
              }`}>{selectedColor}</p>
              <button
                onClick={() => copyToClipboard(selectedColor)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  copiedColor === selectedColor
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : isDark
                      ? 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      : 'bg-black/10 text-black/70 border border-black/20 hover:bg-black/20'
                }`}
              >
                {copiedColor === selectedColor ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {colors.map((color, index) => (
          <div key={index} className={`group flex items-center space-x-4 p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
            isDark 
              ? 'hover:bg-white/5 border border-transparent hover:border-white/10' 
              : 'hover:bg-black/5 border border-transparent hover:border-black/10'
          }`} onClick={() => copyToClipboard(color.hex)}>
            
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110 ${
                index === 0 
                  ? 'bg-amber-400 text-amber-900' 
                  : index === 1
                    ? 'bg-gray-300 text-gray-700'
                    : index === 2
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-400 text-white'
              }`}>
                {index + 1}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`font-mono text-sm font-medium ${
                isDark ? 'text-white/90' : 'text-black/90'
              }`}>{color.hex}</p>
              <p className={`text-xs ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`}>{((color.count / colors[0].count) * 100).toFixed(1)}%</p>
            </div>
            
            <div className="text-right">
              <div className={`w-16 h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-black/10'
              }`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${(color.count / colors[0].count) * 100}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(color.hex);
              }}
              className={`px-2 py-1 rounded-lg text-xs transition-all duration-200 ${
                copiedColor === color.hex
                  ? 'bg-green-500/20 text-green-400'
                  : isDark
                    ? 'bg-white/10 text-white/70 hover:bg-white/20'
                    : 'bg-black/10 text-black/70 hover:bg-black/20'
              }`}
            >
              {copiedColor === color.hex ? '✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};