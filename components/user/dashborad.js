"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone, User, Edit3, Save, X } from "lucide-react"
import { useUser } from "@/app/context/user"
import { postSingleImage, updateUser } from "@/app/helper/backend"
import toast from "react-hot-toast"
import CustomForm from "../commons/CustomForm"
import { UserDashboardSkeleton } from "../skeletons/skeletons"
import MultipleImageInput from "../commons/multipleImageInput"
import imageCompression from 'browser-image-compression';


export default function UserDashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, userLoading, getUser } = useUser();

  const [formData, setFormData] = useState({})


  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleSave = async () => {
    let imageUrl = formData.image;

    if (imageUrl && typeof imageUrl !== "string" && imageUrl.originFileObj) {
      try {
        let file = imageUrl.originFileObj;

        if (!(file instanceof File)) {
          file = new File([file], file.name || "upload.png", {
            type: file.type || "image/png",
          });
        }

        const options = {
          maxSizeMB: 0.1, // ~100KB
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/png",
        };

        // Compress
        const compressedFile = await imageCompression(file, options);

        // Upload compressed file
        const result = await postSingleImage({ image: compressedFile });

        // ✅ Force imageUrl to be string
        imageUrl =
          typeof result?.data?.image === "string"
            ? result.data.image
            : typeof result === "string"
              ? result
              : "";
      } catch (err) {
        console.error("Image compression error:", err);
        toast.error("Failed to compress image");
      }
    }

    const payload = { ...formData, image: imageUrl }; // ✅ image must be string

    const { success, message, errorMessage } = await updateUser(payload);

    if (success) {
      toast.success(message);
      getUser();
    } else {
      toast.error(errorMessage);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  if (userLoading && Object.keys(user).length === 0) {
    return <UserDashboardSkeleton />
  }

  const fields = [

    {
      name: "old_password",
      title: "Old Password*",
      placeholder: "Enter old password",
      variant: "input",
      type: "password",
      className:
        "textColor subtitleText",
    },
    {
      name: "password",
      title: "Password*",
      placeholder: "Enter password",
      variant: "input",
      type: "password",
      className:
        "textColor subtitleText",
    },
    {
      name: "confirm_password",
      title: "Conform Password*",
      placeholder: "Enter conform password",
      variant: "input",
      type: "password",
      className:
        "textColor subtitleText",
    },
  ];

  return (
    <div className="min-h-screen  py-[64px]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm lg:p-6 p-3">
          <div className="flex items-center lg:space-x-4 space-x-2">
            <Avatar className="lg:h-28 lg:w-28 h-20 w-20">
              <AvatarImage
                src={formData?.image}
                alt={formData?.name}
              />
              <AvatarFallback className="subtitleText">
                {formData?.name
                  ? formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="secondaryText font-semibold textColor">
                {formData?.name}
              </h1>
              <p className="subtitleText textColor">{formData?.email}</p>
            </div>
          </div>
        </div>

        <Card className={"p-7 rounded-md"}>
          <CardHeader className="flex flex-row items-center justify-between textColor p-0">
            <div>
              <CardTitle className={"primaryText font-semibold "}>
                Personal Information
              </CardTitle>
              <CardDescription className={"font-semibold subtitleText"}>
                Manage your personal details and preferences
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className={
                  "subtitleText bg-primary text-white  cursor-pointer !h-10"
                }
              >
                <Edit3 className="lg:!h-7 lg:!w-7 w-5 h-5  mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className={"subtitleText text-white cursor-pointer !h-10"}
                >
                  <Save className="lg:!h-7 lg:!w-7 w-5 h-5 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className={"subtitleText cursor-pointer !h-10"}
                >
                  <X className="lg:!h-7 lg:!w-7 w-5 h-5 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4 mt-5">
            <>
              {!!isEditing && (
                <div className="space-y-2">
                  <MultipleImageInput
                    name="image"
                    label="Upload Image"
                    max={1}
                    required={true}
                    value={
                      formData?.image
                        ? typeof formData.image === "string"
                          ? [{ url: formData.image }]
                          : [formData.image]
                        : []
                    }
                    onChange={(imgs) => setFormData({ ...formData, image: imgs[0] || "" })}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 subtitleText textColor">
                <div className="space-y-2">
                  <Label htmlFor="name" className={"subtitleText"}>
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData?.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{formData?.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={"subtitleText"}>
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData?.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{formData?.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className={"subtitleText"}>
                    Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData?.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{formData?.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className={"subtitleText"}>
                    Country
                  </Label>
                  {isEditing ? (
                    <Input
                      id="country"
                      value={formData?.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData?.country}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className={"subtitleText"}>
                    City
                  </Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={formData?.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData?.city}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className={"subtitleText"}>
                    State
                  </Label>
                  {isEditing ? (
                    <Input
                      id="state"
                      value={formData?.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData?.state}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className={"subtitleText"}>
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData?.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData?.address}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code" className={"subtitleText"}>
                    Zip Code
                  </Label>
                  {isEditing ? (
                    <Input
                      id="zip_code"
                      value={formData?.zip_code}
                      onChange={(e) =>
                        setFormData({ ...formData, zip_code: e.target.value })
                      }
                      className={"subtitleText"}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData?.zip_code}</span>
                    </div>
                  )}
                </div>
              </div>
            </>

            <div className="mt-10">
              <div className="textColor">
                <h2 className={"primaryText font-semibold "}>
                  Password Update
                </h2>
              </div>

              <div className="mt-5">
                <CustomForm
                  formSchema={"update_password"}
                  fields={fields}
                  btnCls={"subtitleText text-white cursor-pointer !h-10 "}
                  btnTitle={"Update Password"}
                  labelCls={"subtitleText textColor"}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
