// filepath: e:\Frontend\colorpicker\colormesh\src\components\ImageUploader.tsx
import React, { useCallback, useState, useRef } from 'react';
import { extractDominantColors } from '../utils/colorExtractor';
import { useTheme } from '../contexts/ThemeContext';

interface ImageUploaderProps {
  onImageLoad: (imageUrl: string) => void;
  onColorsExtracted: (colors: Array<{rgb: string, hex: string, count: number}>) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageLoad, 
  onColorsExtracted 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      onImageLoad(imageUrl);

      const colors = await extractDominantColors(imageUrl);
      onColorsExtracted(colors);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onImageLoad, onColorsExtracted]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await processFile(file);
  }, [processFile]);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className={`backdrop-blur-sm rounded-3xl border transition-all duration-300 p-8 ${
      isDark 
        ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/40' 
        : 'bg-white/30 border-slate-200/50 hover:bg-white/40'
    }`}>
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-light ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Begin Your Journey
        </h2>
        <div className={`w-16 h-px mx-auto mt-3 ${
          isDark ? 'bg-gradient-to-r from-transparent via-blue-400 to-transparent' 
                 : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'
        }`}></div>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging 
            ? isDark 
              ? 'border-blue-400 bg-blue-500/10 scale-105' 
              : 'border-blue-500 bg-blue-50 scale-105'
            : isDark
              ? 'border-slate-600 hover:border-slate-500'
              : 'border-slate-300 hover:border-slate-400'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={isLoading}
        />
        
        <label 
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          {isLoading ? (
            <div className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-4 ${
                isDark 
                  ? 'border-slate-600 border-t-blue-400' 
                  : 'border-slate-200 border-t-blue-600'
              }`} />
              <span className="font-light">Discovering colors...</span>
            </div>
          ) : (
            <>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isDragging 
                  ? isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  : isDark ? 'bg-slate-700/50' : 'bg-slate-100'
              }`}>
                <svg className={`w-10 h-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className={`text-lg font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isDragging ? 'Release to begin' : 'Drop your image here'}
                </span>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  or click to browse • PNG, JPG, GIF
                </p>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
};