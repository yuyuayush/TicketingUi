"use client";

import { useState } from "react";
import { Button, Input, Badge } from "@/components/ui";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useGetShows, useCreateShow, useUpdateShow, useDeleteShow } from "@/hooks/useShow";
import { GenericTable } from "@/components/common/GenericTable";
import { GenericDialog } from "@/components/common/GenericDialog";
import { ShowFormDialog } from "@/components/show/ShowFormDialog";

export default function ShowAdminPage() {
  const { data: shows = [], isLoading } = useGetShows();
  const createShow = useCreateShow();
  const updateShow = useUpdateShow();
  const deleteShow = useDeleteShow();

  const [open, setOpen] = useState(false);
  const [editShow, setEditShow] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theater: "",
    date: "",
    time: "",
    isActive: true,
  });

  // Reset form
  const resetForm = () =>
    setFormData({
      title: "",
      description: "",
      theater: "",
      date: "",
      time: "",
      isActive: true,
    });

  // Handle open (edit or new)
  const handleAdd = () => {
    setEditShow(null);
    resetForm();
    setOpen(true);
  };

  const handleEdit = (show: any) => {
    setEditShow(show);
    setFormData({
      title: show.title || "",
      description: show.description || "",
      theater: show.theater?._id || "",
      date: show.date?.split("T")[0] || "",
      time: show.time || "",
      isActive: show.isActive,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteShow.mutate(id);
  };

  const handleSave = () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      theater: formData.theater,
      date: formData.date,
      time: formData.time,
      isActive: formData.isActive,
    };

    if (editShow) {
      updateShow.mutate({ id: editShow._id, data: payload }, { onSuccess: () => setOpen(false) });
    } else {
      createShow.mutate(payload, { onSuccess: () => setOpen(false) });
    }
  };

  // Table columns definition (for GenericTable)
  const columns = [
    { key: "title", label: "Title" },
    { key: "theater.name", label: "Theater" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    {
      key: "isActive",
      label: "Status",
      render: (row: any) =>
        row.isActive ? (
          <Badge variant="outline" className="text-green-600 border-green-300">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-300">
            Inactive
          </Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Shows</h1>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Show
        </Button>
      </div>

      {/* Table */}
      <GenericTable
        data={shows}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialog */}
      <ShowFormDialog
        open={open}
        setOpen={setOpen}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isPending={createShow.isPending || updateShow.isPending}
        editShow={!!editShow}
      />
    </div>
  );
}
