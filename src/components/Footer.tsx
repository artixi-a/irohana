import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { LegalModal } from './LegalModal';
import { 
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
    { name: 'GitHub', href: 'https://github.com/artixi-a/irohana', icon: CodeBracketIcon, external: true },
    { name: 'Portfolio', href: '#', icon: ArrowTopRightOnSquareIcon, external: true },
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
        className={`mt-24 cursor-default ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white border-gray-200'
        } backdrop-blur-sm border rounded-2xl p-6 md:p-8`}
      >
        <div className="max-w-4xl mx-auto cursor-default">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 cursor-default">
            {/* Brand section */}
            <div className="md:col-span-1 cursor-default">
              <div className="flex items-center space-x-3 mb-4 cursor-default">
                <div className={`p-2 rounded-xl cursor-default ${
                  isDark 
                    ? 'bg-gradient-to-br from-violet-500 to-pink-500' 
                    : 'bg-gradient-to-br from-violet-400 to-pink-400'
                }`}>
                  <SwatchIcon className="w-5 h-5 text-white cursor-default" />
                </div>
                <span className={`text-xl font-semibold cursor-default ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  IroHana
                </span>
              </div>
              <p className={`text-sm leading-relaxed cursor-default ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                A beautiful, fast, and privacy-first color palette extractor. 
                All processing happens in your browser.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-1 cursor-default">
              <h3 className={`text-sm font-semibold mb-4 cursor-default ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Connect
              </h3>
              <div className="space-y-3 cursor-default">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`flex items-center space-x-2 text-sm transition-all duration-200 group ${
                      isDark 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="group-hover:underline underline-offset-2">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="md:col-span-1 cursor-default">
              <h3 className={`text-sm font-semibold mb-4 cursor-default ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Legal
              </h3>
              <div className="space-y-3 cursor-default">
                {legalLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => setModalType(link.type)}
                    className={`flex items-center space-x-2 text-sm transition-all duration-200 group cursor-default ${
                      isDark 
                        ? 'text-slate-400 hover:text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <link.icon className="w-4 h-4 cursor-default" />
                    <span className="group-hover:underline underline-offset-2 cursor-default">{link.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className={`pt-4 md:pt-6 border-t cursor-default ${
            isDark ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className={`text-center text-sm cursor-default ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              © 2025 IroHana. All rights reserved.
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