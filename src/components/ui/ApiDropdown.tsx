"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui";
import { Button } from "@/components/ui/button";

interface ApiDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  fetchFn: () => Promise<any[]>; // Function that returns a list of options
  getLabel?: (item: any) => string; // how to display item
  getValue?: (item: any) => string; // how to extract item id
}

export const ApiDropdown: React.FC<ApiDropdownProps> = ({
  label,
  placeholder = "Select...",
  value,
  onChange,
  fetchFn,
  getLabel = (item) => item.name,
  getValue = (item) => item._id,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFn();
        setOptions(data || []);
      } catch (err) {
        console.error("Dropdown fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchFn]);

  const selectedItem = options.find((o) => getValue(o) === value);

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : selectedItem
              ? getLabel(selectedItem)
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label || ""}`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {options.map((item) => (
                <CommandItem
                  key={getValue(item)}
                  onSelect={() => {
                    onChange(getValue(item));
                    setOpen(false);
                  }}
                >
                  {getLabel(item)}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
