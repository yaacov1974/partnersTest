"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCroppedImg } from "@/lib/image-utils";
import { Loader2, Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface ImageUploadWithCropProps {
  onImageCropped: (blob: Blob) => void;
  aspectRatio?: number;
  initialImage?: string;
  className?: string;
  circularCrop?: boolean;
}

export function ImageUploadWithCrop({
  onImageCropped,
  aspectRatio = 5 / 1,
  initialImage,
  className,
  circularCrop = false,
}: ImageUploadWithCropProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<Area | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
      setCrop({ x: 0, y: 0 }); // Reset crop
      setZoom(1); // Reset zoom
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedFile(reader.result?.toString() || "");
        setIsOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCompletedCrop(croppedAreaPixels);
  }, []);

  const handleCropComplete = async () => {
    if (completedCrop && selectedFile) {
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
              Drag to adjust position and scroll to zoom.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative h-[400px] w-full bg-black/50 rounded-lg overflow-hidden">
             {selectedFile && (
                <Cropper
                    image={selectedFile}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    cropShape={circularCrop ? 'round' : 'rect'}
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
             )}
          </div>
          
          <div className="flex items-center gap-2 px-2">
             <ZoomOut className="h-4 w-4 text-zinc-400" />
             <Slider 
                value={[zoom]} 
                min={1} 
                max={3} 
                step={0.1} 
                onValueChange={(vals) => setZoom(vals[0])}
                className="flex-1"
             />
             <ZoomIn className="h-4 w-4 text-zinc-400" />
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
