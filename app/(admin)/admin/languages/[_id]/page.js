"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useI18n } from "@/app/provider/i18nProvider";
import { performAction, useFetch } from "@/app/helper/hooks";
import {
  fetchLanguages,
  fetchPublicLanguages,
  updateLanguage,
} from "@/app/helper/backend";
import { useSite } from "@/app/context/site";
import { uniqueKeys } from "@/app/helper/data";

const Translations = () => {
  const i18n = useI18n();
  const [btnLoading, setBtnLoading] = useState(false);
  const [translations, getTranslations] = useFetch(
    fetchPublicLanguages,
    {},
    false
  );
  const [data, getData] = useFetch(fetchLanguages, {}, false);
  const navigate = useRouter();
  const { _id } = useParams();
  const { sitedata } = useSite();

  // ✅ Initialize default values to avoid uncontrolled -> controlled warning
  const defaultValues = Object.fromEntries(uniqueKeys.map((k) => [k.name, ""]));

  const formMethods = useForm({
    defaultValues,
  });

  // Load language + translations
  useEffect(() => {
    if (_id) {
      getData({ _id });
      getTranslations({ _id });
    }
  }, [_id]);

  // Set form values when translations load
  useEffect(() => {
    if (translations?.translations) {
      const values = {};
      Object.keys(translations.translations).forEach((key) => {
        values[key] = translations.translations[key] || "";
      });
      formMethods.reset(values);
    }
  }, [translations]);

  const handleSubmit = async (values) => {

    const payload = {
      _id,
      translations: values,
    };
    setBtnLoading(true);
    try {
      await performAction(updateLanguage, payload, getData);
      toast.success(i18n?.t("Updated successfully"));
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <Button
          variant="secondary"
          onClick={() => navigate.push("/admin/languages")}
        >
          {i18n?.t("Back")}
        </Button>
      </div>

      <Card className="p-6">
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <table className="w-full border">
              <thead className="bg-slate-300">
                <tr>
                  <th className="px-4 py-2 text-start">{i18n?.t("English")}</th>
                  <th className="px-4 py-2">{translations?.name}</th>
                </tr>
              </thead>
              <tbody>
                {uniqueKeys?.map((key, index) => (
                  <tr key={index} className="border-t">
                    <th className="bg-white px-4 py-2 text-start">
                      {key?.name}
                    </th>
                    <td className="px-4 py-2 w-1/3">
                      <FormField
                        control={formMethods.control}
                        name={key.name}
                        render={({ field }) => (
                          <FormItem className="mb-0">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={key.name}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Button type="submit" disabled={btnLoading}>
              {btnLoading ? i18n?.t("Saving...") : i18n?.t("Submit")}
            </Button>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default Translations;
