"use client";

import { useCreateConcert, useDeleteConcert, useGetConcerts, useUpdateConcert } from "@/hooks/useConcert";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConcertDialog } from "@/components/concert/ConcertDialog";
import { ConcertTable } from "@/components/concert/ConcertTable";
import { ConcertViewDialog } from "@/components/concert/ConcertViewDialog";
import { useConcertAdminStore } from "@/store/useConcertStore";
import ConcertForm from "@/components/concert/ConcertForm";


export default function ConcertAdminPage() {
    const { data: concerts = [], isLoading } = useGetConcerts();
    const createConcert = useCreateConcert();
    const updateConcert = useUpdateConcert();
    const deleteConcert = useDeleteConcert();
    const { toast } = useToast();

    const {
        formData,
        setFormData,
        editConcert,
        viewConcert,
        isEditOpen,
        isViewOpen,
        openEditDialog,
        closeEditDialog,
        openViewDialog,
        closeViewDialog
    } = useConcertAdminStore();

    const handleDelete = (id: string) => {
        console.log("Deleting concert:", id);
        deleteConcert.mutate(id);
    };

    const handleSave = async (formData) => {
        if (!formData.title || !formData.artist || !formData.theaterId || !formData.startTime || !formData.endTime) {
            toast({
                variant: "destructive",
                title: "Missing fields",
                description: "Please fill all required fields (Title, Artist, Theater, Start/End Time).",
            });
            return;
        }

        const payload: any = {
            title: formData.title,
            artist: formData.artist,
            imageUrl: formData.imageUrl,
            genre: formData.genre || "",
            theaterId: formData.theaterId,
            basePrice: formData.basePrice ?? 0,
            totalTickets: formData.totalTickets ?? 0,
            description: formData.description || "",
            isPublished: formData.isPublished ?? false,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
        };

        let finalPayload: any = payload;

        if (formData.image instanceof File) {
            const formDataPayload = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                formDataPayload.append(key, String(value ?? ""));
            });
            formDataPayload.append("image", formData.image);
            finalPayload = formDataPayload;
        }

        if (editConcert) {
            updateConcert.mutate({ id: editConcert._id, data: finalPayload }, { onSuccess: closeEditDialog });
        } else {
            createConcert.mutate(finalPayload, { onSuccess: closeEditDialog });
        }
    };

    const isPending = createConcert.isPending || updateConcert.isPending;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Concerts 🎤</h1>
                <Button onClick={() => openEditDialog()} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> Schedule Concert
                </Button>
            </div>

            {isViewOpen && viewConcert && (
                <ConcertViewDialog
                    open={isViewOpen}
                    setOpen={closeViewDialog}
                    concert={viewConcert}
                />
            )}

            <ConcertTable
                concerts={concerts}
                isLoading={isLoading}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onView={openViewDialog}
            />


            {isEditOpen && (
                <ConcertDialog
                    open={isEditOpen}
                    setOpen={closeEditDialog}
                    formData={formData}
                    setFormData={setFormData as any}
                    editConcert={editConcert}
                    handleSave={handleSave}
                    isPending={isPending}
                />
            )}
        </div>
    );
}
