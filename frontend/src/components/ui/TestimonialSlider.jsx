import React, { useState } from 'react'
import GlassCard from './GlassCard'
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Home Owner & Architect',
    rating: 5,
    text: 'AeroPay made financing my office remodel incredibly easy. The slider calculations matched the actual terms exactly, and the verification modal took less than 2 minutes. Plus, the glass UI is beautiful!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    role: 'Founder, CloudScale',
    rating: 5,
    text: 'Usually, business credit applications feel clunky and slow. AeroPay is a breath of fresh air. I checked my rate terms, simulated the application, and was approved instantly. Absolute game changer.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Medical Graduate',
    rating: 5,
    text: 'Highly interactive and easy to use on my phone. Checking eligibility was quick and transparent, and the custom loan schedules allowed me to plan my monthly payments without any hidden catches.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120'
  }
]

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))
  }

  const current = TESTIMONIALS[activeIndex]

  return (
    <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="section-header">
        <span className="glass-badge">Reviews</span>
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Read success stories from thousands of happy customers who obtained digital credit with AeroPay.
        </p>
      </div>

      <div className="testimonials-container">
        <GlassCard className="testimonial-card">
          <Quote className="quote-icon" />
          
          <p className="testimonial-text">
            "{current.text}"
          </p>

          <div className="testimonial-user">
            <img 
              src={current.avatar} 
              alt={current.name} 
              className="testimonial-avatar"
            />
            <span className="testimonial-name">{current.name}</span>
            <span className="testimonial-role">{current.role}</span>
            
            <div className="testimonial-rating">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" stroke="none" />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Carousel controls */}
        <div className="slider-controls">
          <button 
            onClick={handlePrev} 
            className="slider-arrow" 
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="slider-dots">
            {TESTIMONIALS.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`slider-dot ${idx === activeIndex ? 'active' : ''}`}
              ></div>
            ))}
          </div>

          <button 
            onClick={handleNext} 
            className="slider-arrow" 
            aria-label="Next testimonial"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
