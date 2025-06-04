import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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
      const maxHeight = 400;
      
      const imgAspectRatio = img.width / img.height;
      
      let canvasWidth = containerWidth;
      let canvasHeight = containerWidth / imgAspectRatio;
      
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * imgAspectRatio;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      
      setCanvasDimensions({ width: canvasWidth, height: canvasHeight });
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };
  }, [imageUrl]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
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
  }, [onColorSelect]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    setMousePos({ x: event.clientX, y: event.clientY });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setPreviewColor(hex);
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
          Color Picker
        </h3>
      </div>

      <div className="relative" ref={containerRef}>
        <img ref={imgRef} src={imageUrl} alt="Source" className="hidden" />
        
        <div className="relative overflow-hidden rounded-2xl group">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="cursor-crosshair transition-all duration-500 ease-out group-hover:scale-[1.01] rounded-2xl w-full"
            style={{ display: 'block' }}
          />
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
        </div>

        {/* Minimal color preview */}
        {isHovering && previewColor && (
          <div 
            className="fixed z-50 pointer-events-none"
            style={{ 
              left: mousePos.x + 20, 
              top: mousePos.y - 40,
              transform: 'translateY(-50%)'
            }}
          >
            <div className={`${
              isDark 
                ? 'bg-black/80 text-white' 
                : 'bg-white/80 text-black'
            } backdrop-blur-xl rounded-xl px-3 py-2 shadow-2xl border ${
              isDark ? 'border-white/20' : 'border-black/20'
            } flex items-center space-x-3 animate-in fade-in duration-200`}>
              <div 
                className="w-6 h-6 rounded-lg shadow-inner"
                style={{ backgroundColor: previewColor }}
              />
              <span className="font-mono text-sm font-medium">{previewColor}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};