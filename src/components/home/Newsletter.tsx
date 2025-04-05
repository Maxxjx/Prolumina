import React from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

const Newsletter = () => {
  return (
    <AnimatedGradient
      className="py-20"
      gradientClassName="from-purple-800/40 via-purple-600/30 to-purple-900/40 opacity-50"
      id="newsletter"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto bg-dark-300/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 md:p-12 relative overflow-hidden animate-on-scroll">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 mb-4">
                <span className="text-xs font-medium">Stay Connected</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Subscribe to Our <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">Newsletter</span>
              </h2>
              <p className="text-gray-300 md:text-lg max-w-2xl mx-auto">
                Get the latest updates, news, and special offers delivered directly to your inbox.
              </p>
            </div>
            
            <form className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full px-4 py-3 rounded-lg bg-dark-200 border border-purple-500/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-400 outline-none transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center group transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="mt-4 text-center text-gray-400 text-sm">
                <p>We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </form>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { number: '10K+', label: 'Subscribers' },
                { number: '25+', label: 'Countries' },
                { number: 'Weekly', label: 'Updates' },
                { number: 'Free', label: 'Always' }
              ].map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-2xl font-bold text-purple-400">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default Newsletter; 