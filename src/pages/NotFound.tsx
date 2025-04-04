
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import AnimatedGradient from "@/components/ui/AnimatedGradient";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AnimatedGradient className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-white mb-4 animate-fade-in">404</h1>
        <div className="glass border border-white/10 rounded-xl p-8 backdrop-blur-lg animate-slide-up animate-delay-100">
          <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-300 mb-6">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-pulse-500 hover:bg-pulse-600 text-white w-full">
              <Home className="mr-2 h-4 w-4" /> Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default NotFound;
