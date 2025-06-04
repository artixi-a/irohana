import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractDominantColors } from '../utils/colorExtractor';
import { useTheme } from '../contexts/ThemeContext';
import { 
  CloudArrowUpIcon, 
  PhotoIcon, 
  SparklesIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageLoad: (imageUrl: string) => void;
  onColorsExtracted: (colors: Array<{rgb: string, hex: string, count: number}>) => void;
  hasImage?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const dropZoneVariants = {
  idle: { 
    scale: 1,
    borderColor: "rgba(148, 163, 184, 0.2)"
  },
  hover: { 
    scale: 1.02,
    borderColor: "rgba(59, 130, 246, 0.5)",
    transition: { duration: 0.3 }
  },
  dragging: { 
    scale: 1.05,
    borderColor: "rgba(59, 130, 246, 0.8)",
    transition: { duration: 0.2 }
  }
};

const iconVariants = {
  idle: { y: 0, rotate: 0 },
  hover: { y: -5, rotate: 5, transition: { duration: 0.3 } },
  dragging: { y: -8, rotate: 10, scale: 1.1, transition: { duration: 0.2 } }
};

const loadingVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageLoad, 
  onColorsExtracted,
  hasImage = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const collapsedFileInputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useTheme();

  // Auto-collapse when image is uploaded
  React.useEffect(() => {
    if (hasImage && !isLoading) {
      const timer = setTimeout(() => setIsCollapsed(true), 1000); // Delay for smooth UX
      return () => clearTimeout(timer);
    }
  }, [hasImage, isLoading]);

  const processFile = useCallback(async (file: File) => {
    console.log('processFile called with:', file.name); // Debug log
    const initiallyCollapsed = isCollapsed; // Check if it's collapsed at the start
    setIsLoading(true);
    
    if (!initiallyCollapsed) { // Only expand if it was not initially collapsed
      setIsCollapsed(false); // Expand during processing
    }
    
    try {
      const imageUrl = URL.createObjectURL(file);
      console.log('Image URL created:', imageUrl); // Debug log
      onImageLoad(imageUrl);

      const colors = await extractDominantColors(imageUrl);
      console.log('Colors extracted:', colors); // Debug log
      onColorsExtracted(colors);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onImageLoad, onColorsExtracted, isCollapsed]);

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

  const getDropZoneState = () => {
    if (isDragging) return 'dragging';
    if (isHovering) return 'hover';
    return 'idle';
  };

  return (
  <motion.div 
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    layout
    className={`relative ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50' 
        : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50'
    } backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-500`}
  >
            
                  <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
    {/* Animated background gradient */}
    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
      <motion.div
        animate={{
          background: isDark 
            ? [
                "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)"
              ]
            : [
                "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)"
              ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />
    </div>
    
    {/* Header - Always visible */}
    <motion.div 
      layout
      className="relative flex items-center justify-between p-6"
    >
      <div className="flex items-center space-x-3">
        <motion.div
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
          }`}
        >
          <CloudArrowUpIcon className={`w-6 h-6 ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`} />
        </motion.div>
        <div>
          <h3 className={`text-2xl font-bold ${
            isDark ? 'text-white/95' : 'text-slate-900'
          }`}>
            {hasImage ? 'Upload New Image' : 'Upload Image'}
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {isCollapsed 
              ? 'Click to upload a different image' 
              : 'Drag & drop or click to browse'
            }
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isDark 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}
            >
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Processing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse/Expand button - only show when image exists */}
        {hasImage && !isLoading && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300' 
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-slate-600'
            }`}
            aria-label={isCollapsed ? 'Expand uploader' : 'Collapse uploader'}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDownIcon className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </div>
    </motion.div>

    {/* Upload Area - Collapsible */}
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <motion.div 
              variants={dropZoneVariants}
              animate={getDropZoneState()}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
                isDragging 
                  ? isDark 
                    ? 'border-blue-400/60 bg-blue-500/10' 
                    : 'border-blue-500/60 bg-blue-50/80'
                  : isDark
                    ? 'border-slate-600/50 hover:border-slate-500/60'
                    : 'border-gray-300/50 hover:border-gray-400/60'
              } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Animated background for drop zone */}
              <motion.div
                className="absolute inset-0 opacity-0"
                animate={{
                  opacity: isDragging ? 0.1 : 0,
                  background: isDark 
                    ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)"
                }}
                transition={{ duration: 0.3 }}
              />


              
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <motion.div
                      variants={loadingVariants}
                      animate="animate"
                      className={`w-16 h-16 border-4 rounded-full ${
                        isDark 
                          ? 'border-slate-700 border-t-green-400' 
                          : 'border-gray-200 border-t-green-600'
                      }`}
                    />
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="space-y-2 text-center"
                    >
                      <p className={`text-lg font-medium ${
                        isDark ? 'text-white/80' : 'text-slate-800'
                      }`}>
                        Extracting colors...
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        This won't take long
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center space-y-6"
                  >
                    <motion.div
                      variants={iconVariants}
                      animate={getDropZoneState()}
                      className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isDragging 
                          ? isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                          : isDark ? 'bg-slate-800/50' : 'bg-gray-100'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isDragging ? (
                          <motion.div
                            key="drop"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ArrowUpTrayIcon className={`w-10 h-10 ${
                              isDark ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="photo"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <PhotoIcon className={`w-10 h-10 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Floating particles effect */}
                      {isDragging && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-blue-400 rounded-full"
                              animate={{
                                y: [-20, -40],
                                x: [0, (i - 1) * 20],
                                opacity: [1, 0],
                                scale: [1, 0]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </>
                      )}
                    </motion.div>

                    <motion.div 
                      className="text-center space-y-2"
                      animate={{
                        y: isDragging ? -5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className={`text-xl font-bold ${
                        isDark ? 'text-white/90' : 'text-slate-900'
                      }`}>
                        {isDragging ? 'Drop it like it\'s hot!' : 'Choose your image'}
                      </p>
                      <p className={`text-base ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {isDragging 
                          ? 'Release to start color extraction' 
                          : 'Drag and drop or click to browse'
                        }
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </motion.div>

                    {/* Format badges */}
                    <motion.div 
                      className="flex space-x-2"
                      animate={{
                        scale: isDragging ? 1.05 : 1,
                        opacity: isDragging ? 0.8 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {['PNG', 'JPG', 'GIF'].map((format, index) => (
                        <motion.div
                          key={format}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDark 
                              ? 'bg-slate-700/50 text-slate-300' 
                              : 'bg-gray-200 text-slate-600'
                          }`}
                        >
                          {format}
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Quick action when collapsed */}
    {isCollapsed && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="px-6 pb-4"
  >
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        console.log('Collapsed button clicked!');
        fileInputRef.current?.click();
      }}
      disabled={isLoading}
      className={`w-full py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 ${
        isLoading
          ? 'opacity-50 cursor-not-allowed'
          : isDark 
            ? 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700' 
            : 'bg-gray-100/60 hover:bg-gray-200/60 text-slate-600 border border-gray-200'
      }`}
    >
      <PhotoIcon className="w-5 h-5" />
      <span className="font-medium">
        {isLoading ? 'Processing...' : 'Choose New Image'}
      </span>
    </motion.button>
  </motion.div>
)}
  </motion.div>
);
}