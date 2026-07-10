// ** React
import React, { useEffect } from "react";

// ** Third Party
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import toast from "react-hot-toast";

// ** Component
import TiptapToolbar from "./TiptapToolbar";

// ** Extension
import { CustomParagraph, CustomHeading, CustomTextAlign } from "./custom-extensions";

// ** Lib
import { cn } from "@/lib/utils";

export interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Bắt đầu viết...",
  disabled = false,
}) => {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      CustomParagraph,
      CustomHeading,
      CustomTextAlign.configure({
        types: ["paragraph", "heading"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md shadow-sm max-w-full h-auto",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-3 text-sm",
      },
      handlePaste: (_view, event) => {
        // Check for file-level image paste
        const items = Array.from(event.clipboardData?.items || []);
        const hasBase64ImageFile = items.some(item => item.type.startsWith("image/"));
        
        // Check for copied rich-text HTML containing base64 images
        const pastedHtml = event.clipboardData?.getData("text/html") || "";
        const hasBase64HtmlImage = /src="data:image\/[^"]*"/i.test(pastedHtml);

        if (hasBase64ImageFile || hasBase64HtmlImage) {
          toast.error("Không thể chèn ảnh trực tiếp bằng cách dán. Vui lòng sử dụng công cụ Tải ảnh lên.");
          return true; // Blocks the default paste behavior
        }
        return false;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files);
          const hasImage = files.some(file => file.type.startsWith("image/"));
          if (hasImage) {
            toast.error("Không thể chèn ảnh trực tiếp bằng cách kéo thả. Vui lòng sử dụng công cụ Tải ảnh lên.");
            return true; // Blocks the default drop behavior
          }
        }
        
        // Check for drop items containing HTML with base64 images
        const droppedHtml = event.dataTransfer?.getData("text/html") || "";
        if (/src="data:image\/[^"]*"/i.test(droppedHtml)) {
          toast.error("Không thể chèn ảnh trực tiếp bằng cách kéo thả. Vui lòng sử dụng công cụ Tải ảnh lên.");
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (!editor.isDestroyed) {
          onChange?.(html);
        }
      }, 150);
    },
    onBlur: ({ editor }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      onChange?.(editor.getHTML());
    },
  });

  // Handle disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  // Cursor-safe value synchronization
  useEffect(() => {
    if (!editor) return;

    const currentHTML = editor.getHTML();
    if (value !== undefined && value !== currentHTML && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        "w-full rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring transition-colors flex flex-col",
        disabled && "opacity-50 cursor-not-allowed bg-muted"
      )}
    >
      <TiptapToolbar editor={editor} />
      <div className="min-h-[200px] max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
