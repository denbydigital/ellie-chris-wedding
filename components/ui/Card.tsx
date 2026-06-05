import { ReactNode } from 'react'

interface Props { children: ReactNode; className?: string }

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-cream-bright border border-sage-200 rounded-[8px] shadow-md p-7 ${className}`}>
      {children}
    </div>
  )
}
