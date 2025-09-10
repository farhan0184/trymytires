"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Edit, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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

import {
  createProductBrands,
  deleteProductBrands,
  fetchProductBrands,
  fetchProductCategories,
  postSingleImage,
  updateProductBrands,
} from "@/app/helper/backend";
// import {
//   handleCreateBrand,
//   handleDeleteBrand,
//   brandStatusToggle,
// } from "@/app/helper/formfunction";
import { useFetch } from "@/app/helper/hooks";
import MultipleImageInput from "@/components/commons/multipleImageInput";
import { handleApiRequest } from "@/app/helper/formfunction";
import Image from "next/image";
import { handleImageUpload, withTimeout } from "@/app/helper/helper";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  product_category: z.string().min(1, "Category is required"),
  image: z.any().refine((val) => Array.isArray(val) && val.length > 0, {
    message: "Image is required",
  }),
});

export default function BrandsPage() {
  const [data, getData, { loading }] = useFetch(fetchProductBrands);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      product_category: "",
      image: [],
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchProductCategories({ page: 1, limit: 100 });
      setCategories(res?.data?.docs || []);
    };

    loadCategories();
  }, []);

  const handleDataChange = ({ search, filters, page }) => {
    // Construct query parameters properly
    const params = {
      page,
      limit: 10,
    };

   
    if (search && search.trim()) {
      params.search = search.trim();
    }

 

   
    if (filters.product_category && filters.product_category !== "all") {
      params.product_category = filters.product_category; 
      
    }

   
    getData(params);
  };

  const openAddModal = () => {
    form.reset({ name: "", product_category: "", image: [] });
    setEditId(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    form.reset({
      name: brand.name,
      product_category: brand.product_category?._id || "",
      image: brand.image
        ? [
            {
              uid: brand._id,
              name: brand.name,
              url: brand.image,
              status: "done",
            },
          ]
        : [],
    });
    setEditId(brand._id);
    setIsEdit(true);
    setModalOpen(true);
  };

  const onSubmit = async (values) => {


    let imageUrl = values.image;


    imageUrl = await withTimeout(handleImageUpload(imageUrl, true))

    const payload = {
      name: values.name,

      image: imageUrl,
      ...(isEdit && { _id: editId }),
    };
    if (!isEdit) {
      payload.product_category = values.product_category;
    }

    await handleApiRequest({
      apiFunc: isEdit ? updateProductBrands : createProductBrands,
      payload,
      setLoading: setBtnLoading,
      setModal: setModalOpen,
      onSuccess: () => {
        form.reset({ name: "", product_category: "", image: [] });
        setEditId(null);
        setIsEdit(false);
        getData();
      },
    });
  };

  const handleDelete = async (brand) => {
    await handleApiRequest({
      apiFunc: deleteProductBrands,
      payload: brand._id,
      onSuccess: getData,
    });
  };

  const handleStatusToggle = async (brand) => {
    const updated = {
      _id: brand._id,
      status: !brand.status,
    };

    await handleApiRequest({
      apiFunc: updateProductBrands,
      payload: updated,
      onSuccess: getData,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Brand
        </div>
      ),
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Image
              src={brand.image}
              priority={true}
              alt={brand.name}
              className="w-20 h-10  border"
              width={1000}
              height={1000}
            />
            <span className="subtitleText px-4 py-3 text-gray-800">
              {brand.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "product_category",
      header: () => (
        <div className="subtitleText font-bold px-4 py-3 text-gray-800">
          Category
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground subtitleText">
          {row.original.product_category?.name || "—"}
        </span>
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
          className={"cursor-pointer"}
          checked={row.original.status}
          onCheckedChange={() => handleStatusToggle(row.original)}
        />
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
                <Trash2 className="size-5 " />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}
                  &quot;?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={"cursor-pointer"}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className={"cursor-pointer"}
                  onClick={() => handleDelete(row.original)}
                >
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
        title="Product Brands"
        description="Manage your product brands"
        icon={LayoutDashboard}
        searchConfig={{
          placeholder: "Search by brand name...",
          fields: ["name"],
          serverSide: true,
        }}
        filterConfig={[
          {
            key: "product_category",
            field: "product_category._id", // Use the category ID field
            type: "select",
            label: "Categories",
            placeholder: "Filter by category",
            options: categories.map((cat) => ({
              value: cat._id, // Use category ID as value
              label: cat.name,
            })),
          },
        ]}
        paginationConfig={{
          serverSide: true,
          itemsPerPage: 10,
          totalItems: data?.totalDocs || 0,
        }}
        onDataChange={handleDataChange}
        emptyMessage="No brands found"
        noResultsMessage="No matching brands"
        actionButton={actionButton}
      />

      {/* Add/Edit Brand Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Brand" : "Add New Brand"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-2"
              noValidate
            >
              {/* Brand Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Select */}
              <FormField
                control={form.control}
                name="product_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
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
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Logo</FormLabel>
                    <FormControl>
                      <MultipleImageInput
                        value={field.value}
                        onChange={field.onChange}
                        error={form.formState.errors.image}
                        maxFiles={1}
                        accept="image/*"
                      />
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
                    setModalOpen(!modalOpen);
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
