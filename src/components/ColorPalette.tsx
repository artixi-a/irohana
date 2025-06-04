import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardDocumentIcon, 
  CheckIcon, 
  SparklesIcon,
  SwatchIcon,
  EyeDropperIcon
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

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

const paletteItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

const selectedColorVariants = {
  initial: { opacity: 0, scale: 0.8, y: -20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -10,
    transition: { duration: 0.3 }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const { isDark } = useTheme();

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const totalCount = colors.reduce((sum, color) => sum + color.count, 0);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50' 
          : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50'
      } backdrop-blur-xl rounded-3xl border p-8 shadow-2xl overflow-hidden`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <motion.div
          animate={{
            background: isDark 
              ? [
                  "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
                ]
              : [
                  "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)"
                ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-xl ${
              isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
            }`}
          >
            <SwatchIcon className={`w-6 h-6 ${
              isDark ? 'text-violet-400' : 'text-violet-600'
            }`} />
          </motion.div>
          <div>
            <h3 className={`text-2xl font-bold ${
              isDark ? 'text-white/95' : 'text-slate-900'
            }`}>
              Color Palette
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Extract & explore colors
            </p>
          </div>
        </div>
        
        {colors.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-violet-300 border border-violet-500/30' 
                : 'bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border border-violet-200'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{colors.length} colors</span>
          </motion.div>
        )}
      </div>
      
      {/* Selected Color Display */}
      <AnimatePresence mode="wait">
        {selectedColor && (
          <motion.div
            key="selected-color"
            variants={selectedColorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative mb-8 p-6 rounded-2xl ${
              isDark 
                ? 'bg-slate-800/60 border-slate-700/50' 
                : 'bg-white/60 border-gray-200/50'
            } border backdrop-blur-sm`}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                variants={pulseVariants}
                animate="animate"
                className="relative w-16 h-16 rounded-2xl cursor-pointer shadow-xl overflow-hidden"
                style={{ backgroundColor: selectedColor }}
                onClick={() => copyToClipboard(selectedColor)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <EyeDropperIcon className={`w-4 h-4 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    Picked Color
                  </span>
                </div>
                <p className={`font-mono text-xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>{selectedColor}</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(selectedColor)}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  copiedColor === selectedColor
                    ? isDark 
                      ? 'bg-emerald-500/30 text-emerald-300 shadow-emerald-500/25' 
                      : 'bg-emerald-100 text-emerald-700 shadow-emerald-200'
                    : isDark
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white'
                      : 'bg-gray-100/50 hover:bg-gray-200/50 text-slate-600 hover:text-slate-800'
                } shadow-lg`}
              >
                <AnimatePresence mode="wait">
                  {copiedColor === selectedColor ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckIcon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="clipboard"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color List */}
      {colors.length > 0 ? (
        <motion.div className="space-y-3">
          <AnimatePresence>
            {colors.map((color, index) => (
              <motion.div
                key={color.hex}
                variants={paletteItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onHoverStart={() => setHoveredColor(color.hex)}
                onHoverEnd={() => setHoveredColor(null)}
                className={`group relative flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isDark 
                    ? 'hover:bg-slate-800/60 hover:shadow-xl' 
                    : 'hover:bg-white/60 hover:shadow-xl'
                } ${hoveredColor === color.hex ? 'scale-[1.02]' : ''}`}
                onClick={() => copyToClipboard(color.hex)}
              >
                {/* Color Swatch */}
                <motion.div 
                  className="relative w-12 h-12 rounded-xl shadow-lg overflow-hidden shrink-0"
                  style={{ backgroundColor: color.hex }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  layoutId={`color-swatch-${color.hex}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
                
                {/* Color Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-mono text-lg font-bold truncate ${
                    isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}>{color.hex}</p>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {((color.count / totalCount) * 100).toFixed(1)}% dominance
                  </p>
                </div>
                
                {/* Dominance Bar */}
                <div className="relative w-20 h-3 rounded-full overflow-hidden shrink-0">
                  <div className={`absolute inset-0 ${
                    isDark ? 'bg-slate-700/50' : 'bg-gray-200/50'
                  }`} />
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 rounded-full shadow-inner"
                    initial={{ width: 0 }}
                    animate={{ width: `${(color.count / totalCount) * 100}%` }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.25, 0.46, 0.45, 0.94], 
                      delay: index * 0.1 + 0.3 
                    }}
                  />
                </div>
                
                {/* Copy Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(color.hex);
                  }}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    copiedColor === color.hex
                      ? isDark 
                        ? 'bg-emerald-500/30 text-emerald-300' 
                        : 'bg-emerald-100 text-emerald-700'
                      : isDark
                        ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-200'
                        : 'bg-gray-100/50 text-slate-500 hover:bg-gray-200/50 hover:text-slate-700'
                  } opacity-0 group-hover:opacity-100 focus:opacity-100`}
                  aria-label={`Copy ${color.hex}`}
                >
                  <AnimatePresence mode="wait">
                    {copiedColor === color.hex ? (
                      <motion.div
                        key="check-small"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="clipboard-small"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-center py-16 px-8 rounded-2xl ${
            isDark ? 'bg-slate-800/30' : 'bg-gray-50/30'
          } backdrop-blur-sm`}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6"
          >
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-violet-500/20 to-blue-500/20' 
                : 'bg-gradient-to-br from-violet-100 to-blue-100'
            }`}>
              <SwatchIcon className={`w-10 h-10 ${
                isDark ? 'text-violet-400' : 'text-violet-600'
              }`} />
            </div>
          </motion.div>
          
          <h4 className={`text-xl font-bold mb-3 ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            No colors extracted yet
          </h4>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Upload an image to discover its beautiful color palette.<br />
            Watch as we extract the most dominant colors for you.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};