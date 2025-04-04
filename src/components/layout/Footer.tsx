
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-400 border-t border-white/5 py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-pulse-500 bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl text-white">Prolumina</span>
            </div>
            <p className="text-gray-400 text-sm">
              High-performance project management for teams that demand excellence.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Features</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Integrations</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Updates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Community</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Partners</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Prolumina. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link>
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</Link>
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Data Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
