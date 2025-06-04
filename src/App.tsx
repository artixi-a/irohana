import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUploader } from './components/ImageUploader';
import { ColorPalette } from './components/ColorPalette';
import { ColorPicker } from './components/ColorPicker';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './contexts/ThemeContext';
import { 
  PhotoIcon,
  SparklesIcon,
  EyeDropperIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Color {
  rgb: string;
  hex: string;
  count: number;
}

const quickFade = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [dominantColors, setDominantColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { isDark } = useTheme();

  const TutorialSection = () => (
  <motion.div
    variants={quickFade}
    initial="hidden"
    animate="visible"
    className={`relative ${
      isDark
        ? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50'
        : 'bg-gradient-to-br from-white/90 to-gray-50/90 border-gray-200/50'
    } backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-500`}
  >
    {/* Animated background gradient - SAME AS IMAGEUPLOADER */}
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
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

    {/* Header - SAME STYLE AS IMAGEUPLOADER */}
    <motion.div 
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
          <LightBulbIcon className={`w-6 h-6 ${
            isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
        </motion.div>
        <div>
          <h3 className={`text-2xl font-bold ${
            isDark ? 'text-white/95' : 'text-slate-900'
          }`}>
            How It Works
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Simple color extraction in 3 steps
          </p>
        </div>
      </div>
    </motion.div>

    {/* Content area - SAME STRUCTURE */}
    <div className="px-6 pb-6">
      <div className="space-y-4">
        {[
          {
            step: 1,
            title: 'Upload',
            description: 'Drop your image',
            icon: PhotoIcon,
            color: 'blue',
          },
          {
            step: 2,
            title: 'Extract',
            description: 'Get color palette',
            icon: SparklesIcon,
            color: 'purple',
          },
          {
            step: 3,
            title: 'Pick',
            description: 'Copy any color',
            icon: EyeDropperIcon,
            color: 'green',
          },
        ].map((item, index) => {
          const colorClasses = {
            blue: isDark ? 'text-blue-400 bg-blue-500/15' : 'text-blue-600 bg-blue-50',
            purple: isDark ? 'text-purple-400 bg-purple-500/15' : 'text-purple-600 bg-purple-50',
            green: isDark ? 'text-green-400 bg-green-500/15' : 'text-green-600 bg-green-50',
          };

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.description}
                </p>
              </div>
              <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                {item.step}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`mt-4 p-3 rounded-xl ${
          isDark ? 'bg-slate-800/40' : 'bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-2 mb-2">
          <LightBulbIcon className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Tip
          </span>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          High-resolution images work best for accurate color extraction
        </p>
      </motion.div>
    </div>
  </motion.div>
);

  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 to-white'
    } p-4 md:p-6`}>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 right-4 z-50"
      >
        <ThemeToggle />
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
            isDark 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400' 
              : 'text-slate-900'
          }`}>
            IroHana
          </h1>
          <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Extract colors from any image
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            variants={quickFade}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <ImageUploader 
              onImageLoad={setImage}
              onColorsExtracted={setDominantColors}
              hasImage={!!image}
            />
            
            <AnimatePresence>
              {image && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ColorPicker 
                    imageUrl={image}
                    onColorSelect={setSelectedColor}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div>
            <AnimatePresence mode="wait">
              {dominantColors.length > 0 ? (
                <motion.div
                  key="palette"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ColorPalette 
                    colors={dominantColors}
                    selectedColor={selectedColor}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="tutorial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TutorialSection />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-center mt-12 pt-6 border-t border-gray-200/20"
        >
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2024 IroHana
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;