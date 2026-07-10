// ** React
import React, { useEffect, useState, useRef } from "react";

// ** Third Party
import { Editor } from "@tiptap/react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

// ** Shadcn ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ** Service
import { UploadService } from "@/services/upload";

// ** Configs
import { BASE_URL } from "@/configs/api";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor | null;
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  onOpenChange,
  editor,
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setCaption("");
      setUrl("");
      setUrlError("");
      setUploading(false);
      setActiveTab("upload");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  if (!editor) return null;

  const handleOpenChange = (newOpen: boolean) => {
    if (uploading) return;
    onOpenChange(newOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh hợp lệ.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Kích thước hình ảnh vượt quá giới hạn 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn một tệp hình ảnh để tải lên.");
      return;
    }

    try {
      setUploading(true);
      const res = await UploadService.single(file, caption);
      
      if (res && res.data && res.data.url) {
        let imageUrl = res.data.url;
        // Prefix VITE_API_URL if response url is relative
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
          imageUrl = `${BASE_URL}/${imageUrl.replace(/^\//, "")}`;
        }

        editor
          .chain()
          .focus()
          .setImage({ src: imageUrl, alt: caption, title: caption || undefined })
          .run();
        
        handleOpenChange(false);
      } else {
        throw new Error(res?.message || "Tải ảnh lên thất bại.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Tải ảnh lên thất bại. Vui lòng thử lại.";
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setUrlError("Địa chỉ URL hình ảnh không hợp lệ (phải bắt đầu bằng http:// hoặc https://)");
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({ src: trimmedUrl, alt: caption || "", title: caption || undefined })
      .run();

    handleOpenChange(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (urlError && /^https?:\/\//i.test(value.trim())) {
      setUrlError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={!uploading}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.commands.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Chèn hình ảnh</DialogTitle>
        </DialogHeader>

        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Đang tải ảnh lên...
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={uploading ? undefined : setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={uploading}>Tải tệp lên</TabsTrigger>
            <TabsTrigger value="url" disabled={uploading}>Địa chỉ URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="image-file">Chọn hình ảnh (Tối đa 5MB)</Label>
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="image-caption-upload">Chú thích / Alt text</Label>
                <Input
                  id="image-caption-upload"
                  type="text"
                  placeholder="Nhập chú thích cho ảnh..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={uploading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={uploading || !file}>
                  Tải lên & Chèn
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="image-url">Đường dẫn hình ảnh</Label>
                <Input
                  id="image-url"
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={url}
                  onChange={handleUrlChange}
                  aria-invalid={!!urlError}
                  className={urlError ? "border-destructive focus-visible:ring-destructive/50" : ""}
                  disabled={uploading}
                />
                {urlError && (
                  <p className="text-xs text-destructive mt-1">{urlError}</p>
                )}
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="image-caption-url">Chú thích / Alt text</Label>
                <Input
                  id="image-caption-url"
                  type="text"
                  placeholder="Nhập chú thích cho ảnh..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={uploading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={uploading || !url}>
                  Chèn hình ảnh
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
