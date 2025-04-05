import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-6",
        isScrolled 
          ? "bg-dark-300/90 backdrop-blur-xl border-b border-white/5 shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="h-9 w-9 rounded-md bg-pulse-500 bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center shadow-md group-hover:shadow-pulse-500/30 transition-all duration-300">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pulse-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">Prolumina</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Features', 'Solutions', 'Pricing', 'Resources'].map((item, i) => (
            <Link 
              key={i}
              to="/" 
              className="text-sm font-medium text-gray-200 hover:text-white relative group py-1"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pulse-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-white/5" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button className="bg-pulse-500 hover:bg-pulse-600 text-white group relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              View Demo <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-pulse-400 to-pulse-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-200 hover:text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-dark-300/95 backdrop-blur-xl animate-fade-in">
          <nav className="container flex flex-col py-8 px-4 gap-6">
            {['Features', 'Solutions', 'Pricing', 'Resources'].map((item, i) => (
              <Link 
                key={i}
                to="/" 
                className="text-lg font-medium text-white py-3 px-4 rounded-md hover:bg-white/5 active:bg-white/10 transition-colors border-l-2 border-transparent hover:border-pulse-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 mt-4">
              <Button variant="outline" className="w-full justify-center border-white/10 hover:border-white/30" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              </Button>
              <Button className="w-full justify-center bg-pulse-500 hover:bg-pulse-600 group">
                <span className="flex items-center">
                  View Demo <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
