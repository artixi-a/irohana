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
    <div className={`${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-black/5 border-black/10'
    } backdrop-blur-sm rounded-3xl border p-6 transition-all duration-700 hover:backdrop-blur-md`}>
      
      <div className="mb-4">
        <h3 className={`text-lg font-medium ${
          isDark ? 'text-white/90' : 'text-black/90'
        } transition-colors duration-300`}>
          Upload Image
        </h3>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
          isDragging 
            ? isDark 
              ? 'border-blue-400/50 bg-blue-500/5' 
              : 'border-blue-500/50 bg-blue-50/50'
            : isDark
              ? 'border-white/20 hover:border-white/30'
              : 'border-black/20 hover:border-black/30'
        } ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-12 h-12 border-2 rounded-full animate-spin ${
              isDark 
                ? 'border-white/20 border-t-blue-400' 
                : 'border-black/20 border-t-blue-600'
            }`} />
            <span className={`text-sm ${
              isDark ? 'text-white/70' : 'text-black/70'
            }`}>
              Processing...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragging 
                ? isDark ? 'bg-blue-500/10' : 'bg-blue-50'
                : isDark ? 'bg-white/5' : 'bg-black/5'
            }`}>
              <svg className={`w-8 h-8 ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className={`text-base font-medium mb-1 ${
                isDark ? 'text-white/80' : 'text-black/80'
              }`}>
                {isDragging ? 'Drop to upload' : 'Drop image or click'}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`}>
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};