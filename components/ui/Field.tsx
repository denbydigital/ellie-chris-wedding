'use client'
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

const inputClass = [
  'w-full font-[var(--font-body)] text-[17px] text-fg1',
  'bg-cream-bright border border-sage-200 rounded-[4px]',
  'px-[14px] py-3 outline-none transition-colors duration-300',
  'focus:border-gold-500',
].join(' ')

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label: string }
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: string }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label: string; options: string[] }

const Label = ({ text }: { text: string }) => (
  <span className="block font-[var(--font-ui)] text-[12px] tracking-[0.16em] uppercase text-fg3 mb-2">
    {text}
  </span>
)

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      <Label text={label} />
      <input {...props} className={`${inputClass} ${className}`} />
    </label>
  )
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <label className="block">
      <Label text={label} />
      <textarea {...props} className={`${inputClass} resize-y ${className}`} />
    </label>
  )
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <label className="block">
      <Label text={label} />
      <select {...props} className={`${inputClass} ${className}`}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
