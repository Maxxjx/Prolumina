import React, { useRef, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Star, ArrowRight } from 'lucide-react';
import AnimatedGradient from '@/components/ui/AnimatedGradient';

interface TestimonialProps {
  content: string;
  author: string;
  title: string;
  company: string;
  rating: number;
  delay: number;
}

const Testimonial = ({ content, author, title, company, rating, delay }: TestimonialProps) => (
  <GlassCard 
    className={`flex flex-col justify-between h-full animate-slide-up animate-delay-${delay} animate-on-scroll hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group`}
    highlight
  >
    <div>
      <div className="flex mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" : "text-gray-600"} 
          />
        ))}
      </div>
      <p className="text-gray-300 mb-6 italic group-hover:text-white transition-colors">"{content}"</p>
    </div>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-white font-semibold mr-3 group-hover:bg-purple-500/50 transition-colors">
        {author.charAt(0)}
      </div>
      <div>
        <h4 className="font-medium text-white text-sm">{author}</h4>
        <p className="text-xs text-gray-400">{title}, {company}</p>
      </div>
    </div>
  </GlassCard>
);

const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const testimonials = [
    {
      content: "Prolumina transformed how our team manages projects. The real-time analytics and multi-role access have streamlined our workflow significantly.",
      author: "Sarah Johnson",
      title: "Product Manager",
      company: "TechSolutions Inc.",
      rating: 5
    },
    {
      content: "The most intuitive project management tool I've ever used. Our team's productivity increased by 35% within the first month of adoption.",
      author: "David Chen",
      title: "CTO",
      company: "Innovate AI",
      rating: 5
    },
    {
      content: "As a client, I appreciate the transparency Prolumina provides. I can track progress in real-time without constant meetings or updates.",
      author: "Alex Rivera",
      title: "Marketing Director",
      company: "Brandwise",
      rating: 4
    },
    {
      content: "The Kanban boards and time tracking features are game-changers. Our project delivery is now consistently on time and within budget.",
      author: "Michael Torres",
      title: "Team Lead",
      company: "DevForge",
      rating: 5
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Subtle parallax effect on hover
      const cards = containerRef.current.querySelectorAll('.card-parallax');
      cards.forEach((card, i) => {
        const depth = 1 + i * 0.5;
        const translateX = x * 10 * depth;
        const translateY = y * 10 * depth;
        const rotateX = y * 5;
        const rotateY = x * -5;
        
        (card as HTMLElement).style.transform = 
          `perspective(1000px) translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };
    
    const element = containerRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <AnimatedGradient 
      className="py-24" 
      id="testimonials"
      gradientClassName="from-purple-900/50 via-dark-300/50 to-dark-400/50 opacity-70"
    >
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-dark-200 text-purple-400 border border-purple-500/10 mb-4 animate-fade-in hover:bg-dark-100 transition-all cursor-pointer">
            <span className="text-xs font-medium">Customer Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-down">
            What Our <span className="text-purple-400">Clients</span> Say
          </h2>
          <p className="text-gray-400 animate-slide-down animate-delay-100">
            Don't just take our word for it. Here's what teams across various industries have to say about Prolumina.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              title={testimonial.title}
              company={testimonial.company}
              rating={testimonial.rating}
              delay={(index % 3) * 100}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center animate-fade-in animate-delay-500">
          <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full border border-purple-500/10 bg-dark-200/50 text-white hover:bg-dark-100/50 transition-colors cursor-pointer group">
            <span>View all customer stories</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default Testimonials;
