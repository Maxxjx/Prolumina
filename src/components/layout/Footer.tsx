import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-400 border-t border-white/5 py-16 px-4 md:px-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <div className="h-9 w-9 rounded-md bg-pulse-500 bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center shadow-md group-hover:shadow-pulse-500/20 transition-all duration-300">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl text-white group-hover:text-pulse-300 transition-colors">Prolumina</span>
            </div>
            <p className="text-gray-400 text-sm">
              High-performance project management for teams that demand excellence.
            </p>
            <div className="flex space-x-5 pt-2">
              {[
                {icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                ), label: 'Twitter'},
                {icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                ), label: 'LinkedIn'},
                {icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                ), label: 'GitHub'}
              ].map((social, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform p-2 rounded-full hover:bg-white/5" 
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {[
            {title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Updates']},
            {title: 'Resources', links: ['Blog', 'Documentation', 'Community', 'Guides']},
            {title: 'Company', links: ['About', 'Careers', 'Contact', 'Partners']}
          ].map((section, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 inline-flex items-center group">
                      <span className="group-hover:text-pulse-300">{link}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Prolumina. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy', 'Terms', 'Data Policy'].map((item, i) => (
              <Link key={i} to="/" className="text-gray-400 hover:text-white transition-colors text-sm hover:text-pulse-300">
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter subscription - added feature */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-white font-medium mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Get the latest updates and news directly to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-dark-300 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent flex-grow"
              />
              <button className="bg-pulse-500 hover:bg-pulse-600 text-white rounded-md px-4 py-2 font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
