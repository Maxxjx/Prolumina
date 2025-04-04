
import React, { useRef, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Star } from 'lucide-react';

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
    className={`flex flex-col justify-between h-full animate-slide-up animate-delay-${delay}`}
    highlight
  >
    <div>
      <div className="flex mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
          />
        ))}
      </div>
      <p className="text-gray-300 mb-6 italic">"{content}"</p>
    </div>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-pulse-500/30 flex items-center justify-center text-white font-semibold mr-3">
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
    <section className="py-20 bg-dark-400">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-dark-300 text-pulse-400 border border-white/5 mb-4 animate-fade-in">
            <span className="text-xs font-medium">What People Say</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-down">
            Loved by Teams and Clients
          </h2>
          <p className="text-gray-400 animate-slide-down animate-delay-100">
            See why teams choose Prolumina to manage their most important projects.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-parallax transition-transform duration-200 ease-out">
              <Testimonial
                content={testimonial.content}
                author={testimonial.author}
                title={testimonial.title}
                company={testimonial.company}
                rating={testimonial.rating}
                delay={index * 100}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
