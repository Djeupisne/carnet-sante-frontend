import React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx('bg-white shadow-sm border border-gray-200 rounded-lg', className)}>
      {children}
    </div>
  )
}

export default Card