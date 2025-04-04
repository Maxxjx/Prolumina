
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedGradient from '../ui/AnimatedGradient';

const CallToAction = () => {
  return (
    <AnimatedGradient 
      className="py-20"
      gradientClassName="from-pulse-600/30 via-pulse-700/20 to-pulse-800/30 opacity-40"
    >
      <div className="container px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-dark-300/80 backdrop-blur-sm p-8 md:p-12">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-pulse-500/30 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-pulse-600/20 blur-3xl rounded-full"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-down">
              Ready to Transform Your Project Management?
            </h2>
            <p className="text-xl text-gray-300 mb-10 animate-slide-down animate-delay-100">
              Join thousands of teams delivering projects faster and more efficiently with Prolumina.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-slide-up animate-delay-200">
              <Button 
                size="lg" 
                className="bg-pulse-500 hover:bg-pulse-600 text-white px-8 py-6 text-lg"
              >
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/10 hover:bg-white/5 text-white px-8 py-6 text-lg"
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="text-gray-400 mt-6 text-sm animate-fade-in animate-delay-300">
              No credit card required. Free 14-day trial.
            </p>
          </div>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default CallToAction;
