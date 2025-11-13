"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { GenericDialog } from "@/components/common/GenericDialog";
import { ApiDropdown } from "@/components/ui/ApiDropdown";
import { theatersApi } from "@/lib/api";

interface ShowFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  isPending?: boolean;
  editShow?: boolean;
}

export const ShowFormDialog: React.FC<ShowFormDialogProps> = ({
  open,
  setOpen,
  formData,
  setFormData,
  onSave,
  isPending,
  editShow,
}) => {
  return (
    <GenericDialog
      open={open}
      setOpen={setOpen}
      title={editShow ? "Edit Show" : "Add Show"}
      onSave={onSave}
      isPending={isPending}
    >
      <div className="space-y-3 py-2">
        {/* Title */}
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Description */}
        <Input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* Theater Dropdown */}
        <ApiDropdown
          label="Select Theater"
          value={formData.theater}
          onChange={(id) => setFormData({ ...formData, theater: id })}
          fetchFn={async () => {
            const res = await theatersApi.getAll();
            return res.data?.theaters || [];
          }}
          getLabel={(t) => `${t.name} (${t.city?.name || "No City"})`}
          getValue={(t) => t._id}
        />

        {/* Date & Time */}
        <div className="flex gap-2">
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-sm font-medium">Active</label>
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
          />
        </div>
      </div>
    </GenericDialog>
  );
};
