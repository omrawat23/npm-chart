'use client'

import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

const colors = [
  '#FF6B6B', '#FF8787', '#FFA07A', '#FFD700', '#98FB98',
  '#87CEEB', '#00CED1', '#9370DB', '#FF69B4', '#DDA0DD',
  '#F0E68C', '#90EE90', '#87CEFA', '#DDA0DD', '#FFB6C1'
]

interface ColorPickerProps {
  onChange: (color: string) => void
}

export function ColorPicker({ onChange }: ColorPickerProps) {
  const [isDark, setIsDark] = useState(true)

  return (
    <div className="absolute right-64 bg-card border border-border rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-5 gap-2 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-neutral-500" />
          <div className="w-2 h-2 rounded-full bg-neutral-500" />
          <div className="w-2 h-2 rounded-full bg-neutral-500" />
          <div className="w-2 h-2 rounded-full bg-neutral-500" />
          <div className="w-2 h-2 rounded-full bg-neutral-500" />
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="ml-4 p-1 rounded-md hover:bg-secondary"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </div>
  )
}
