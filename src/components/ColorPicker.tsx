import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeDropperIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ColorPickerProps {
  imageUrl: string;
  onColorSelect: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ imageUrl, onColorSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasMousePos, setCanvasMousePos] = useState({ x: 0, y: 0 });
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [recentlyCopied, setRecentlyCopied] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [zoomLevel, setZoomLevel] = useState<2 | 4 | 8>(4); // Default to 4x
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
      const minHeight = 300;
      const minWidth = 300;
      
      const imgAspectRatio = img.width / img.height;
      
      let canvasWidth, canvasHeight;
      
      canvasWidth = containerWidth;
      canvasHeight = containerWidth / imgAspectRatio;
      
      if (canvasHeight < minHeight) {
        canvasHeight = minHeight;
        canvasWidth = minHeight * imgAspectRatio;
        
        if (canvasWidth > containerWidth) {
          canvasWidth = containerWidth;
          canvasHeight = containerWidth / imgAspectRatio;
        }
      }
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * imgAspectRatio;
      }
      
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

  const updateZoomPreview = useCallback((canvasX: number, canvasY: number) => {
    const canvas = canvasRef.current;
    const zoomCanvas = zoomCanvasRef.current;
    if (!canvas || !zoomCanvas) return;

    const ctx = canvas.getContext('2d');
    const zoomCtx = zoomCanvas.getContext('2d');
    if (!ctx || !zoomCtx) return;

    // Set zoom canvas size
    const zoomSize = 80; // Size of the zoom preview
    const sourceSize = zoomSize / zoomLevel; // Size of source area to capture

    zoomCanvas.width = zoomSize;
    zoomCanvas.height = zoomSize;
    zoomCanvas.style.width = `${zoomSize}px`;
    zoomCanvas.style.height = `${zoomSize}px`;

    // Clear zoom canvas
    zoomCtx.clearRect(0, 0, zoomSize, zoomSize);

    // Calculate source area bounds
    const sourceX = Math.max(0, Math.min(canvas.width - sourceSize, canvasX - sourceSize / 2));
    const sourceY = Math.max(0, Math.min(canvas.height - sourceSize, canvasY - sourceSize / 2));

    // Draw the zoomed area
    zoomCtx.imageSmoothingEnabled = false; // Pixelated zoom for precision
    zoomCtx.drawImage(
      canvas,
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, zoomSize, zoomSize
    );

    // Draw crosshair in center
    zoomCtx.strokeStyle = isDark ? '#ffffff' : '#000000';
    zoomCtx.lineWidth = 1;
    zoomCtx.beginPath();
    // Horizontal line
    zoomCtx.moveTo(zoomSize / 2 - 8, zoomSize / 2);
    zoomCtx.lineTo(zoomSize / 2 + 8, zoomSize / 2);
    // Vertical line
    zoomCtx.moveTo(zoomSize / 2, zoomSize / 2 - 8);
    zoomCtx.lineTo(zoomSize / 2, zoomSize / 2 + 8);
    zoomCtx.stroke();

    // Draw center pixel highlight
    const pixelSize = zoomLevel;
    const centerX = (zoomSize - pixelSize) / 2;
    const centerY = (zoomSize - pixelSize) / 2;
    
    zoomCtx.strokeStyle = isDark ? '#ff6b9d' : '#e91e63';
    zoomCtx.lineWidth = 2;
    zoomCtx.strokeRect(centerX, centerY, pixelSize, pixelSize);
  }, [isDark, zoomLevel]);

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

    setMousePos({ 
      x: event.clientX, 
      y: event.clientY 
    });

    setCanvasMousePos({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setPreviewColor(hex);

    // Update zoom preview
    updateZoomPreview(x, y);
  }, [updateZoomPreview]);

  const zoomLevels = [2, 4, 8] as const;

  return (
    <motion.div 
      className={`${
        isDark 
          ? 'bg-slate-900/50 border-slate-800' 
          : 'bg-white border-gray-200'
      } backdrop-blur-sm border rounded-2xl p-8 transition-colors`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <EyeDropperIcon className={`w-6 h-6 ${
            isDark ? 'text-pink-400' : 'text-pink-600'
          }`} />
          <h3 className={`text-xl font-medium ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Color Picker
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          {/* Zoom Level Controls */}
          <div className="flex items-center space-x-2">
            <MagnifyingGlassIcon className={`w-4 h-4 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`} />
            <div className={`flex rounded-lg p-1 ${
              isDark ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              {zoomLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setZoomLevel(level)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    zoomLevel === level
                      ? isDark
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-pink-500 text-white shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-gray-200'
                  }`}
                >
                  {level}x
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {recentlyCopied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full"
              >
                <CheckIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Copied!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        <img ref={imgRef} src={imageUrl} alt="Source" className="hidden" />
        
        <motion.div 
          className="relative overflow-hidden rounded-xl"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
              setIsHovering(false);
              setPreviewColor(null);
            }}
            className="cursor-crosshair w-full shadow-lg rounded-xl"
          />
        </motion.div>

        {/* Zoom preview and color tooltip */}
        <AnimatePresence>
          {isHovering && previewColor && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 pointer-events-none"
              style={{ 
                left: mousePos.x - (containerRef.current?.getBoundingClientRect().left || 0) - 60,
                top: mousePos.y - (containerRef.current?.getBoundingClientRect().top || 0) - 120,
              }}
            >
              <div className={`${
                isDark 
                  ? 'bg-slate-800/95 text-white border-slate-600' 
                  : 'bg-white/95 text-slate-900 border-gray-300'
              } backdrop-blur-xl rounded-xl p-3 shadow-xl border`}>
                
                {/* Zoom preview */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`rounded-lg overflow-hidden border-2 ${
                    isDark ? 'border-slate-600' : 'border-gray-300'
                  }`}>
                    <canvas
                      ref={zoomCanvasRef}
                      className="block"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  
                  {/* Color info */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-lg shadow-sm border border-white/20"
                        style={{ backgroundColor: previewColor }}
                      />
                      <div>
                        <div className="font-mono text-sm font-bold">{previewColor}</div>
                        <div className={`text-xs ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Click to copy
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zoom info */}
                <div className={`text-xs text-center ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {zoomLevel}x magnification
                </div>
              </div>
              
              {/* Tooltip arrow */}
              <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${
                isDark ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-gray-300'
              } border-r border-b`} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-sm mt-4 text-center ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Hover for magnified view • Click anywhere to pick a color
        </motion.p>
      </div>
    </motion.div>
  );
};