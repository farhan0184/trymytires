"use client";

import React, { useEffect, useState } from "react";
import { Edit, LayoutDashboard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import DataTable from "@/components/commons/data-table/dataTable";
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

import { useFetch } from "@/app/helper/hooks";
import {
  deleteProduct,
  fetchAdminProducts,
  fetchProductBrands,
  fetchProductCategories,
  fetchProductTypes,
  updateProduct,
} from "@/app/helper/backend";
import { handleApiRequest } from "@/app/helper/formfunction";

export default function ProductPage() {
  const [data, getData, { loading }] = useFetch(fetchAdminProducts);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);


  useEffect(() => {

    const loadOptions = async () => {
      const [catRes, brandRes, typeRes] = await Promise.all([
        fetchProductCategories(),
        fetchProductBrands(),
        fetchProductTypes(),
      ]);
      setCategories(catRes?.data?.docs || []);
      setBrands(brandRes?.data?.docs || []);
      setTypes(typeRes?.data?.docs || []);
    };

    loadOptions();
  }, []);

  const handleDataChange = ({ search, page, filters, limit }) => {
    const params = {
      page,
      limit: limit || 10,
    };


    if (filters.category && filters.category !== "all") {
      params.category = filters.category;

    }
    if (filters.brand && filters.brand !== "all") {
      params.brand = filters.brand;

    }
    if (filters.type && filters.type !== "all") {
      params.type = filters.type;

    }

    if (search && search.trim()) {
      params.search = search.trim();
    }


    getData(params);

  };

  const handleDelete = async (item) => {
    await handleApiRequest({
      apiFunc: deleteProduct,
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
      apiFunc: updateProduct,
      payload,
      onSuccess: getData,
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => <div className="subtitleText font-bold px-4 py-3">Product Name</div>,
      cell: ({ row }) => <div className="subtitleText px-4 py-3">{row.original.name}</div>,
    },
    {
      accessorKey: "category",
      header: () => <div className="subtitleText font-bold px-4 py-3">Category</div>,
      cell: ({ row }) => (
        <div className="subtitleText px-4 py-3">{row.original.category?.name || "—"}</div>
      ),
    },
    {
      accessorKey: "brand",
      header: () => <div className="subtitleText font-bold px-4 py-3">Brand</div>,
      cell: ({ row }) => (
        <div className="subtitleText px-4 py-3">{row.original.brand?.name || "—"}</div>
      ),
    },
    // {
    //   accessorKey: "type",
    //   header: () => <div className="subtitleText font-bold px-4 py-3">Type</div>,
    //   cell: ({ row }) => (
    //     <div className="subtitleText px-4 py-3">{row.original.type?.name || "—"}</div>
    //   ),
    // },
    {
      accessorKey: "price",
      header: () => <div className="subtitleText font-bold px-4 py-3">Price</div>,
      cell: ({ row }) => <div className="subtitleText px-4 py-3">${row.original.price}</div>,
    },
    // {
    //   accessorKey: "stock",
    //   header: () => <div className="subtitleText font-bold px-4 py-3">Stock</div>,
    //   cell: ({ row }) => <div className="subtitleText px-4 py-3">{row.original.stock}</div>,
    // },
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { window.location.href = `/admin/product_section/add_product/${row.original._id}` }}
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <Edit className="size-5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive cursor-pointer hover:text-destructive"
              >
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{row.original.name}
                  &quot;?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={'cursor-pointer'}>Cancel</AlertDialogCancel>
                <AlertDialogAction className={'cursor-pointer'}  onClick={() => handleDelete(row.original)}>
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
    <Button onClick={() => window.location.href = "/admin/product_section/add_product"} className="h-12 flex items-center space-x-2 cursor-pointer">
      <Plus className="size-5" />
      <span>Add New</span>
    </Button>
  );

  return (
    <DataTable
      data={data?.docs || []}
      columns={columns}
      loading={loading}
      title="Products"
      description="Manage your products"
      icon={LayoutDashboard}
      searchConfig={{
        placeholder: "Search products by name...",
        fields: ["name"],
        serverSide: true,
      }}
      actionButton={actionButton}
      filterConfig={[
        {
          key: "category",
          field: "category._id",
          type: "select",
          label: "Category",
          placeholder: "Filter by category",
          options: categories.map((cat) => ({
            value: cat._id,
            label: cat.name,
          })),
        },
        {
          key: "brand",
          field: "brand._id",
          type: "select",
          label: "Brand",
          placeholder: "Filter by brand",
          options: brands.map((b) => ({
            value: b._id,
            label: b.name,
            category: b.product_category?._id, // store category to filter on
          })),
          dependsOn: "category",
          filterOptionsFn: (filters, options) => {
            if (!filters.category || filters.category === "all") return [];
            return options.filter(
              (b) => b.category === filters.category
            );
          },
        },
        {
          key: "type",
          field: "type._id",
          type: "select",
          label: "Type",
          placeholder: "Filter by type",
          options: types.map((t) => ({
            value: t._id,
            label: t.name,
            category: t.product_category?._id,
          })),
          dependsOn: "category",
          filterOptionsFn: (filters, options) => {
            if (!filters.category || filters.category === "all") return [];
            return options.filter(
              (t) => t.category === filters.category
            );
          },
        },
      ]}
      paginationConfig={{
        serverSide: true,
        itemsPerPage: 10,
        totalItems: data?.totalDocs || 0
      }}
      onDataChange={handleDataChange}
      emptyMessage="No  found"
      noResultsMessage="No  found matching your search"
    />
  );
}
