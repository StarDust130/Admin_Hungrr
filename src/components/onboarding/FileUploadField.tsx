import React, { useState, useRef } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "./types";
import { fileToBase64, imagekit } from "@/lib/imagekit";
import Image from "next/image";


//! This function handles the image upload to ImageKit and returns the uploaded image URL.
const handleImageUpload = async (file: File): Promise<string | null> => {
  if (!file) return null;

  try {
    const auth = await fetch("/api/imagekit-auth").then((res) => res.json());
    const base64 = await fileToBase64(file);

    const result = await imagekit.upload({
      file: base64,
      fileName: file.name,
      signature: auth.signature,
      token: auth.token,
      expire: auth.expire,
    });

    return result.url;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};


interface FileUploadFieldProps {
  control: Control<OnboardingData>;
  setValue: UseFormSetValue<OnboardingData>;
  name: "logoUrl" | "bannerUrl";
  label: string;
  description: string;
  setIsFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
  previewStyle?: "square" | "wide";
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  control,
  setValue,
  name,
  label,
  description,
  setIsFileUploading,
  previewStyle = "square",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isWide = previewStyle === "wide";

  const previewContainerClasses = isWide
    ? "relative w-[360px] h-[150px] rounded-lg overflow-hidden"
    : "relative w-[120px] h-[120px] rounded-lg";




  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setIsUploading(true);
      setIsFileUploading(true);
      const url = await handleImageUpload(file);
      setValue(name, url || "", { shouldValidate: true });
      setIsUploading(false);
      setIsFileUploading(false);
    }
  };

  const handleDragEvent = (
    e: React.DragEvent<HTMLDivElement>,
    dragging: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(e, false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file || null);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div
            onDragEnter={(e) => handleDragEvent(e, true)}
            onDragLeave={(e) => handleDragEvent(e, false)}
            onDragOver={(e) => handleDragEvent(e, true)}
            onDrop={handleDrop}
            className={cn(
              "relative flex items-center justify-center overflow-hidden border-2 border-dashed bg-secondary transition-all rounded-lg",
              previewContainerClasses,
              isDragging && "border-primary ring-2 ring-primary/50"
            )}
          >
            {isUploading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : field.value ? (
              <div className="relative w-full h-full">
                <Image
                  src={field.value as string}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="mx-auto w-10 h-10 text-muted-foreground" />
                <p
                  className={`mt-2  font-medium ${
                    isWide ? "text-sm" : "text-[10px]"
                  }`}
                >
                  Click or drag image to upload
                </p>
              </div>
            )}
          </div>

          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="cursor-pointer transition-transform active:scale-[0.98] flex items-center gap-2"
            >
              {isUploading ? "Uploading..." : "📁 Pick an image"}
            </Button>

            <input
              ref={inputRef}
              id={name}
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              accept="image/png, image/jpeg, image/webp"
              disabled={isUploading}
            />

            <FormDescription className="mt-2 text-xs">
              📸 {description}
            </FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
