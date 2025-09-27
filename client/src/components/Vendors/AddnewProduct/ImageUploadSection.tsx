"use client";

import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { cn } from "@/lib/utils";

function ImageUploadSection({
  images,
  onImagesChange,
}: {
  images: File[];
  onImagesChange: (images: File[]) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        return isValidType && isValidSize;
      });

      if (validFiles.length !== newFiles.length) {
        toast.error(
          "Some files were skipped. Only images under 5MB are allowed."
        );
      }

      onImagesChange([...images, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Product Images
        </CardTitle>
        <CardDescription>
          Add up to 8 high-quality images of your product. The first image will
          be the main image.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={images.length >= 8}
          />
          <label
            htmlFor="image-upload"
            className={cn(
              "cursor-pointer flex flex-col items-center gap-2",
              images.length >= 8 && "cursor-not-allowed opacity-50"
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">Click to upload images</p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 5MB each (max 8 images)
              </p>
            </div>
          </label>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${image.size}-${index}`}
                className="relative group"
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ImageUploadSection;
