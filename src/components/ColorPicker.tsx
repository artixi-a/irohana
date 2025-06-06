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
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [recentlyCopied, setRecentlyCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<2 | 4 | 8>(4);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useTheme();

  // Detect mobile devices
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!img || !canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    img.onload = () => {
      const containerWidth = container.clientWidth;
      const maxHeight = isMobile ? 400 : 600;
      const minHeight = isMobile ? 250 : 300;
      
      const imgAspectRatio = img.width / img.height;
      
      let canvasWidth, canvasHeight;
      
      if (isMobile) {
        // Mobile: prioritize fitting within viewport
        canvasWidth = Math.min(containerWidth, window.innerWidth - 32);
        canvasHeight = canvasWidth / imgAspectRatio;
        
        if (canvasHeight < minHeight) {
          canvasHeight = minHeight;
          canvasWidth = minHeight * imgAspectRatio;
        }
        
        if (canvasHeight > maxHeight) {
          canvasHeight = maxHeight;
          canvasWidth = maxHeight * imgAspectRatio;
        }
        
        if (canvasWidth > window.innerWidth - 32) {
          canvasWidth = window.innerWidth - 32;
          canvasHeight = canvasWidth / imgAspectRatio;
        }
      } else {
        // Desktop/Tablet: always fit container width first
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imgAspectRatio;
        
        // Only adjust if height constraints are violated
        if (canvasHeight > maxHeight) {
          canvasHeight = maxHeight;
          canvasWidth = maxHeight * imgAspectRatio;
          
          // If width becomes too big, scale back down
          if (canvasWidth > containerWidth) {
            canvasWidth = containerWidth;
            canvasHeight = containerWidth / imgAspectRatio;
          }
        }
        
        if (canvasHeight < minHeight) {
          canvasHeight = minHeight;
          canvasWidth = minHeight * imgAspectRatio;
          
          // If width becomes too big, prioritize container width
          if (canvasWidth > containerWidth) {
            canvasWidth = containerWidth;
            canvasHeight = containerWidth / imgAspectRatio;
          }
        }
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      
      ctx.drawImage(img, 0, 0);
    };
  }, [imageUrl, isMobile]);

  const updateZoomPreview = useCallback((canvasX: number, canvasY: number) => {
    const canvas = canvasRef.current;
    const zoomCanvas = zoomCanvasRef.current;
    if (!canvas || !zoomCanvas) return;

    const ctx = canvas.getContext('2d');
    const zoomCtx = zoomCanvas.getContext('2d');
    if (!ctx || !zoomCtx) return;

    const zoomSize = isMobile ? 60 : 80;
    const sourceSize = zoomSize / zoomLevel;

    zoomCanvas.width = zoomSize;
    zoomCanvas.height = zoomSize;
    zoomCanvas.style.width = `${zoomSize}px`;
    zoomCanvas.style.height = `${zoomSize}px`;

    zoomCtx.clearRect(0, 0, zoomSize, zoomSize);

    const sourceX = Math.max(0, Math.min(canvas.width - sourceSize, canvasX - sourceSize / 2));
    const sourceY = Math.max(0, Math.min(canvas.height - sourceSize, canvasY - sourceSize / 2));

    zoomCtx.imageSmoothingEnabled = false;
    zoomCtx.drawImage(
      canvas,
      sourceX, sourceY, sourceSize, sourceSize,
      0, 0, zoomSize, zoomSize
    );

    zoomCtx.strokeStyle = isDark ? '#ffffff' : '#000000';
    zoomCtx.lineWidth = 1;
    zoomCtx.beginPath();
    const crosshairSize = isMobile ? 6 : 8;
    zoomCtx.moveTo(zoomSize / 2 - crosshairSize, zoomSize / 2);
    zoomCtx.lineTo(zoomSize / 2 + crosshairSize, zoomSize / 2);
    zoomCtx.moveTo(zoomSize / 2, zoomSize / 2 - crosshairSize);
    zoomCtx.lineTo(zoomSize / 2, zoomSize / 2 + crosshairSize);
    zoomCtx.stroke();

    const pixelSize = zoomLevel;
    const centerX = (zoomSize - pixelSize) / 2;
    const centerY = (zoomSize - pixelSize) / 2;
    
    zoomCtx.strokeStyle = isDark ? '#ff6b9d' : '#e91e63';
    zoomCtx.lineWidth = 2;
    zoomCtx.strokeRect(centerX, centerY, pixelSize, pixelSize);
  }, [isDark, zoomLevel, isMobile]);

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
    if (isMobile) return; // Disable hover effects on mobile
    
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setPreviewColor(hex);

    updateZoomPreview(x, y);
  }, [updateZoomPreview, isMobile]);

  const getTooltipPosition = () => {
    if (!containerRef.current) return { left: 0, top: 0 };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = isMobile ? 200 : 280;
    const tooltipHeight = isMobile ? 100 : 120;
    const offset = -60; // Distance from cursor
    
    let left = mousePos.x - containerRect.left - tooltipWidth / 2 + 54;
    let top = mousePos.y - containerRect.top - tooltipHeight - offset;
    
    // Keep tooltip within viewport bounds
    const viewportWidth = window.innerWidth;
    
    // Horizontal positioning
    if (mousePos.x - tooltipWidth / 2 < 10) {
      left = 10 - containerRect.left;
    } else if (mousePos.x + tooltipWidth / 2 > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10 - containerRect.left;
    }
    
    // Vertical positioning - show below cursor if no space above
    if (mousePos.y - tooltipHeight - offset < 10) {
      top = mousePos.y - containerRect.top + offset;
    }
    
    return { left, top };
  };

  const zoomLevels = [2, 4, 8] as const;

  return (
    <motion.div 
      className={`${
        isDark 
          ? 'bg-slate-900/50 border-slate-800' 
          : 'bg-white border-gray-200'
      } backdrop-blur-sm border rounded-2xl ${isMobile ? 'p-4' : 'p-8'} transition-colors`}
    >
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'} mb-6`}>
        <div className="flex items-center space-x-3">
          <EyeDropperIcon className={`w-6 h-6 ${
            isDark ? 'text-pink-400' : 'text-pink-600'
          }`} />
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} cursor-default font-medium ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Color Picker
          </h3>
        </div>

        <div className={`flex items-center ${isMobile ? 'justify-between' : 'space-x-3'}`}>
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
                  className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} font-medium rounded-md transition-all cursor-default ${
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
                className={`flex items-center space-x-2 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'} bg-emerald-500/20 text-emerald-500 rounded-full`}
              >
                <CheckIcon className="w-4 h-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Copied!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        <img ref={imgRef} src={imageUrl} alt="Source" className="hidden" />
        
        <motion.div 
          className="relative overflow-hidden rounded-xl"
          whileHover={isMobile ? {} : { scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseEnter={() => !isMobile && setIsHovering(true)}
            onMouseLeave={() => {
              if (!isMobile) {
                setIsHovering(false);
                setPreviewColor(null);
              }
            }}
            className={`${isMobile ? 'cursor-pointer' : 'cursor-crosshair'} w-full shadow-lg rounded-xl`}
          />
        </motion.div>

        {/* Desktop tooltip */}
        <AnimatePresence>
          {!isMobile && isHovering && previewColor && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 pointer-events-none"
              style={getTooltipPosition()}
            >
              <div className={`${
                isDark 
                  ? 'bg-slate-800/95 text-white border-slate-600' 
                  : 'bg-white/95 text-slate-900 border-gray-300'
              } backdrop-blur-xl rounded-xl p-3 shadow-xl border`}>
                
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

                <div className={`text-xs text-center ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {zoomLevel}x magnification
                </div>
              </div>
              
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
          className={`${isMobile ? 'text-xs' : 'text-sm'} mt-4 text-center cursor-default ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {isMobile ? 'Tap anywhere to pick a color' : 'Hover for magnified view • Click anywhere to pick a color'}
        </motion.p>
      </div>
    </motion.div>
  );
};