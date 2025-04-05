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
        <div className="absolute inset-0 bg-gradient-to-b from-purple-800 via-purple-700 to-dark-300 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/40 via-purple-800/30 to-transparent"></div>
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4YjVjZjYxMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-dark-300 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 w-full h-full">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow animate-delay-700"></div>
        </div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 mb-6 animate-fade-in hover:bg-purple-500/20 transition-all duration-300 cursor-pointer">
            <span className="text-xs font-medium">Introducing Prolumina v1.0</span>
            <span className="ml-2 text-xs">New</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-slide-down">
            Manage Projects with
            <span className="relative inline-block px-2 ml-2">
              <span className="relative z-10 bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                Precision
              </span>
              <span className="absolute inset-0 bg-purple-500/10 blur-lg -z-10"></span>
            </span> 
            <span className="block mt-1">and Ease</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-down animate-delay-100">
            A high-performance, scalable, and secure project management system designed for multi-role usage. 
            <span className="text-purple-300">Experience the future of project management.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 mb-12 w-full sm:w-auto animate-slide-down animate-delay-200">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto px-8 group relative overflow-hidden shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40">
              <span className="relative z-10 flex items-center">
                Get Started <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white w-full sm:w-auto px-8 hover:border-purple-400/30 transition-colors">
              View Demo
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 animate-fade-in animate-delay-300">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-300 bg-dark-200 flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>Trusted by 10,000+ teams worldwide</span>
          </div>
        </div>
        
        <div 
          ref={videoRef}
          className="relative mx-auto mt-8 max-w-5xl rounded-lg overflow-hidden shadow-2xl border border-purple-500/10 animate-fade-in animate-delay-300 animate-on-scroll"
        >
          {/* Hover animation */}
          <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-b from-purple-500/30 via-transparent to-transparent transition-opacity duration-500 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-dark-300/80 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
          <div className="bg-dark-200 aspect-[16/9] flex items-center justify-center">
            <div className="w-full max-w-4xl bg-dark-300 rounded-md overflow-hidden border border-white/10 shadow-lg transform transition-transform duration-700 hover:scale-[1.01]">
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
                        <div key={i} className="h-10 bg-dark-200 rounded flex items-center px-3 hover:bg-dark-100 transition-colors cursor-pointer">
                          <div className="w-6 h-6 rounded bg-purple-500/20 mr-3"></div>
                          <div className="flex-1 h-4 bg-dark-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-9">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-dark-200 rounded-lg p-4 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-300 cursor-pointer">
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 mb-3"></div>
                          <div className="h-5 bg-dark-100 rounded mb-2"></div>
                          <div className="h-4 bg-dark-100 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-dark-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="h-6 bg-dark-100 rounded w-1/4"></div>
                        <div className="h-10 bg-purple-500/30 rounded w-1/5 hover:bg-purple-500/40 transition-colors cursor-pointer"></div>
                      </div>
                      <div className="h-[200px] bg-dark-100 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-purple-500/20 to-transparent rounded-lg">
                          <div className="absolute bottom-0 left-0 w-full h-1/2">
                            <div className="h-full w-1/6 bg-purple-500/40 rounded-t-lg absolute bottom-0 left-[10%] hover:bg-purple-500/60 transition-colors cursor-pointer"></div>
                            <div className="h-[70%] w-1/6 bg-purple-500/40 rounded-t-lg absolute bottom-0 left-[30%] hover:bg-purple-500/60 transition-colors cursor-pointer"></div>
                            <div className="h-[90%] w-1/6 bg-purple-500/40 rounded-t-lg absolute bottom-0 left-[50%] hover:bg-purple-500/60 transition-colors cursor-pointer"></div>
                            <div className="h-[40%] w-1/6 bg-purple-500/40 rounded-t-lg absolute bottom-0 left-[70%] hover:bg-purple-500/60 transition-colors cursor-pointer"></div>
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
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-500/10"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
