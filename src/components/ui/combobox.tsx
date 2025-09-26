"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    options: { value: string; label: string; }[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    noResultsText?: string;
}

export function Combobox({ options, value, onChange, placeholder, noResultsText}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes((value || '').toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
         <div className="relative">
            <Command>
              <CommandInput 
                placeholder={placeholder || "Search..."} 
                value={value}
                onValueChange={onChange}
                onFocus={() => setOpen(true)}
                className="w-full justify-between"
              />
            </Command>
            <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <CommandList>
            {filteredOptions.length === 0 && (value || "").length > 0 && (
                <CommandItem
                    value={value}
                    onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                    }}
                >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        "opacity-0"
                        )}
                    />
                    Criar "{value}"
                </CommandItem>
            )}
            <CommandEmpty>{noResultsText || "No results found."}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === option.value.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
      </PopoverContent>
    </Popover>
  )
}
