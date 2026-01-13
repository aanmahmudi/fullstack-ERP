import type { ReactNode } from 'react'

type Option = { value: string; label: ReactNode }

export function Segmented({
  value,
  options,
  onChange,
}: {
  value: string
  options: Option[]
  onChange: (value: string) => void
}) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          className={`segmentedOption ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

