'use client'

export default function Input({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  return (
    <div className="form-control">
      {label && (
        <label className="block text-sm font-medium mb-1 text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error 
            ? 'border-error focus:ring-error' 
            : 'border-gray-light focus:ring-primary'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}