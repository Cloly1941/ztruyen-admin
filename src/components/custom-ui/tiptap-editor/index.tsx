// ** React
import React, { useEffect } from "react";

// ** Third Party
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder";

// ** Lib
import { cn } from "@/lib/utils";

export interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Extend Paragraph to parse and render class attributes
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

// Extend Heading to parse and render class attributes
const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Bắt đầu viết...",
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      CustomParagraph,
      CustomHeading,
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
        "w-full rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring transition-colors",
        disabled && "opacity-50 cursor-not-allowed bg-muted"
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
