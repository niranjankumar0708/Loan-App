import React, { useRef } from 'react'

export default function GlassCard({ children, className = '', ...props }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mx', `${x}px`)
    cardRef.current.style.setProperty('--my', `${y}px`)
  }

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {children}
    </div>
  )
}
