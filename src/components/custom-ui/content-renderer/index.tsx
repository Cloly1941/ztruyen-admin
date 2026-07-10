// ** React
import type React from "react";

// ** Third Party
import DOMPurify from "dompurify";

// ** Lib
import { cn } from "@/lib/utils";

// ** Utils
import { filterTailwindClasses } from "@/utils/filterTailwindClasses";


export interface ContentRendererProps {
  htmlContent: string;
  className?: string;
}

// Register hook once at module top-level scope to avoid duplicate registrations on render
if (typeof window !== "undefined") {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    // Enforce links target and rel security attributes
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }

    // Block base64-encoded image sources
    if (node.tagName === "IMG" && node.hasAttribute("src")) {
      const src = node.getAttribute("src") || "";
      if (src.startsWith("data:") || src.includes(";base64,")) {
        node.removeAttribute("src");
      }
    }

    // Filter class names with direction/spacing suffix matching
    if (node.hasAttribute("class")) {
      const rawClass = node.getAttribute("class") || "";
      const cleanClass = filterTailwindClasses(rawClass, false);
      if (cleanClass) {
        node.setAttribute("class", cleanClass);
      } else {
        node.removeAttribute("class");
      }
    }
  });
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  htmlContent,
  className,
}) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "span",
      "strong",
      "em",
      "a",
      "img",
      "blockquote",
    ],
    ALLOWED_ATTR: ["class", "href", "target", "rel", "src", "alt"],
    FORBID_TAGS: ["script", "iframe"],
    FORBID_ATTR: ["style"],
  });

  return (
    <div
      className={cn(
        "content-render prose dark:prose-invert max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default ContentRenderer;
