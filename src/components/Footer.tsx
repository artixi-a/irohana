import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { LegalModal } from './LegalModal';
import { 
  HeartIcon, 
  CodeBracketIcon,
  SwatchIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'cookies' | null>(null);

  const links = [
    { name: 'GitHub', href: '#', icon: CodeBracketIcon },
    { name: 'Portfolio', href: '#', icon: ArrowTopRightOnSquareIcon },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', type: 'privacy' as const, icon: ShieldCheckIcon },
    { name: 'Terms of Service', type: 'terms' as const, icon: DocumentTextIcon },
    { name: 'Cookie Policy', type: 'cookies' as const, icon: DocumentTextIcon },
  ];

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className={`mt-24 ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white border-gray-200'
        } backdrop-blur-sm border rounded-2xl p-8`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-xl ${
                  isDark 
                    ? 'bg-gradient-to-br from-violet-500 to-pink-500' 
                    : 'bg-gradient-to-br from-violet-400 to-pink-400'
                }`}>
                  <SwatchIcon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  IroHana
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                A beautiful, fast, and privacy-first color palette extractor. 
                All processing happens in your browser.
              </p>
            </div>

            {/* Features */}
            <div className="md:col-span-1">
              <h3 className={`text-sm font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Features
              </h3>
              <ul className="space-y-2">
                {[
                  'Extract dominant colors',
                  'Color picker tool',
                  'Copy to clipboard',
                  'Dark/light theme',
                  'No data collection'
                ].map((feature, index) => (
                  <li key={index} className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="md:col-span-1">
              <h3 className={`text-sm font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Connect
              </h3>
              <div className="space-y-3">
                {links.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      isDark 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="md:col-span-1">
              <h3 className={`text-sm font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Legal
              </h3>
              <div className="space-y-3">
                {legalLinks.map((link, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setModalType(link.type)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      isDark 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className={`pt-6 border-t ${
            isDark ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className={`flex items-center space-x-2 text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <HeartIcon className="w-4 h-4 text-red-500" />
                </motion.div>
                <span>using React & TypeScript</span>
              </div>
              
              <div className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                © 2025 IroHana. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

      <LegalModal 
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || 'privacy'}
      />
    </>
  );
};