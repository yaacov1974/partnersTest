"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { centerAspectCrop, getCroppedImg } from "@/lib/image-utils";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadWithCropProps {
  onImageCropped: (blob: Blob) => void;
  aspectRatio?: number;
  initialImage?: string;
  className?: string;
  circularCrop?: boolean;
}

export function ImageUploadWithCrop({
  onImageCropped,
  aspectRatio = 5 / 1, // Default to 5:1 as requested (500x100)
  initialImage,
  className,
  circularCrop = false,
}: ImageUploadWithCropProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isOpen, setIsOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (initialImage) {
        setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedFile(reader.result?.toString() || "");
        setIsOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current && selectedFile) {
        setIsProcessing(true);
      try {
        const blob = await getCroppedImg(selectedFile, completedCrop);
        if (blob) {
            const preview = URL.createObjectURL(blob);
            setPreviewUrl(preview);
            onImageCropped(blob);
            setIsOpen(false);
            setSelectedFile(null); // Cleanup
        }
      } catch (e) {
        console.error("Failed to crop image", e);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreviewUrl(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    // Notice: We are not notifying parent about removal yet to keep it simple, 
    // but ideally parent should know image is removed. 
    // For now this just clears UI preview until next upload.
  };

  return (
    <>
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div 
            className={cn(
                "relative overflow-hidden bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center group hover:border-indigo-500 transition-colors cursor-pointer",
                circularCrop ? "rounded-full h-32 w-32" : "rounded-md h-[100px] w-full max-w-[500px]",
                previewUrl && "border-solid border-indigo-500"
            )}
            style={!circularCrop ? { aspectRatio: `${aspectRatio}` } : undefined}
            onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          ) : (
             <div className="flex flex-col items-center text-zinc-500">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-xs">Upload</span>
             </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-white">
             {previewUrl ? "Change" : "Upload"}
          </div>
          
          <input
             ref={fileInputRef}
             type="file"
             accept="image/*"
             className="hidden"
             onChange={onSelectFile}
          />
        </div>
        {previewUrl && (
             <Button variant="ghost" size="sm" onClick={clearSelection} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 text-xs">
                <X className="w-4 h-4 mr-1" /> Remove
             </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Drag to adjust the crop area.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-4 bg-black/50 rounded-lg max-h-[60vh] overflow-auto">
             {selectedFile && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    circularCrop={circularCrop}
                    className="max-w-full"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        ref={imgRef}
                        alt="Crop me"
                        src={selectedFile}
                        onLoad={onImageLoad}
                        className="max-w-full object-contain"
                    />
                </ReactCrop>
             )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                Cancel
            </Button>
            <Button onClick={handleCropComplete} disabled={!completedCrop || isProcessing} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
