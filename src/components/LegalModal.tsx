import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  XMarkIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  CakeIcon,
  ServerIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'cookies';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const { isDark } = useTheme();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case 'privacy':
        return ShieldCheckIcon;
      case 'terms':
        return DocumentTextIcon;
      case 'cookies':
        return CakeIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const Icon = getIcon();

  const content = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How we protect your data and privacy',
      content: (
        <div className="space-y-8">
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-emerald-900/20 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <div className="flex items-center space-x-3">
              <LockClosedIcon className={`w-6 h-6 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
              <p className={`text-base font-medium ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}>
                Your data never leaves your device. Everything happens locally in your browser.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              What We Don't Collect
            </h3>
            <ul className={`space-y-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Uploaded images (processed locally and never transmitted)</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Extracted color data</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Personal information or user accounts</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Analytics or tracking cookies</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              What We Store Locally
            </h3>
            <ul className={`space-y-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <li className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Your theme preference (dark/light mode) in browser localStorage</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Third-Party Services
            </h3>
            <div className="flex items-start space-x-3">
              <ServerIcon className={`w-5 h-5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              } mt-0.5 flex-shrink-0`} />
              <p className={`text-base ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                This application is hosted on GitHub Pages. GitHub may collect basic analytics data 
                such as page views and referrer information as outlined in their privacy policy.
              </p>
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Contact
            </h3>
            <p className={`text-base ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Questions about this privacy policy? Please reach out through our GitHub repository.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Rules and guidelines for using IroHana',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Acceptance of Terms
            </h3>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              By accessing and using IroHana, you accept and agree to be bound by the terms and 
              provision of this agreement.
            </p>
          </div>
          
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Use License
            </h3>
            <ul className={`space-y-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <li className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">This service is provided free of charge for personal and commercial use</span>
              </li>

              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">You may not use this service for any unlawful purpose</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">You agree not to upload inappropriate, offensive, or copyrighted content</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Disclaimer
            </h3>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              This service is provided "as is" without any representations or warranties, 
              express or implied. We make no representations or warranties in relation to 
              this service or the information and materials provided.
            </p>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Limitations
            </h3>
            <p className={`text-base pb-10 leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              In no event shall IroHana or its suppliers be liable for any damages arising 
              out of the use or inability to use this service.
            </p>
          </div>
        </div>
      )
    },
    cookies: {
      title: 'Cookie Policy',
      subtitle: 'How we use cookies and local storage',
      content: (
        <div className="space-y-8">
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center space-x-3">
              <EyeSlashIcon className={`w-6 h-6 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <p className={`text-base font-medium ${
                isDark ? 'text-blue-400' : 'text-blue-800'
              }`}>
                We use minimal local storage and no tracking cookies.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              What We Use
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-start space-x-3 mb-2">
                  <ServerIcon className={`w-5 h-5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  } mt-0.5 flex-shrink-0`} />
                  <h4 className={`text-lg font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    localStorage
                  </h4>
                </div>
                <p className={`text-base ml-8 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Used to remember your theme preference (dark/light mode). This data stays 
                  on your device and is never transmitted.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              What We Don't Use
            </h3>
            <ul className={`space-y-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Tracking cookies for analytics</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Third-party advertising cookies</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Social media tracking pixels</span>
              </li>
              <li className="flex items-start space-x-3">
                <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-base">Cross-site tracking mechanisms</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Your Control
            </h3>
            <p className={`text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              You can clear your browser's localStorage at any time to remove the stored 
              theme preference. The application will continue to work normally and default 
              to your system's theme preference.
            </p>
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              GitHub Pages
            </h3>
            <div className="flex items-start space-x-3">
              <ServerIcon className={`w-5 h-5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              } mt-0.5 flex-shrink-0`} />
              <p className={`text-base leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Our hosting provider (GitHub Pages) may use their own cookies for basic 
                analytics and service functionality as outlined in GitHub's privacy policy.
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-4xl max-h-[90vh] ${
              isDark 
                ? 'bg-slate-900/95 border-slate-700' 
                : 'bg-white/95 border-gray-200'
            } backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className={`p-8 pb-6 border-b ${
              isDark ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-violet-500 to-pink-500' 
                      : 'bg-gradient-to-br from-violet-400 to-pink-400'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {content[type].title}
                    </h2>
                    <p className={`text-base mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {content[type].subtitle}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'
                  }`}
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-8 pb-10 overflow-y-auto max-h-[calc(90vh-140px)]">
              {content[type].content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};