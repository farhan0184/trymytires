"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2, Plus, CalendarDays } from "lucide-react";



import { useFetch } from "@/app/helper/hooks";
import { handleApiRequest } from "@/app/helper/formfunction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DataTable from "@/components/commons/data-table/dataTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { createProductSeasons, deleteProductSeasons, fetchProductSeasons, updateProductSeasons } from "@/app/helper/backend";

// Schema for season
const seasonSchema = z.object({
  name: z.string().min(1, "Season name is required"),
});

export default function ProductSeasonsPage() {
  const [data, getData, { loading }] = useFetch(fetchProductSeasons);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: "",
    },
  });

  

  const handleDataChange = ({ page, search }) => {
    getData({ page, search });
  };

  const openAddModal = () => {
    form.reset({ name: "" });
    setIsEdit(false);
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    form.reset({ name: item.name });
    setEditId(item._id);
    setIsEdit(true);
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      ...(isEdit && { _id: editId }),
    };
    await handleApiRequest({
      apiFunc: isEdit ? updateProductSeasons : createProductSeasons,
      payload,
      setLoading: setBtnLoading,
      setModal: setModalOpen,
      onSuccess: () => {
        form.reset({ name: "" });
        setIsEdit(false);
        setEditId(null);
        getData();
      },
    });
  };

  const handleDelete = async (item) => {
    await handleApiRequest({
      apiFunc: deleteProductSeasons,
      payload: item._id,
      onSuccess: getData,
    });
  };

  const handleStatusToggle = async (item) => {
    const payload = {
      _id: item._id,
      status: !item.status,
    };
    await handleApiRequest({
      apiFunc: updateProductSeasons,
      payload,
      onSuccess: getData,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Season Name",
      cell: ({ row }) => <span className="text-gray-800">{row.original.name}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={() => handleStatusToggle(row.original)}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row.original)}>
            <Edit className="size-5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Season</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}&quot;?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const actionButton = (
    <Button onClick={openAddModal} className="h-12 flex items-center space-x-2 cursor-pointer">
      <Plus className="size-5" />
      <span>Add Season</span>
    </Button>
  );

  return (
    <>
      <DataTable
        data={data?.docs || []}
        columns={columns}
        loading={loading}
        title="Product Seasons"
        description="Manage your seasonal designations"
        icon={CalendarDays}
        searchConfig={{
          placeholder: "Search by season name...",
          fields: ["name"],
          serverSide: true,
        }}
        paginationConfig={{
          serverSide: true,
          itemsPerPage: 10,
          totalItems: data?.totalDocs || 0,
        }}
        onDataChange={handleDataChange}
        emptyMessage="No product seasons found"
        noResultsMessage="No matching product seasons"
        actionButton={actionButton}
      />

      {/* Add/Edit Season Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Season" : "Add Season"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-2"
              noValidate
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., All-Season, Winter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  disabled={btnLoading}
                  className={'cursor-pointer'}
                  onClick={() => {
                    setModalOpen(false);
                    setIsEdit(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={btnLoading} className={'cursor-pointer'}>
                  {btnLoading
                    ? isEdit
                      ? "Updating..."
                      : "Creating..."
                    : isEdit
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
