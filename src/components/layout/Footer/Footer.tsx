import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary dark:text-teal-400">SHAMS</h3>
            <p className="text-sm text-neutral dark:text-gray-400">
              Smart Healthcare Appointment Management System — streamlining your healthcare experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-neutral dark:text-gray-400">
              <li><Link to="/patient/dashboard" className="hover:text-primary dark:hover:text-teal-400 transition-colors">Patient Portal</Link></li>
              <li><Link to="/doctor/dashboard" className="hover:text-primary dark:hover:text-teal-400 transition-colors">Doctor Portal</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-primary dark:hover:text-teal-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                support@shams.health
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                Healthcare Center, City
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              About
            </h4>
            <p className="text-sm text-neutral dark:text-gray-400">
              SHAMS provides a seamless way to manage appointments, queue status, and medical records.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral dark:text-gray-500">
            © {currentYear} SHAMS. All rights reserved.
          </p>
          <p className="text-xs text-neutral dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-warmRed fill-warmRed" /> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};
