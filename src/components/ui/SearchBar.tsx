import React from 'react';
import { cn } from '@/utils/cn';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchBar = ({ className, ...props }: SearchBarProps) => {
  return (
    <div className={cn("relative", className)}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-text-secondary" />
      <input
        type="search"
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-border 
                 focus:outline-none focus:ring-2 focus:ring-primary-main/50
                 bg-white placeholder:text-neutral-text-secondary"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
}; 
