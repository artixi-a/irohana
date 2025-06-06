import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ColorPalette } from './components/ColorPalette';
import { ColorPicker } from './components/ColorPicker';
import { useTheme } from './contexts/ThemeContext';

interface Color {
  rgb: string;
  hex: string;
  count: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [dominantColors, setDominantColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-gray-50'
    } p-6`}>
      
      <div className="max-w-5xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
          
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <ColorPalette 
              colors={dominantColors}
              selectedColor={selectedColor}
            />
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;