// ** React
import React, { useState } from "react";

// ** Third Party
import { Editor } from "@tiptap/react";

// ** Shadcn ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor | null;
}

export const LinkDialog: React.FC<LinkDialogProps> = ({
  open,
  onOpenChange,
  editor,
}) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && editor) {
      const isLink = editor.isActive("link");
      setIsEditing(isLink);

      const initialUrl = isLink ? (editor.getAttributes("link").href || "") : "";
      const { from, to } = editor.state.selection;
      let initialText = editor.state.doc.textBetween(from, to) || "";

      // Fallback for collapsed selection inside an existing link
      if (isLink && !initialText) {
        const { state } = editor;
        const { selection } = state;
        const $pos = selection.$from;
        const markType = state.schema.marks.link;
        const mark = $pos.marks().find(m => m.type === markType);
        if (mark) {
          let start = $pos.pos;
          let end = $pos.pos;
          while (start > 0 && markType.isInSet(state.doc.resolve(start - 1).marks())) {
            start--;
          }
          while (end < state.doc.nodeSize && markType.isInSet(state.doc.resolve(end).marks())) {
            end++;
          }
          initialText = state.doc.textBetween(start, end) || "";
        }
      }

      setUrl(initialUrl);
      setText(initialText);
      setUrlError("");
    }
  }

  if (!editor) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    if (urlError && /^https?:\/\//i.test(value.trim())) {
      setUrlError("");
    }
  };

  const handleUnlink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setUrlError("Địa chỉ URL không hợp lệ");
      return;
    }

    const displayText = text.trim() || trimmedUrl;

    if (isEditing) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .insertContent({
          type: "text",
          text: displayText,
          marks: [{ type: "link", attrs: { href: trimmedUrl } }],
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: displayText,
          marks: [{ type: "link", attrs: { href: trimmedUrl } }],
        })
        .run();
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.commands.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa liên kết" : "Chèn liên kết"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="link-url">Địa chỉ URL</Label>
            <Input
              id="link-url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              aria-invalid={!!urlError}
              className={urlError ? "border-destructive focus-visible:ring-destructive/50" : ""}
            />
            {urlError && (
              <p className="text-xs text-destructive mt-1">{urlError}</p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="link-text">Văn bản hiển thị</Label>
            <Input
              id="link-text"
              type="text"
              placeholder="Nhập văn bản hiển thị..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleUnlink}
                >
                  Gỡ liên kết
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
