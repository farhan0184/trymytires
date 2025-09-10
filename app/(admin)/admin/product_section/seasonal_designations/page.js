"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, Edit, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/commons/data-table/dataTable";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

import {
  fetchProductSeasonalDesignations,
  createProductSeasonalDesignations,
  updateProductSeasonalDesignations,
  deleteProductSeasonalDesignations,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { handleApiRequest } from "@/app/helper/formfunction";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function ProductSeasonalDesignationPage() {
  const [data, getData, { loading }] = useFetch(fetchProductSeasonalDesignations);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });



  const handleDataChange = ({ search, page }) => {
    getData({ page, search });
  };

  const openAddModal = () => {
    form.reset({ name: "" });
    setEditId(null);
    setIsEdit(false);
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
      name: values.name,
      ...(isEdit && { _id: editId }),
    };

    await handleApiRequest({
      apiFunc: isEdit ? updateProductSeasonalDesignations : createProductSeasonalDesignations,
      payload,
      setLoading: setBtnLoading,
      setModal: setModalOpen,
      onSuccess: () => {
        form.reset({ name: "" });
        setEditId(null);
        setIsEdit(false);
        getData();
      },
    });
  };

  const handleDelete = async (item) => {
    await handleApiRequest({
      apiFunc: deleteProductSeasonalDesignations,
      payload: item._id,
      onSuccess: getData,
    });
  };

  const handleStatusToggle = async (item) => {
    await handleApiRequest({
      apiFunc: updateProductSeasonalDesignations,
      payload: { _id: item._id, status: !item.status },
      onSuccess: getData,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => <div className="subtitleText font-bold px-4 py-3">Seasonal Designation</div>,
      cell: ({ row }) => <span className="subtitleText px-4 py-3">{row.original.name}</span>,
    },
    {
      accessorKey: "status",
      header: () => <div className="subtitleText font-bold px-4 py-3">Status</div>,
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={() => handleStatusToggle(row.original)}
        />
      ),
    },
    {
      id: "actions",
      header: () => <div className="subtitleText font-bold px-4 py-3 text-end">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row.original)}>
            <Edit className="size-5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
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

  return (
    <>
      <DataTable
        data={data?.docs || []}
        columns={columns}
        loading={loading}
        title="Seasonal Designation"
        description="Manage tire seasonal usage types"
        icon={LayoutDashboard}
        searchConfig={{
          placeholder: "Search by name...",
          fields: ["name"],
          serverSide: true,
        }}
        paginationConfig={{
          serverSide: true,
          itemsPerPage: 10,
          totalItems: data?.totalDocs || 0,
        }}
        onDataChange={handleDataChange}
        emptyMessage="No seasonal designation entries found"
        noResultsMessage="No matching entries"
        actionButton={
          <Button onClick={openAddModal} className="h-12 flex items-center space-x-2 cursor-pointer">
            <Plus className="size-5" />
            <span>Add New</span>
          </Button>
        }
      />

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Add New"} Seasonal Designation</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter designation name" {...field} />
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
