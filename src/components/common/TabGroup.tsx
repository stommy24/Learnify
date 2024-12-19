"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface TabGroupProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultValue?: string;
  className?: string;
}

export function TabGroup({ tabs, defaultValue, className }: TabGroupProps) {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || tabs[0]?.id}
      className={cn("w-full", className)}
    >
      <TabsPrimitive.List className="flex border-b">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "px-4 py-2 -mb-px text-sm font-medium transition-colors",
              "border-b-2 border-transparent",
              "hover:text-primary",
              "data-[state=active]:border-primary data-[state=active]:text-primary"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.id}
          value={tab.id}
          className="mt-4"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
} 