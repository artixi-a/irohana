import React, { useState } from 'react';

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

  const copyToClipboard = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
      
      {selectedColor && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🎯 Selected Color</h3>
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-xl border-4 border-white shadow-lg transform hover:scale-105 transition-transform"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="flex-1">
              <p className="font-mono text-lg font-semibold">{selectedColor}</p>
              <button
                onClick={() => copyToClipboard(selectedColor)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
              >
                {copiedColor === selectedColor ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          🎨 Dominant Colors
          <span className="ml-2 text-xs text-gray-500">({colors.length} colors)</span>
        </h3>
        {colors.map((color, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyToClipboard(color.hex)}
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-semibold">{color.hex}</p>
              <p className="text-xs text-gray-500">{color.rgb}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                {((color.count / colors[0].count) * 100).toFixed(1)}%
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${(color.count / colors[0].count) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(color.hex)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {copiedColor === color.hex ? '✓' : '📋'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};