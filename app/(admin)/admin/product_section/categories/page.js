"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Edit, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/app/helper/hooks";
import { createProductCategories, deleteProductCategories, fetchProductCategories, updateProductCategories } from "@/app/helper/backend";
import DataTable from "@/components/commons/data-table/dataTable";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { categoryStatusToggle, handleApiRequest, handleCreateCategory, handleDeleteCreateCategory } from "@/app/helper/formfunction";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function CategoriesPage() {
  const [data, getData, { loading }] = useFetch(fetchProductCategories);
  const [btnLoading, setBtnLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // react-hook-form + zod setup
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  // Load data initially
  

  // Search & pagination trigger handler
  const handleDataChange = ({ search, page }) => {
    getData({ page, search });
  };

  // Open modal for add new
  const openAddModal = () => {
    form.reset({ name: "" });
    setEditId(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  // Open modal for edit with data loaded
  const openEditModal = (category) => {
    form.reset({ name: category.name });
    setEditId(category._id);
    setIsEdit(true);
    setModalOpen(true);
  };

  // Submit handler for add/edit
  const onSubmit = async (values) => {
    const _id = editId;

    await handleApiRequest({
      apiFunc: isEdit ? updateProductCategories : createProductCategories,
      payload: isEdit ? { ...values, _id } : values,
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


  const handleDelete = async (category) => {
    await handleApiRequest({
      apiFunc: deleteProductCategories,
      payload: category._id,
      onSuccess: getData,
    });
  };

  const handleStatusToggle = async (category) => {
    await handleApiRequest({
      apiFunc: updateProductCategories,
      payload: {
        _id: category._id,
        status: !category.status,
      },
      onSuccess: getData,
    });
  };


  // Columns for DataTable
  const columns = [
    {
      accessorKey: "name",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800 flex items-center space-x-2">
          <LayoutDashboard className="size-5" />
          <span>Category</span>
        </div>
      ),
      cell: (info) => (
        <div className="px-4 py-1 font-medium subtitleText">
          {info.getValue()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Status
        </div>
      ),
      cell: ({ row }) => (
        <Switch
          className={'cursor-pointer'}
          checked={row.original.status}
          onCheckedChange={() => handleStatusToggle(row.original)}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Created At
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-muted-foreground subtitleText">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800 text-end">
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(row.original)}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <Edit className="size-5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
              >
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}
                  &quot;?
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

  // "Add New" button for DataTable
  const actionButton = (
    <Button
      onClick={openAddModal}
      className="h-12 subtitleText flex items-center space-x-2 cursor-pointer"
    >
      <Plus className="size-5" />
      <span>Add New</span>
    </Button>
  );

  return (
    <>
      <DataTable
        data={data?.docs || []}
        columns={columns}
        loading={loading}
        title="Product Categories"
        description="Manage your product categories"
        icon={LayoutDashboard}
        searchConfig={{
          placeholder: "Search by category name...",
          fields: ["name"],
          serverSide: true,
        }}
        paginationConfig={{
          serverSide: true,
          itemsPerPage: 10,
          totalItems: data?.totalDocs || 0,
        }}
        onDataChange={handleDataChange}
        emptyMessage="No categories found"
        noResultsMessage="No matching categories"
        actionButton={actionButton} // <-- Pass here
      />

      {/* Modal for Add/Edit Category */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Category" : "Add New Category"}
            </DialogTitle>
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
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
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
