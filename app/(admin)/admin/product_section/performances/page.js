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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    fetchProductCategories,
    fetchProductPerformances,
    createProductPerformances,
    updateProductPerformances,
    deleteProductPerformances,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { handleApiRequest } from "@/app/helper/formfunction";

const schemas = z.object({
    name: z.string().min(1, "Name is required"),
    product_category: z.string().min(1, "Category is required"),
});

export default function ProductPerformancePage() {
    const [data, getData, { loading }] = useFetch(fetchProductPerformances);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(schemas),
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

    const handleDataChange = ({ search, page, filters }) => {
        getData({ page, search, filters });
    };

    const openAddModal = () => {
        form.reset({ name: "", product_category: "" });
        setEditId(null);
        setIsEdit(false);
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
            payload.product_category = values.product_category || "";
        }
        await handleApiRequest({
            apiFunc: isEdit ? updateProductPerformances : createProductPerformances,
            payload,
            setLoading: setBtnLoading,
            setModal: setModalOpen,
            onSuccess: () => {
                form.reset({ name: "", product_category: "" });
                setEditId(null);
                setIsEdit(false);
                getData();
            },
        });
    };

    const handleDelete = async (item) => {
        await handleApiRequest({
            apiFunc: deleteProductPerformances,
            payload: item._id,
            onSuccess: getData,
        });
    };

    const handleStatusToggle = async (item) => {
        const updated = {
            _id: item._id,
            status: !item.status,
        };

        await handleApiRequest({
            apiFunc: updateProductPerformances,
            payload: updated,
            onSuccess: getData,
        });
    };

    const columns = [
        {
            accessorKey: "name",
            header: () => (
                <div className="subtitleText font-bold px-4 py-3 text-gray-800">
                    Performance
                </div>
            ),
            cell: ({ row }) => (
                <span className="subtitleText px-4 py-3 text-gray-800">
                    {row.original.name}
                </span>
            ),
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
                        className="h-8 w-8 p-0"
                    >
                        <Edit className="size-5" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="size-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Performance</AlertDialogTitle>
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
                title="Product Performance"
                description="Manage product performance categories"
                icon={LayoutDashboard}
                searchConfig={{
                    placeholder: "Search by name...",
                    fields: ["name"],
                    serverSide: true,
                }}
                filterConfig={[
                    {
                        key: "product_category",
                        field: "product_category._id",
                        type: "select",
                        label: "Categories",
                        placeholder: "Filter by category",
                        options: categories.map((cat) => ({
                            value: cat._id,
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
                emptyMessage="No performance entries found"
                noResultsMessage="No matching performance entries"
                actionButton={actionButton}
            />

            {/* Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Performance" : "Add New Performance"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                            {!isEdit && (
                                <FormField
                                    control={form.control}
                                    name="product_category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
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
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter performance name" {...field} />
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
                                <Button type="submit" disabled={btnLoading} className={
                                 'cursor-pointer'
                                }>
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
