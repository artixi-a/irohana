import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { SwatchIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12 md:mb-16"
    >
      {/* Background gradient */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
        className={`absolute inset-0 -z-10 ${
          isDark 
            ? 'bg-gradient-to-br from-violet-900/20 via-blue-900/20 to-pink-900/20' 
            : 'bg-gradient-to-br from-violet-100/50 via-blue-100/50 to-pink-100/50'
        } rounded-3xl blur-3xl`} 
      />
      
      <div className="flex items-center justify-between mb-6 md:mb-8">
        {/* Logo/Brand */}
        <motion.div 
          className="flex items-center space-x-2 md:space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-violet-500 to-pink-500' 
              : 'bg-gradient-to-br from-violet-400 to-pink-400'
          } shadow-lg`}>
            <SwatchIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl md:text-2xl font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              IroHana
            </h1>
            <p className={`text-xs md:text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Color Palette Extractor
            </p>
          </div>
        </motion.div>

        <ThemeToggle />
      </div>

      {/* Main heading */}
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center space-x-1 md:space-x-2 mb-3 md:mb-4"
        >
          {/* Show icons only on desktop */}
          <SparklesIcon className={`hidden md:block w-8 h-8 ${
            isDark ? 'text-violet-400' : 'text-violet-600'
          }`} />
          <h2 className={`text-5xl md:text-6xl font-light tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="block md:inline">Extract Beautiful</span>
            <span className="block md:inline md:ml-2">Colors</span>
          </h2>
          <SparklesIcon className={`hidden md:block w-8 h-8 ${
            isDark ? 'text-pink-400' : 'text-pink-600'
          }`} />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`text-base md:text-xl max-w-xl md:max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Upload any image and discover its dominant colors. Perfect for designers, 
          artists, and anyone who loves beautiful color palettes.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center space-x-4 md:space-x-8 mt-6 md:mt-8"
        >
          <div className="text-center">
            <div className={`text-lg md:text-2xl font-bold ${
              isDark ? 'text-violet-400' : 'text-violet-600'
            }`}>
              100%
            </div>
            <div className={`text-xs md:text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Client-side
            </div>
          </div>
          <div className={`w-px h-6 md:h-8 ${
            isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
          <div className="text-center">
            <div className={`text-lg md:text-2xl font-bold ${
              isDark ? 'text-pink-400' : 'text-pink-600'
            }`}>
              Instant
            </div>
            <div className={`text-xs md:text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Processing
            </div>
          </div>
          <div className={`w-px h-6 md:h-8 ${
            isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
          <div className="text-center">
            <div className={`text-lg md:text-2xl font-bold ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Free
            </div>
            <div className={`text-xs md:text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Forever
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};