import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Activity, ChevronUp, MessageCircle, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto overflow-hidden">
      
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
        
        {/* Help Bubble Popover */}
        {isHelpOpen && (
          <div className="mb-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 animate-slide-up backdrop-blur-lg">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-bold text-gray-900 dark:text-white">SHAMS Support</h5>
              <button onClick={() => setIsHelpOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">How can we help you today, Dr.?</p>
            <button className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-semibold transition-colors">
              Start Live Chat
            </button>
          </div>
        )}

        <div className="flex gap-3">
          {/* Help/Chat Button */}
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-4 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg shadow-teal-500/30 transition-all active:scale-95"
            aria-label="Help"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className={`p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all active:scale-95 ${
              showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
            }`}
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ... [Rest of your Brand, Quick Links, and Contact code remains exactly as is] ... */}
          
       <div className="space-y-5">
  <div className="flex items-center gap-3">
    {/* Logo Container - Circular & Transparent */}
    <div className="bg-transparent rounded-full overflow-hidden flex items-center justify-center">
      <img 
        src="/src/assets/logo.png" 
        alt="SHAMS Logo" 
        className="w-10 h-10 object-contain rounded-full transition-transform hover:scale-110 duration-300"
      />
    </div>
    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
      SHAMS
    </h3>
  </div>
  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    Smart Healthcare Appointment Management System — streamlining your healthcare experience through innovation and care.
  </p>
</div>
          <div>
            <h4 className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              <li><Link to="/patient/dashboard" className="hover:text-blue-600 dark:hover:text-teal-400 transition-colors">Patient Portal</Link></li>
              <li><Link to="/doctor/dashboard" className="hover:text-blue-600 dark:hover:text-teal-400 transition-colors">Doctor Portal</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-blue-600 dark:hover:text-teal-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-600" /> support@shams.health</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-600" /> +254 740116601</li>
                <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 rounded-full bg-blue-50 dark:bg-gray-800 group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Healthcare Center, Nairobi</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-widest mb-6">Our Vision</h4>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Prioritizing efficiency and patient comfort through secure, modern healthcare management.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-semibold text-gray-500 tracking-wide">© {currentYear} SHAMS. All rights reserved.</p>
          <div className="flex items-center px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-700">
             <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};