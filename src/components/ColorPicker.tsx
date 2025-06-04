import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CursorArrowRaysIcon, 
  CheckIcon, 
  EyeDropperIcon 
} from '@heroicons/react/24/outline';

interface ColorPickerProps {
  imageUrl: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ imageUrl, onColorSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [recentlyCopied, setRecentlyCopied] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
  const img = imgRef.current;
  const canvas = canvasRef.current;
  const container = containerRef.current;
  if (!img || !canvas || !container) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  img.onload = () => {
    const containerWidth = container.clientWidth;
    const maxHeight = 600;
    const minHeight = 300; // Ensure decent minimum height
    const minWidth = 300;  // Ensure decent minimum width
    
    const imgAspectRatio = img.width / img.height;
    
    let canvasWidth, canvasHeight;
    
    // Start with container width as base
    canvasWidth = containerWidth;
    canvasHeight = containerWidth / imgAspectRatio;
    
    // If calculated height is too small, use minimum height instead
    if (canvasHeight < minHeight) {
      canvasHeight = minHeight;
      canvasWidth = minHeight * imgAspectRatio;
      
      // If width becomes too wide, cap it and adjust height accordingly
      if (canvasWidth > containerWidth) {
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imgAspectRatio;
      }
    }
    
    // If height is too large, scale down
    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = maxHeight * imgAspectRatio;
    }
    
    // Ensure minimum width as well
    if (canvasWidth < minWidth) {
      canvasWidth = minWidth;
      canvasHeight = minWidth / imgAspectRatio;
    }
    
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
    ctx.drawImage(img, 0, 0);
  };
}, [imageUrl]);

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setRecentlyCopied(true);
      setTimeout(() => setRecentlyCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color to clipboard:', err);
    }
  };

  const handleCanvasClick = useCallback(async (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    onColorSelect(hex);
    await copyToClipboard(hex);
  }, [onColorSelect]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Use client coordinates relative to the canvas container
    setMousePos({ 
      x: event.clientX, 
      y: event.clientY 
    });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setPreviewColor(hex);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                  "radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)"
                ]
              : [
                  "radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)"
                ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-xl ${
              isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
            }`}
          >
            <EyeDropperIcon className={`w-6 h-6 ${
              isDark ? 'text-pink-400' : 'text-pink-600'
            }`} />
          </motion.div>
          <div>
            <h3 className={`text-2xl font-bold ${
              isDark ? 'text-white/95' : 'text-slate-900'
            }`}>
              Color Picker
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Click to pick & copy colors
            </p>
          </div>
        </div>

        <AnimatePresence>
          {recentlyCopied && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isDark 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              <CheckIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Copied!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative" ref={containerRef}>
        <img ref={imgRef} src={imageUrl} alt="Source" className="hidden" />
        
        <motion.div 
          className="relative overflow-hidden rounded-2xl group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="cursor-crosshair transition-all duration-300 ease-out rounded-2xl w-full shadow-2xl"
            style={{ 
              display: 'block',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
          
          {/* Interactive overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
          
          {/* Crosshair effect */}
          {isHovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced color preview tooltip */}
        <AnimatePresence>
          {isHovering && previewColor && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-[999] pointer-events-none"
              style={{ 
                left: mousePos.x - containerRef.current?.getBoundingClientRect().left! - 80,
                top: mousePos.y - containerRef.current?.getBoundingClientRect().top! + 30,
              }}
            >
              <div className={`${
                isDark 
                  ? 'bg-slate-800/95 text-white border-slate-600' 
                  : 'bg-white/95 text-slate-900 border-gray-300'
              } backdrop-blur-xl rounded-xl p-3 shadow-2xl border flex items-center space-x-2 min-w-[140px]`}>
                <div 
                  className="w-6 h-6 rounded-lg shadow-sm shrink-0 border border-white/20"
                  style={{ backgroundColor: previewColor }}
                />
                <div className="flex-1">
                  <div className="font-mono text-xs font-bold">{previewColor}</div>
                  <div className={`text-[10px] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Click to copy
                  </div>
                </div>
              </div>
              
              {/* Tooltip arrow */}
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${
                isDark ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-gray-300'
              } border-l border-t`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className={`mt-6 p-4 rounded-2xl ${
            isDark 
              ? 'bg-slate-800/40 border-slate-700/50' 
              : 'bg-gray-100/40 border-gray-200/50'
          } border backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <CursorArrowRaysIcon className={`w-4 h-4 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Click anywhere on the image
              </p>
              <p className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Colors are automatically copied to clipboard
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};