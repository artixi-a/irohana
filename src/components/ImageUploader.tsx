import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractDominantColors } from '../utils/colorExtractor';
import { useTheme } from '../contexts/ThemeContext';
import { CloudArrowUpIcon, PhotoIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageLoad: (imageUrl: string) => void;
  onColorsExtracted: (colors: Array<{rgb: string, hex: string, count: number}>) => void;
  hasImage?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageLoad, 
  onColorsExtracted,
  hasImage = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  };

  const processFile = useCallback(async (file: File) => {
    const maxSize = 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      showErrorMessage(`File size (${sizeInMB}MB) exceeds the 10MB limit. Please choose a smaller image.`);
      return;
    }
    
    setIsLoading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      onImageLoad(imageUrl);
      const colors = await extractDominantColors(imageUrl);
      onColorsExtracted(colors);
    } catch (error) {
      console.error('Error processing image:', error);
      showErrorMessage('Failed to process the image. Please try a different file.');
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
    <motion.div 
      className={`relative ${
        isDark 
          ? 'bg-slate-900/50 border-slate-800' 
          : 'bg-white border-gray-200'
      } backdrop-blur-sm border rounded-2xl p-8 transition-colors`}
    >
      {/* Error Toast */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 left-4 right-4 z-10"
          >
            <div className={`${
              isDark 
                ? 'bg-red-900/90 border-red-700 text-red-200' 
                : 'bg-red-50 border-red-200 text-red-800'
            } border rounded-xl p-4 backdrop-blur-sm shadow-lg`}>
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Upload Error</p>
                  <p className="text-xs opacity-90">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setShowError(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-red-800/50' 
                      : 'hover:bg-red-100'
                  }`}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      <div className="flex items-center space-x-3 mb-6">
        <CloudArrowUpIcon className={`w-6 h-6 ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`} />
        <h3 className={`text-xl cursor-default font-medium ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Upload Image
        </h3>
      </div>
      
      <motion.div 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
          isDragging 
            ? isDark 
              ? 'border-blue-400 bg-blue-400/5' 
              : 'border-blue-500 bg-blue-50'
            : isDark
              ? 'border-slate-700 hover:border-slate-600'
              : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-12 h-12 mx-auto border-3 rounded-full ${
                  isDark 
                    ? 'border-slate-700 border-t-blue-400' 
                    : 'border-gray-200 border-t-blue-600'
                }`}
              />
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Processing...
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <motion.div
                animate={{ 
                  y: isDragging ? -5 : 0,
                  scale: isDragging ? 1.1 : 1 
                }}
                transition={{ duration: 0.2 }}
                className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-slate-800' : 'bg-gray-100'
                }`}
              >
                <PhotoIcon className={`w-8 h-8 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`} />
              </motion.div>
              
              <div>
                <p className={`text-lg font-medium mb-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {isDragging ? 'Drop your image' : 'Choose an image'}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {isDragging ? 'Release to upload' : 'or drag and drop here'}
                </p>
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  Max file size: 10MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};