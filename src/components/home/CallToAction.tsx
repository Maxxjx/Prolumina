import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import AnimatedGradient from '../ui/AnimatedGradient';

const CallToAction = () => {
  return (
    <AnimatedGradient 
      className="py-24"
      gradientClassName="from-pulse-600/30 via-pulse-700/20 to-pulse-800/30 opacity-40"
    >
      <div className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-dark-300/80 backdrop-blur-sm p-8 md:p-12 animate-on-scroll">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-pulse-500/30 blur-3xl rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-pulse-600/20 blur-3xl rounded-full animate-pulse-slow animate-delay-700"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-down">
              Ready to Transform Your <span className="bg-gradient-to-r from-pulse-300 to-pulse-500 bg-clip-text text-transparent">Project Management</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 animate-slide-down animate-delay-100">
              Join thousands of teams delivering projects faster and more efficiently with Prolumina.
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10 animate-slide-up animate-delay-200">
              {['Unlimited projects', '24/7 support', 'Data encryption', 'Custom integrations'].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-white">
                  <Check size={16} className="mr-2 text-pulse-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-slide-up animate-delay-200">
              <Button 
                size="lg" 
                className="bg-pulse-500 hover:bg-pulse-600 text-white px-8 py-6 text-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Today <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pulse-400 to-pulse-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/10 hover:bg-white/5 text-white px-8 py-6 text-lg hover:border-white/30 transition-colors"
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="text-gray-400 mt-6 text-sm animate-fade-in animate-delay-300">
              No credit card required. <span className="text-pulse-300">Free 14-day trial.</span>
            </p>
          </div>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default CallToAction;
