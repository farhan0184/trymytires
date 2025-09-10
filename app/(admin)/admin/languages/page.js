"use client";
import { fetchLanguages } from "@/app/helper/backend";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import Image from "next/image";
import { Eye, LanguagesIcon, Pencil, Trash } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  handleCreateLanguage,
  handleDeleteLanguage,
  handleUpdateLanguage,
} from "@/app/helper/formfunction";
import { useRouter } from "next/navigation";

// Zod schema for validation
const languageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  code: z.string().min(2, "Code is required"),
  flag: z.string().min(2, "Flag is required"),
});

export default function LanguagesPage() {
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [data, getData, { loading }] = useFetch(fetchLanguages);

  const form = useForm({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      name: "",
      code: "",
      flag: "",
    },
  });

  const handleEdit = async (lang) => {
    setEditId(lang._id);
    form.reset({
      name: lang.name || "",
      code: lang.code || "",
      flag: lang.flag || "",
    });
    setOpen(true);
  };

  const onSubmit = async (values) => {
    values.rtl = false; // Default value for RTL
    try {
      if (editId) {
        await handleUpdateLanguage(
          { ...values, _id: editId },
          setBtnLoading,
          setOpen
        );
      } else {
        await handleCreateLanguage(values, setBtnLoading, setOpen);
      }
      getData();
    } catch (error) {

    }
    setOpen(false);
    setEditId(null);
    form.reset();
  };

  const handleDelete = async (lang) => {
    setDeleteLoading(true);
    try {
      await handleDeleteLanguage(lang._id);
      getData();
    } catch (error) {
      
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="md:text-2xl font-bold primaryText">Languages</h1>
        <Button
          onClick={() => setOpen(true)}
          className="btnGradient cursor-pointer subtitleText text-white h-12"
        >
          + New Language
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-[600px] w-full border bg-white">
          <thead>
            <tr className="bg-gray-100 subtitleText">
              <th className="px-2 md:px-4 py-3 text-left">Name</th>
              <th className="px-2 md:px-4 py-3 text-left">Code</th>
              <th className="px-2 md:px-4 py-3 text-left">Flag</th>
              <th className="px-2 md:px-4 py-3 text-left">RTL</th>
              <th className="px-2 md:px-4 py-3 text-left">Active</th>
              <th className="px-2 md:px-4 py-3 text-left">Default</th>
              <th className="px-2 md:px-4 py-3 text-left w-24 max-w-[96px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="subtitleText">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((lang) => (
                <tr key={lang.code} className="border-t">
                  <td className="px-2 md:px-4 py-3">{lang.name}</td>
                  <td className="px-2 md:px-4 py-3">{lang.code}</td>
                  <td className="px-2 md:px-4 py-3">
                    {lang.flag ? (
                      <Image
                        src={`https://flagcdn.com/${lang.flag}.svg`}
                        alt={lang.code}
                        className="w-8 h-5 object-cover rounded"
                        width={32}
                        height={20}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <Switch checked={!!lang.rtl} disabled />
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <Switch checked={!!lang.active} disabled />
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <Switch checked={!!lang.default} disabled />
                  </td>
                  <td className="px-2 md:px-4 py-3 flex gap-2 items-center">
                    <LanguagesIcon className="size-5 text-primary cursor-pointer" onClick={() => router.push(`/admin/languages/${lang._id}`)} />
                    <Pencil
                      className="size-5 text-green-600 cursor-pointer"
                      title="Edit"
                      onClick={() => handleEdit(lang)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash
                          className="size-5 text-red-600 cursor-pointer"
                          title="Delete"
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Language</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{lang.name}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(lang)}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {deleteLoading ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No languages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding new language */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Language" : "Add New Language"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Language Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Language Code (e.g. en, fr)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flag</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country Code (e.g. us, fr)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                  className={"subtitleText"}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={"subtitleText btnGradient"}
                  disabled={btnLoading}
                >
                  {btnLoading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}