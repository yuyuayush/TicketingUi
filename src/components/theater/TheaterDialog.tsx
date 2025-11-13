"use client";

import { useState } from "react";
import { GenericDialog } from "@/components/common/GenericDialog";
import { useGetCities } from "@/hooks/useCity";
import {
  Input,
  Button,
  Badge,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

export function TheaterDialog({
  open,
  setOpen,
  formData,
  setFormData,
  editTheater,
  handleSave,
  isPending,
}: any) {
  const { data: cities = [], isLoading } = useGetCities();
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);

  const handleFacilityChange = (value: string) => {
    setFormData((prev: any) => {
      const exists = prev.facilities.includes(value);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f: string) => f !== value)
          : [...prev.facilities, value],
      };
    });
  };

  return (
    <GenericDialog
      open={open}
      setOpen={setOpen}
      title={editTheater ? "Edit Theater" : "Add Theater"}
      onSave={handleSave}
      isPending={isPending}
    >
      {/* Theater Name */}
      <Input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      {/* City Dropdown */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">City</label>
        <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "justify-between w-full",
                !formData.city && "text-muted-foreground"
              )}
            >
              {formData.city
                ? cities.find((c: any) => c._id === formData.city)?.name
                : "Select City"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandList>
                <CommandEmpty>No cities found.</CommandEmpty>
                <CommandGroup>
                  {isLoading ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      Loading cities...
                    </div>
                  ) : (
                    cities.map((city: any) => (
                      <CommandItem
                        key={city._id}
                        value={city.name}
                        onSelect={() => {
                          setFormData({ ...formData, city: city._id });
                          setCityPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.city === city._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {city.name} — {city.state}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Address */}
      <Input
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      {/* Facilities */}
      <div>
        <label className="text-sm font-medium">Facilities</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {["Parking", "Snacks", "Wheelchair Accessible", "AC Hall", "Online Booking"].map(
            (facility) => (
              <Badge
                key={facility}
                variant={
                  formData.facilities.includes(facility)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer select-none"
                onClick={() => handleFacilityChange(facility)}
              >
                {facility}
              </Badge>
            )
          )}
        </div>
      </div>

      {/* Coordinates */}
      <div className="flex gap-2">
        <Input
          placeholder="Latitude"
          type="number"
          value={formData.latitude}
          onChange={(e) =>
            setFormData({ ...formData, latitude: e.target.value })
          }
        />
        <Input
          placeholder="Longitude"
          type="number"
          value={formData.longitude}
          onChange={(e) =>
            setFormData({ ...formData, longitude: e.target.value })
          }
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Active</label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
      </div>
    </GenericDialog>
  );
}
