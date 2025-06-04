import { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ColorPalette } from './components/ColorPalette';
import { ColorPicker } from './components/ColorPicker';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './contexts/ThemeContext';

interface Color {
  rgb: string;
  hex: string;
  count: number;
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [dominantColors, setDominantColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    } p-4 md:p-8`}>
      
      {/* Floating theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Zen Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className={`text-5xl md:text-7xl font-light mb-6 tracking-tight ${
              isDark 
                ? 'bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            }`}>
              Color Zen
            </h1>
            <div className={`w-24 h-px mx-auto mb-6 ${
              isDark ? 'bg-gradient-to-r from-transparent via-blue-400 to-transparent' 
                     : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'
            }`}></div>
            <p className={`text-lg font-light ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Discover the essence of color in perfect harmony
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="group">
              <ImageUploader 
                onImageLoad={setImage}
                onColorsExtracted={setDominantColors}
              />
            </div>
            
            {image && (
              <div className="animate-fade-in-up">
                <ColorPicker 
                  imageUrl={image}
                  onColorSelect={setSelectedColor}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            {dominantColors.length > 0 && (
              <div className="animate-fade-in-up">
                <ColorPalette 
                  colors={dominantColors}
                  selectedColor={selectedColor}
                />
              </div>
            )}
          </div>
        </div>

        {/* Zen Footer */}
        <div className="text-center mt-20">
          <div className={`inline-flex items-center space-x-2 text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for color harmony</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;