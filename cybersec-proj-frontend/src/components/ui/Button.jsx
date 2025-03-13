'use client'
import clsx from 'clsx'

export default function Button({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}) {
  return (
    <button
      {...props}
      className={clsx(
        'btn transition-base', // Using CSS module class
        {
          'btn-primary': variant === 'primary',
          'bg-gray-light text-foreground': variant === 'secondary',
          'bg-error text-white': variant === 'destructive'
        },
        'font-medium rounded-md px-4 py-2',
        className
      )}
    >
      {children}
    </button>
  )
}