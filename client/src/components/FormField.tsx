import React from 'react'

type InputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
}

export function Input({ label, value, onChange, error, type = 'text', placeholder }: InputProps) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'}`}
      />
      {error && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</div>}
    </div>
  )
}

type SelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  error?: string
}

export function Select({ label, value, onChange, options, error }: SelectProps) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</div>}
    </div>
  )
}
