
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
          ? "bg-dark-300/80 backdrop-blur-md border-b border-white/5 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="h-8 w-8 rounded-md bg-pulse-500 bg-gradient-to-br from-pulse-400 to-pulse-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl text-white">Prolumina</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-gray-200 hover:text-white link-underline">
            Features
          </Link>
          <Link to="/" className="text-sm font-medium text-gray-200 hover:text-white link-underline">
            Solutions
          </Link>
          <Link to="/" className="text-sm font-medium text-gray-200 hover:text-white link-underline">
            Pricing
          </Link>
          <Link to="/" className="text-sm font-medium text-gray-200 hover:text-white link-underline">
            Resources
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" className="text-gray-200 hover:text-white" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button className="bg-pulse-500 hover:bg-pulse-600 text-white">
            View Demo <ChevronRight className="ml-1 h-3 w-3" />
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
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-dark-300/95 backdrop-blur-md animate-fade-in">
          <nav className="container flex flex-col py-8 px-4 gap-6">
            <Link 
              to="/" 
              className="text-lg font-medium text-white py-3 px-4 rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/" 
              className="text-lg font-medium text-white py-3 px-4 rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link 
              to="/" 
              className="text-lg font-medium text-white py-3 px-4 rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/" 
              className="text-lg font-medium text-white py-3 px-4 rounded-md hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="flex flex-col space-y-3 mt-4">
              <Button variant="outline" className="w-full justify-center border-white/10" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              </Button>
              <Button className="w-full justify-center bg-pulse-500 hover:bg-pulse-600">
                View Demo <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
