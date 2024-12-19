"use client"

import * as React from "react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { useClickOutside } from "../../hooks/useClickOutside"

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({ options, value, onChange, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false))

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder || "Select option..."}
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" ref={ref}>
        <div className="flex flex-col">
          <input
            className="px-3 py-2 text-sm border-b"
            placeholder="Search options..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-[300px] overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No option found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-sm hover:bg-accent",
                    value === option.value && "bg-accent"
                  )}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                >
                  <IconCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 