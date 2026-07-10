// ** React
import React from "react";

// ** Third Party
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";

// ** Shadcn ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";

// ** Lib
import { cn } from "@/lib/utils";

interface TiptapToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}

const ToolbarButton = ({ active, onClick, children, title, disabled }: ToolbarButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 p-0 rounded-md transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring",
        active && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Button>
  );
};

const TriggerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  }
>(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
TriggerButton.displayName = "TriggerButton";

const HeadingDropdown = ({ editor }: { editor: Editor }) => {
  const getActiveLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Tiêu đề 1";
    if (editor.isActive("heading", { level: 2 })) return "Tiêu đề 2";
    if (editor.isActive("heading", { level: 3 })) return "Tiêu đề 3";
    if (editor.isActive("heading", { level: 4 })) return "Tiêu đề 4";
    return "Văn bản";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TriggerButton
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2 text-xs font-normal border-input bg-background cursor-pointer"
        >
          <span>{getActiveLabel()}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </TriggerButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[120px]">
        <DropdownMenuItem
          className={cn(
            "text-xs justify-between cursor-pointer",
            !editor.isActive("heading") && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Văn bản
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "text-xs justify-between cursor-pointer",
            editor.isActive("heading", { level: 1 }) && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          Tiêu đề 1
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "text-xs justify-between cursor-pointer",
            editor.isActive("heading", { level: 2 }) && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          Tiêu đề 2
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "text-xs justify-between cursor-pointer",
            editor.isActive("heading", { level: 3 }) && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          Tiêu đề 3
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "text-xs justify-between cursor-pointer",
            editor.isActive("heading", { level: 4 }) && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          Tiêu đề 4
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (!editor) return null;

  const runMobileAction = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-10 bg-muted/50 border-b border-input p-1.5 gap-1 flex items-center w-full">
      {/* Fixed items visible on both mobile and desktop */}
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Chữ đậm"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Chữ nghiêng"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-4 bg-border mx-1" />

      <HeadingDropdown editor={editor} />

      {/* Desktop-only items */}
      <div className="hidden lg:flex items-center gap-1">
        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Danh sách dấu chấm"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Danh sách số"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Canh lề trái"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Canh giữa"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Canh lề phải"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          title="Canh đều"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={(e) => {
            e.preventDefault();
            // TODO: Hyperlink dialog triggers in Story 1.3
          }}
          title="Chèn liên kết"
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={(e) => {
            e.preventDefault();
            // TODO: Image upload dialog triggers in Story 1.3
          }}
          title="Chèn hình ảnh"
        >
          <Image className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Mobile/Tablet-only items */}
      <div className="flex lg:hidden items-center gap-1 ml-auto">
        <div className="w-px h-4 bg-border mx-1" />

        <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <TriggerButton
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 p-0 rounded-md transition-colors hover:bg-muted inline-flex items-center justify-center cursor-pointer"
              title="Thêm công cụ"
            >
              <MoreHorizontal className="h-4 w-4" />
            </TriggerButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 flex flex-col gap-1">
            {/* Group Lists */}
            <div className="flex items-center justify-around p-1 border-b border-border">
              <ToolbarButton
                active={editor.isActive("bulletList")}
                onClick={() => runMobileAction(() => editor.chain().focus().toggleBulletList().run())}
                title="Danh sách dấu chấm"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive("orderedList")}
                onClick={() => runMobileAction(() => editor.chain().focus().toggleOrderedList().run())}
                title="Danh sách số"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
            </div>
            {/* Group Alignments */}
            <div className="flex items-center justify-around p-1 border-b border-border">
              <ToolbarButton
                active={editor.isActive({ textAlign: "left" })}
                onClick={() => runMobileAction(() => editor.chain().focus().setTextAlign("left").run())}
                title="Canh lề trái"
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive({ textAlign: "center" })}
                onClick={() => runMobileAction(() => editor.chain().focus().setTextAlign("center").run())}
                title="Canh giữa"
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive({ textAlign: "right" })}
                onClick={() => runMobileAction(() => editor.chain().focus().setTextAlign("right").run())}
                title="Canh lề phải"
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                active={editor.isActive({ textAlign: "justify" })}
                onClick={() => runMobileAction(() => editor.chain().focus().setTextAlign("justify").run())}
                title="Canh đều"
              >
                <AlignJustify className="h-4 w-4" />
              </ToolbarButton>
            </div>
            {/* Group Actions */}
            <div className="flex items-center justify-around p-1">
              <ToolbarButton
                onClick={(e) => {
                  e.preventDefault();
                  runMobileAction(() => {
                    // TODO: Hyperlink dialog triggers in Story 1.3
                  });
                }}
                title="Chèn liên kết"
              >
                <Link className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={(e) => {
                  e.preventDefault();
                  runMobileAction(() => {
                    // TODO: Image upload dialog triggers in Story 1.3
                  });
                }}
                title="Chèn hình ảnh"
              >
                <Image className="h-4 w-4" />
              </ToolbarButton>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TiptapToolbar;
