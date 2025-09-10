"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Trash2, GaugeCircle } from "lucide-react";



import { useFetch } from "@/app/helper/hooks";
import { handleApiRequest } from "@/app/helper/formfunction";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { createProductSpeedRatings, deleteProductSpeedRatings, fetchProductCategories, fetchProductSpeedRatings, updateProductSpeedRatings } from "@/app/helper/backend";

// Schema
const speedRatingSchema = z.object({
  name: z.string().min(1, "Speed rating is required"),
  product_category: z.string().min(1, "Category is required"),
});

export default function ProductSpeedRatingsPage() {
  const [data, getData, { loading }] = useFetch(fetchProductSpeedRatings);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");


  const form = useForm({
    resolver: zodResolver(speedRatingSchema),
    defaultValues: {
      name: "",
      product_category: "",
    },
  });

  useEffect(() => {
    fetchProductCategories().then((res) => {
      setCategories(res?.data?.docs || []);
    });

  }, []);

  const handleDataChange = ({ page, search }) => {
    getData({ page, search, product_category: filterCategory || undefined });
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
      name:values.name,
      ...(isEdit && { _id: editId }),
    };

    if (!isEdit) {
      payload.product_category = values.product_category;
    }

    await handleApiRequest({
      apiFunc: isEdit ? updateProductSpeedRatings : createProductSpeedRatings,
      payload,
      setLoading: setBtnLoading,
      setModal: setModalOpen,
      onSuccess: () => {
        form.reset();
        setIsEdit(false);
        setEditId(null);
        getData();
      },
    });
  };

  const handleDelete = async (item) => {
    await handleApiRequest({
      apiFunc: deleteProductSpeedRatings,
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
      apiFunc: updateProductSpeedRatings,
      payload,
      onSuccess: getData,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Speed Rating",
      cell: ({ row }) => <span className="text-gray-800">{row.original.name}</span>,
    },
    {
      accessorKey: "product_category.name",
      header: "Category",
      cell: ({ row }) => row.original.product_category?.name || "-",
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
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Speed Rating</AlertDialogTitle>
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
      <GaugeCircle className="size-5" />
      <span>Add Speed Rating</span>
    </Button>
  );

  return (
    <>
      <DataTable
        data={data?.docs || []}
        columns={columns}
        loading={loading}
        title="Product Speed Ratings"
        description="Manage speed ratings for categories"
        icon={GaugeCircle}
        searchConfig={{
          placeholder: "Search by rating...",
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
        emptyMessage="No speed ratings found"
        noResultsMessage="No matching speed ratings"
        actionButton={actionButton}
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Speed Rating" : "Add Speed Rating"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
              {!isEdit && <FormField
                control={form.control}
                name="product_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speed Rating</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., W, H, V, Z" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setModalOpen(false)} disabled={btnLoading} className={'cursor-pointer'}>
                  Cancel
                </Button>
                <Button type="submit" disabled={btnLoading} className={'cursor-pointer'}>
                  {btnLoading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
