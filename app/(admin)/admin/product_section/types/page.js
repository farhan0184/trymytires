"use client";

import React, { useEffect, useState } from "react";
import { LayoutDashboard, Edit, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  fetchProductCategories,
  fetchProductTypes,
  createProductTypes,
  updateProductTypes,
  deleteProductTypes,
} from "@/app/helper/backend";

import { useFetch } from "@/app/helper/hooks";
import { handleApiRequest } from "@/app/helper/formfunction";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🧩 Zod Schema
const typeSchema = z.object({
  name: z.string().min(1, "Type name is required"),
  product_category: z.string().min(1, "Category is required"),
});

export default function ProductTypesPage() {
  const [data, getData, { loading }] = useFetch(fetchProductTypes);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      name: "",
      product_category: "",
    },
  });

  useEffect(() => {

    const loadCategories = async () => {
      const res = await fetchProductCategories({ page: 1, limit: 100 });
      setCategories(res?.data?.docs || []);
    };
    loadCategories();
  }, []);

  const handleDataChange = ({ search, page }) => {
    getData({ page, search });
  };

  const openAddModal = () => {
    form.reset({ name: "", product_category: "" });
    setIsEdit(false);
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    form.reset({
      name: item.name,
      product_category: item.product_category?._id || "",
    });
    setEditId(item._id);
    setIsEdit(true);
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      ...(isEdit && { _id: editId }),

    };

    if (!isEdit) {
      payload.product_category = values.product_category;
    }
    await handleApiRequest({
      apiFunc: isEdit ? updateProductTypes : createProductTypes,
      payload,
      setLoading: setBtnLoading,
      setModal: setModalOpen,
      onSuccess: () => {
        form.reset({ name: "", product_category: "" });
        setIsEdit(false);
        setEditId(null);
        getData();
      },
    });
  };

  const handleDelete = async (item) => {
    await handleApiRequest({
      apiFunc: deleteProductTypes,
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
      apiFunc: updateProductTypes,
      payload,
      onSuccess: getData,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => <div className="font-bold px-4 py-3 text-gray-800">Name</div>,
      cell: ({ row }) => (
        <span className="px-4 py-3 text-gray-800">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "product_category",
      header: () => <div className="font-bold px-4 py-3 text-gray-800">Category</div>,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.product_category?.name || "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="font-bold px-4 py-3 text-gray-800">Status</div>,
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={() => handleStatusToggle(row.original)}
        />
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-end font-bold px-4 py-3 text-gray-800">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row.original)} className={"cursor-pointer"}>
            <Edit className="size-5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive cursor-pointer"
              >
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Type</AlertDialogTitle>
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
      <span>Add New</span>
    </Button>
  );

  return (
    <>
      <DataTable
        data={data?.docs || []}
        columns={columns}
        loading={loading}
        title="Product Types"
        description="Manage your product types"
        icon={LayoutDashboard}
        searchConfig={{
          placeholder: "Search by type name...",
          fields: ["name"],
          serverSide: true,
        }}
        filterConfig={[
          {
            key: 'product_category',
            field: 'product_category._id',
            type: 'select',
            label: 'Categories',
            placeholder: 'Filter by category',
            options: categories.map(cat => ({
              value: cat._id,
              label: cat.name
            })),
          },
        ]}
        paginationConfig={{
          serverSide: true,
          itemsPerPage: 10,
          totalItems: data?.totalDocs || 0,
        }}
        onDataChange={handleDataChange}
        emptyMessage="No product types found"
        noResultsMessage="No matching product types"
        actionButton={actionButton}
      />

      {/* Add/Edit Type Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Type" : "Add New Type"}</DialogTitle>
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
                    <FormLabel>Type Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter type name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEdit && <FormField
                control={form.control}
                name="product_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />}

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
