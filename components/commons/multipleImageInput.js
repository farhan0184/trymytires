'use client';
import React, { useState, useRef } from "react";
import { X, Upload, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { removeFile } from "@/app/helper/backend";
import Image from "next/image";
import { useI18n } from "@/app/provider/i18nProvider";
import toast from "react-hot-toast";

// Utility to normalize a file
const normalizeFile = (file) => {
  if (!file) return null;
  if (typeof file === "string") return { url: file };
  if (file.url) return file;
  return file;
};

// Convert file to base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob || file instanceof File)) {
      reject(new Error("Provided file is not a Blob or File"));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// -------------------- MultipleImageInput --------------------
const MultipleImageInput = (props) => {

  const i18n = useI18n();
  const max = props.max || 1;
  const name = props.name || "img";
  const label = props.label;
  const child = props?.child;
  const required = props?.required;
  const error = props?.error;

  const [files, setFiles] = useState(props.value || []);

  React.useEffect(() => {
    if (props.value && Array.isArray(props.value)) {
      setFiles(props.value);
    }
  }, [props.value]);

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
    if (props.onChange) props.onChange(newFiles);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            required ?
              "textColor after:content-['*'] after:ml-0.5 after:text-red-500": "subtitleText"
          )}
        >
          {i18n.t(label)}
        </Label>
      )}
      <FileUploadInput
        max={max}
        onChange={handleFileChange}
        child={child}
        value={files}
        name={name}
      />
      {error && (
        <p className="text-sm text-red-500">
          {`${i18n?.t("Please upload")} ${
            !!label ? i18n?.t(label) : i18n?.t("an image")
          }`}
        </p>
      )}
    </div>
  );
};

// -------------------- FileUploadInput --------------------
const FileUploadInput = ({ value, onChange, max, child, name }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const i18n = useI18n();

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    const safeFile = normalizeFile(file);
    if (!safeFile) return;
    if (!safeFile.url && !safeFile.preview && safeFile.originFileObj) {
      safeFile.preview = await getBase64(safeFile.originFileObj);
    }
    setPreviewImage(safeFile.url || safeFile.preview);
    setPreviewVisible(true);
  };

  const handleFiles = (filesList) => {
    if (typeof onChange !== "function") return;
    const maxSize = 1024 * 1024;

    const newFiles = Array.from(filesList).slice(0, max - (value?.length || 0)).filter((file) => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 1MB size limit`);
        return false;
      }
      return true;
    });
    const fileObjects = newFiles.map((file, index) => ({
      uid: `${Date.now()}-${index}`,
      name: file.name,
      status: "done",
      originFileObj: file,
      preview: null,
    }));

    onChange([...(value || []), ...fileObjects].slice(0, max));
  };

  const handleFileChange = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = async (fileToRemove) => {
    if (typeof onChange !== "function") return;

    const newFileList = (value || []).filter(
      (file) =>
        file.uid ? file.uid !== fileToRemove.uid : normalizeFile(file).url !== normalizeFile(fileToRemove).url
    );

    // Delete file from server if it has a URL
    const safeFile = normalizeFile(fileToRemove);

    if (safeFile?.url) {
      const result = await removeFile({ file: safeFile.url });
      if (result?.success) toast.success("File removed successfully");
    }

    onChange(newFileList);
  };

  const acceptedTypes = "image/png,image/gif,image/jpeg,image/webp";

  const canAddMore = (value?.length || 0) < max;

  return (
    <>
      <div className="flex space-x-3">
        {value && value.length > 0 && (
          <div className="flex gap-2">
            {value.map((file, index) => (
              <FilePreviewCard
                key={index}
                file={file}
                onPreview={() => handlePreview(file)}
                onRemove={() => handleRemove(file)}
              />
            ))}
          </div>
        )}

        {canAddMore && (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-3 w-[130px] text-center cursor-pointer transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
              "hover:bg-gray-50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            <Input
              ref={inputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              multiple={max > 1}
              className="hidden"
              name={name}
              id={name}
            />
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                {child || (
                  <>
                    <span className="font-medium text-primary">+ {i18n?.t("upload")}</span>
                    <p className="text-xs text-gray-500 mt-1">{i18n?.t("Click to upload or drag and drop")}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={previewVisible} onOpenChange={setPreviewVisible}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{i18n?.t("Preview")}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewImage?.endsWith?.(".pdf") ? (
              <embed src={previewImage} type="application/pdf" width="100%" height="600px" className="rounded-lg" />
            ) : (
              <Image priority={true} alt="preview" src={previewImage} className="w-full h-auto rounded-lg" width={500} height={500} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// -------------------- FilePreviewCard --------------------
const FilePreviewCard = ({ file, onPreview, onRemove }) => {
  
  const [imagePreview, setImagePreview] = useState(null);

  React.useEffect(() => {
    const loadPreview = async () => {
      const safeFile = normalizeFile(file);
      if (!safeFile) return;

      if (safeFile.url) {
        setImagePreview(safeFile.url);
      } else if (safeFile.originFileObj) {
        const preview = await getBase64(safeFile.originFileObj);
        setImagePreview(preview);
      }
    };
    loadPreview();
  }, [file]);

  const safeFile = normalizeFile(file);
  const isPdf = safeFile?.url?.endsWith?.(".pdf");

  return (
    <Card className="relative group p-2 w-[130px] shadow-none">
      <CardContent>
        <div className="aspect-square relative overflow-hidden rounded-md bg-gray-100">
          {isPdf ? (
            <div className="flex items-center justify-center h-full">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
          ) : imagePreview ? (
            <Image priority src={imagePreview} alt={file.name || "Uploaded image"} className="w-full h-full object-cover" width={500} height={500} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No image</div>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <Button size="sm" type="button" variant="secondary" onClick={(e) => { e.stopPropagation(); onPreview(); }}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" type="button" variant="destructive" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleImageInput;
