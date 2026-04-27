import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, className = '' }) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    } ${className}`}>
      {children}
    </div>
  )
}
