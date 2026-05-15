import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_WIDTH = 900;
const MAX_HEIGHT = 1100;
const QUALITY = 0.78;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ images, onChange, maxImages = 4 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError("");

      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`الحد الأقصى ${maxImages} صور لكل منتج`);
        return;
      }

      const toProcess = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      if (toProcess.length === 0) {
        setError("يرجى اختيار ملفات صور صالحة (JPG, PNG, WEBP)");
        return;
      }

      setLoading(true);
      const compressed: string[] = [];
      for (const file of toProcess) {
        const b64 = await compressImage(file);
        compressed.push(b64);
      }
      onChange([...images, ...compressed]);
      setLoading(false);
    },
    [images, maxImages, onChange]
  );

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const canAdd = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, idx) => (
            <div key={idx} className="relative group aspect-[4/5] rounded-sm overflow-hidden bg-obsidian-800 border border-obsidian-700">
              <img
                src={src}
                alt={`صورة ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => removeImage(idx)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 rounded-full bg-red-700 hover:bg-red-600 flex items-center justify-center"
                  type="button"
                  title="حذف الصورة"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute bottom-1 right-1 text-[10px] font-cairo bg-gold-600 text-obsidian-900 px-1.5 py-0.5 rounded-sm font-bold">
                  رئيسية
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {canAdd && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all duration-200",
            dragging
              ? "border-gold-500 bg-gold-500 bg-opacity-5"
              : "border-obsidian-600 hover:border-gold-700 hover:bg-obsidian-800",
            loading && "pointer-events-none opacity-60"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
          />

          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-cairo text-gold-500 text-sm">جاري ضغط الصورة...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                dragging ? "bg-gold-500 bg-opacity-20" : "bg-obsidian-700"
              )}>
                {dragging ? (
                  <ImageIcon size={22} className="text-gold-500" />
                ) : (
                  <Upload size={22} className="text-obsidian-400" />
                )}
              </div>
              <div>
                <p className="font-cairo font-semibold text-[#F5F0E8] text-sm">
                  {dragging ? "أفلت الصورة هنا" : "اختر صورة أو اسحبها هنا"}
                </p>
                <p className="font-cairo text-obsidian-500 text-xs mt-0.5">
                  JPG, PNG, WEBP — يتم ضغطها تلقائياً · {images.length}/{maxImages} صور
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {!canAdd && (
        <p className="text-center font-cairo text-obsidian-500 text-xs">
          وصلت للحد الأقصى ({maxImages} صور). احذف صورة لإضافة أخرى.
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-950 border border-red-800 rounded-sm p-2.5">
          <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
          <p className="text-red-400 font-cairo text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
