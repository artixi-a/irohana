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

  const TutorialSection = () => (
    <div className={`${
      isDark 
        ? 'bg-white/5 border-white/10' 
        : 'bg-black/5 border-black/10'
    } backdrop-blur-sm rounded-3xl border p-6 transition-all duration-700 hover:backdrop-blur-md`}>
      
      <div className="text-center mb-8">
        <h2 className={`text-xl font-medium mb-2 ${
          isDark ? 'text-white/90' : 'text-black/90'
        }`}>
          How it works
        </h2>
        <p className={`text-sm ${
          isDark ? 'text-white/50' : 'text-black/50'
        }`}>
          Extract and pick colors from any image
        </p>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-2xl transition-all duration-300 ${
          isDark 
            ? 'bg-white/5 hover:bg-white/10' 
            : 'bg-black/5 hover:bg-black/10'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
              isDark 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              1
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium mb-1 ${
                isDark ? 'text-white/80' : 'text-black/80'
              }`}>
                Upload Image
              </h3>
              <p className={`text-xs ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`}>
                Drag & drop or click to upload any image file
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl transition-all duration-300 ${
          isDark 
            ? 'bg-white/5 hover:bg-white/10' 
            : 'bg-black/5 hover:bg-black/10'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
              isDark 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-purple-100 text-purple-600'
            }`}>
              2
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium mb-1 ${
                isDark ? 'text-white/80' : 'text-black/80'
              }`}>
                Analyze Colors
              </h3>
              <p className={`text-xs ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`}>
                AI extracts dominant colors and creates a palette
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl transition-all duration-300 ${
          isDark 
            ? 'bg-white/5 hover:bg-white/10' 
            : 'bg-black/5 hover:bg-black/10'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
              isDark 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-green-100 text-green-600'
            }`}>
              3
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium mb-1 ${
                isDark ? 'text-white/80' : 'text-black/80'
              }`}>
                Pick & Copy
              </h3>
              <p className={`text-xs ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`}>
                Click any color to copy its HEX code instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded-2xl ${
        isDark 
          ? 'bg-white/5' 
          : 'bg-black/5'
      }`}>
        <div className="text-center">
          <h3 className={`text-sm font-medium mb-2 ${
            isDark ? 'text-white/80' : 'text-black/80'
          }`}>
            Pro Tips
          </h3>
          <div className={`text-xs space-y-1 ${
            isDark ? 'text-white/50' : 'text-black/50'
          }`}>
            <p>• High resolution images work best</p>
            <p>• Try photos with varied color schemes</p>
            <p>• Click anywhere on image to pick specific colors</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
          isDark 
            ? 'bg-white/10 text-white/70' 
            : 'bg-black/10 text-black/70'
        }`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span>Upload an image to get started</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    } p-4 md:p-8`}>
      
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-7xl font-bold mb-4 tracking-tight ${
            isDark 
              ? 'text-white' 
              : 'text-black'
          }`}>
            IroHana
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-white/60' : 'text-black/60'
          }`}>
            Color extraction made simple
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ImageUploader 
              onImageLoad={setImage}
              onColorsExtracted={setDominantColors}
            />
            
            {image && (
              <ColorPicker 
                imageUrl={image}
                onColorSelect={setSelectedColor}
              />
            )}
          </div>
          
          <div className="space-y-8">
            {dominantColors.length > 0 ? (
              <ColorPalette 
                colors={dominantColors}
                selectedColor={selectedColor}
              />
            ) : (
              <TutorialSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;