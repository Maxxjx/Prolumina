import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

const Hero = () => {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      const scrollY = window.scrollY;
      const offset = videoRef.current.offsetTop;
      const height = videoRef.current.offsetHeight;
      
      // Parallax effect
      if (scrollY <= offset + height) {
        const parallax = scrollY * 0.4;
        videoRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Gradient background inspired by the reference image */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-pulse-800 via-pulse-700 to-dark-300 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pulse-600/40 via-pulse-800/30 to-transparent"></div>
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4YjVjZjYxMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-dark-300 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 w-full h-full">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-pulse-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-pulse-600/20 rounded-full filter blur-3xl"></div>
        </div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-pulse-500/10 border border-pulse-500/20 text-pulse-300 mb-6 animate-fade-in">
            <span className="text-xs font-medium">Introducing ProjectPulse v1.0</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-slide-down">
            Manage Projects with
            <span className="relative inline-block px-2">
              <span className="relative z-10 bg-gradient-to-r from-pulse-300 to-pulse-500 bg-clip-text text-transparent">
                Precision
              </span>
              <span className="absolute inset-0 bg-pulse-500/10 blur-lg -z-10"></span>
            </span> 
            and Ease
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-down animate-delay-100">
            A high-performance, scalable, and secure project management system designed for multi-role usage. Experience the future of project management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 mb-12 w-full sm:w-auto animate-slide-down animate-delay-200">
            <Button size="lg" className="bg-pulse-500 hover:bg-pulse-600 text-white w-full sm:w-auto px-8">
              Get Started <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white w-full sm:w-auto px-8">
              View Demo
            </Button>
          </div>
        </div>
        
        <div 
          ref={videoRef}
          className="relative mx-auto mt-8 max-w-5xl rounded-lg overflow-hidden shadow-2xl border border-white/10 animate-fade-in animate-delay-300"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-pulse-500/20 to-dark-300/80 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="bg-dark-200 aspect-[16/9] flex items-center justify-center">
            <div className="w-full max-w-4xl bg-dark-300 rounded-md overflow-hidden border border-white/10">
              <div className="bg-dark-400 h-10 border-b border-white/10 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-1/2 h-6 rounded bg-dark-200"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <div className="h-8 w-4/5 bg-dark-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 bg-dark-200 rounded flex items-center px-3">
                          <div className="w-6 h-6 rounded bg-pulse-500/20 mr-3"></div>
                          <div className="flex-1 h-4 bg-dark-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-dark-200 rounded-lg p-4">
                          <div className="w-12 h-12 rounded-full bg-pulse-500/20 mb-3"></div>
                          <div className="h-5 bg-dark-100 rounded mb-2"></div>
                          <div className="h-4 bg-dark-100 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-dark-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="h-6 bg-dark-100 rounded w-1/4"></div>
                        <div className="h-10 bg-pulse-500/30 rounded w-1/5"></div>
                      </div>
                      <div className="h-[200px] bg-dark-100 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-pulse-500/20 to-transparent rounded-lg">
                          <div className="absolute bottom-0 left-0 w-full h-1/2">
                            <div className="h-full w-1/6 bg-pulse-500/40 rounded-t-lg absolute bottom-0 left-[10%]"></div>
                            <div className="h-[70%] w-1/6 bg-pulse-500/40 rounded-t-lg absolute bottom-0 left-[30%]"></div>
                            <div className="h-[90%] w-1/6 bg-pulse-500/40 rounded-t-lg absolute bottom-0 left-[50%]"></div>
                            <div className="h-[40%] w-1/6 bg-pulse-500/40 rounded-t-lg absolute bottom-0 left-[70%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-300 to-transparent"></div>
    </div>
  );
};

export default Hero;
