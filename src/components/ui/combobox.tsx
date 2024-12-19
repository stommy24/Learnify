import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as ComboboxPrimitive from '@radix-ui/react-combobox';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <ComboboxPrimitive.Root
      value={value}
      onValueChange={onChange}
      open={open}
      onOpenChange={setOpen}
    >
      <div className={cn("relative", className)}>
        <ComboboxPrimitive.Trigger className="w-full border rounded-md px-3 py-2 text-sm flex items-center justify-between">
          <span>
            {value
              ? options.find(option => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </ComboboxPrimitive.Trigger>
        
        <ComboboxPrimitive.Portal>
          <ComboboxPrimitive.Content className="absolute w-full min-w-[200px] p-1 bg-white rounded-md shadow-lg">
            <ComboboxPrimitive.Viewport>
              {options.map((option) => (
                <ComboboxPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "relative flex items-center px-2 py-2 text-sm rounded-sm cursor-pointer",
                    "hover:bg-slate-100 focus:bg-slate-100",
                    "data-[state=checked]:bg-slate-100"
                  )}
                >
                  <span className="flex-1">{option.label}</span>
                  <ComboboxPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </ComboboxPrimitive.ItemIndicator>
                </ComboboxPrimitive.Item>
              ))}
            </ComboboxPrimitive.Viewport>
          </ComboboxPrimitive.Content>
        </ComboboxPrimitive.Portal>
      </div>
    </ComboboxPrimitive.Root>
  );
} 