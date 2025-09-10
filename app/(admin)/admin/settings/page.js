"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MultipleImageInput from "@/components/commons/multipleImageInput";
import toast from "react-hot-toast";
import { fetchAdminSettings, updateAdminSettings } from "@/app/helper/backend";
import SettingsSkeleton from "@/components/loading/settingSkeleton";
import PaymentSettings from "@/components/admin/settings/paymentSetting";
import HomeSetting from "@/components/admin/settings/homeSetting";
import { Plus, Trash } from "lucide-react";

export default function Setting() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});



  useEffect(() => {
    fetchAdminSettings().then((data) => {
      setSettings(data.data || {});
      setLoading(false);
    });
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedChange = (parent, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };




  if (loading) return <SettingsSkeleton />;

  const normalizeFile = (file) => {
    if (!file) return null;
    if (typeof file === "string") return { url: file };
    return file;
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 h-11">
          <TabsTrigger value="general" className={"subtitleText h-10"}>
            General
          </TabsTrigger>
          <TabsTrigger value="payment" className={"subtitleText h-10"}>
            Payment
          </TabsTrigger>
          <TabsTrigger value="email" className={"subtitleText h-10"}>
            Email
          </TabsTrigger>
          <TabsTrigger value="other" className={"subtitleText h-10"}>
            Other
          </TabsTrigger>
        </TabsList>

        {/* GENERAL SETTINGS */}
        <TabsContent value="general">
          <HomeSetting settings={settings} handleChange={handleChange} />
        </TabsContent>

        {/* PAYMENT SETTINGS */}
        <TabsContent value="payment">
          <h2 className="font-bold mb-4 subtitleText">Payment Settings</h2>
          <PaymentSettings settings={settings} />
        </TabsContent>

        {/* EMAIL SETTINGS */}
        <TabsContent value="email">
          <h2 className="font-bold mb-4 subtitleText">Email Settings</h2>
          <div className="space-y-4">
            <Select
              value={settings.email_config?.default || "gmail"}
              onValueChange={(val) =>
                handleNestedChange("email_config", "default", val)
              }
            >
              <SelectTrigger className={"subtitleText !h-10"}>
                <SelectValue
                  placeholder="Select Email Provider"
                  className={""}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail" className={"subtitleText"}>
                  Gmail
                </SelectItem>
                <SelectItem value="sendgrid" className={"subtitleText"}>
                  Send Grid
                </SelectItem>
              </SelectContent>
            </Select>

            <label className={"subtitleText font-bold"}>Gmail</label>
            <Input
              placeholder="Auth Email"
              className={"subtitleText !h-10"}
              value={settings.email_config?.gmail?.auth_email || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "gmail", {
                  ...settings.email_config.gmail,
                  auth_email: e.target.value,
                })
              }
            />

            <Input
              placeholder="App Password"
              className={"subtitleText !h-10"}
              // type="password"
              value={settings.email_config?.gmail?.password || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "gmail", {
                  ...settings.email_config.gmail,
                  password: e.target.value,
                })
              }
            />

            <label className={"subtitleText font-bold mt-10"}>Send Grid</label>
            <Input
              placeholder="Host"
              className={"subtitleText !h-10"}
              value={settings.email_config?.sendgrid?.host || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "sendgrid", {
                  ...settings.email_config.sendgrid,
                  host: e.target.value,
                })
              }
            />
            <Input
              placeholder="Port"
              className={"subtitleText !h-10"}
              type={"number"}
              value={settings.email_config?.sendgrid?.port || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "sendgrid", {
                  ...settings.email_config.sendgrid,
                  port: parseInt(e.target.value),
                })
              }
            />
            <Input
              placeholder="Username"
              className={"subtitleText !h-10"}
              value={settings.email_config?.sendgrid?.username || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "sendgrid", {
                  ...settings.email_config.sendgrid,
                  username: e.target.value,
                })
              }
            />
            <Input
              placeholder="Sender Email"
              className={"subtitleText !h-10"}
              value={settings.email_config?.sendgrid?.sender_email || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "sendgrid", {
                  ...settings.email_config.sendgrid,
                  sender_email: e.target.value,
                })
              }
            />
            <Input
              placeholder="Password"
              className={"subtitleText !h-10"}
              value={settings.email_config?.sendgrid?.password || ""}
              onChange={(e) =>
                handleNestedChange("email_config", "sendgrid", {
                  ...settings.email_config.sendgrid,
                  password: e.target.value,
                })
              }
            />
            <Button
              className="mt-4 subtitleText h-10"
              onClick={async () => {
                const res = await updateAdminSettings(settings);

                if (res.success) {
                  toast.success(res.message || "Payment settings updated!");
                } else {
                  toast.error(
                    res.errorMessage || "Failed to update payment settings"
                  );
                }
              }}
            >
              Save Email
            </Button>
          </div>
        </TabsContent>

        {/* OTHER SETTINGS: Social, Shop, Partners */}
        <TabsContent value="other">
          <h2 className="font-bold mb-4 subtitleText">Other Settings</h2>
          <div className="space-y-4">
            {/* Partners */}
            <div>
              <h3 className="font-semibold mb-2 subtitleText">Partners</h3>
              {settings.partner?.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    value={p}
                    className={"subtitleText h-10"}
                    onChange={(e) => {
                      const updated = [...settings.partner];
                      updated[idx] = e.target.value;
                      handleChange("partner", updated);
                    }}
                  />
                  <Button
                    className={"cursor-pointer  h-10"}
                    variant="destructive"
                    onClick={() => {
                      handleChange(
                        "partner",
                        settings.partner.filter((_, i) => i !== idx)
                      );
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                className={"cursor-pointer"}
                onClick={() =>
                  handleChange("partner", [...(settings.partner || []), ""])
                }
              >
                <Plus />
              </Button>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="font-semibold mb-2 subtitleText">
                Social Media Links
              </h3>
              {settings.social_media_link?.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Name"
                    className={"subtitleText h-10"}
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...settings.social_media_link];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      handleChange("social_media_link", updated);
                    }}
                  />
                  <Input
                    placeholder="Link"
                    className={"subtitleText h-10"}
                    value={item.link}
                    onChange={(e) => {
                      const updated = [...settings.social_media_link];
                      updated[idx] = { ...updated[idx], link: e.target.value };
                      handleChange("social_media_link", updated);
                    }}
                  />
                  <Button
                    variant="destructive"
                    className={"cursor-pointer  h-10"}
                    onClick={() => {
                      handleChange(
                        "social_media_link",
                        settings.social_media_link.filter((_, i) => i !== idx)
                      );
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
              <Button
                className={"cursor-pointer  h-10"}
                onClick={() =>
                  handleChange("social_media_link", [
                    ...(settings.social_media_link || []),
                    { name: "", link: "" },
                  ])
                }
              >
                <Plus />
              </Button>
            </div>

            {/* Submit */}
            <Button
              className="mt-4 subtitleText h-10 cursor-pointer"
              onClick={async () => {
                const res = await updateAdminSettings(settings);

                if (res.success) {
                  toast.success(res.message || "Payment settings updated!");
                } else {
                  toast.error(
                    res.errorMessage || "Failed to update payment settings"
                  );
                }
              }}
            >
              Save Other
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
