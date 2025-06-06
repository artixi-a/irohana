import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  SwatchIcon
} from '@heroicons/react/24/outline';

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
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const totalCount = colors.reduce((sum, color) => sum + color.count, 0);

  return (
    <motion.div 
      className={`${
        isDark 
          ? 'bg-slate-900/50 border-slate-800' 
          : 'bg-white border-gray-200'
      } backdrop-blur-sm border rounded-2xl p-8 transition-colors`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <SwatchIcon className={`w-6 h-6 ${
          isDark ? 'text-violet-400' : 'text-violet-600'
        }`} />
        <h3 className={`text-xl cursor-default font-medium ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Color Palette
        </h3>
        {colors.length > 0 && (
          <span className={`text-sm px-2 py-1 rounded-full ${
            isDark 
              ? 'bg-violet-400/20 text-violet-300' 
              : 'bg-violet-100 text-violet-700'
          }`}>
            {colors.length}
          </span>
        )}
      </div>
      
      {/* Selected Color */}
      <AnimatePresence>
        {selectedColor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-xl ${
              isDark ? 'bg-slate-800/50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-lg shadow-sm"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1">
                <p className="text-xs font-medium text-emerald-500 mb-1">
                  Selected Color
                </p>
                <p className={`font-mono font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {selectedColor}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(selectedColor)}
                className={`p-2 rounded-lg transition-colors ${
                  copiedColor === selectedColor
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : isDark
                      ? 'bg-slate-700 text-slate-300 hover:text-white'
                      : 'bg-gray-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                {copiedColor === selectedColor ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color List */}
      {colors.length > 0 ? (
        <motion.div className="space-y-3">
          {colors.map((color, index) => (
            <motion.div
              key={color.hex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${
                isDark 
                  ? 'hover:bg-slate-800/50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => copyToClipboard(color.hex)}
            >
              <div 
                className="w-10 h-10 rounded-lg shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              
              <div className="flex-1 min-w-0">
                <p className={`font-mono font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {color.hex}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {((color.count / totalCount) * 100).toFixed(1)}% dominance
                </p>
              </div>
              
              <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(color.count / totalCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(color.hex);
                }}
                className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                  copiedColor === color.hex
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : isDark
                      ? 'bg-slate-700 text-slate-400 hover:text-white'
                      : 'bg-gray-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                {copiedColor === color.hex ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-slate-800' : 'bg-gray-100'
          }`}>
            <SwatchIcon className={`w-8 h-8 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
          </div>
          <h4 className={`text-lg font-medium mb-2 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            No colors yet
          </h4>
          <p className={`text-sm ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Upload an image to extract its color palette
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};