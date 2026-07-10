// ** React
import React, { useEffect } from "react";

// ** Third Party
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

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
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-3 text-sm",
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
