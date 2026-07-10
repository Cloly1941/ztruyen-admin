// ** Third Party
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

// ** Utils
import { filterTailwindClasses } from "@/utils/filterTailwindClasses";


export const CustomTextAlign = TextAlign.extend({
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              const rawClass = element.getAttribute("class") || "";
              const classes = rawClass.split(/\s+/);
              const alignClass = classes.reverse().find((c) => /^(text-(left|center|right|justify))$/.test(c));
              if (alignClass) {
                return alignClass.replace("text-", "");
              }
              return this.options.defaultAlignment;
            },
            renderHTML: (attributes) => {
              if (!attributes.textAlign || attributes.textAlign === this.options.defaultAlignment) {
                return {};
              }
              return { class: `text-${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
});

export const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => {
          const rawClass = element.getAttribute("class") || "";
          return filterTailwindClasses(rawClass) || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          const cleanClass = filterTailwindClasses(attributes.class);
          return cleanClass ? { class: cleanClass } : {};
        },
      },
    };
  },
});

export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => {
          const rawClass = element.getAttribute("class") || "";
          return filterTailwindClasses(rawClass) || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          const cleanClass = filterTailwindClasses(attributes.class);
          return cleanClass ? { class: cleanClass } : {};
        },
      },
    };
  },
});

// ** Custom List Extensions
export const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => filterTailwindClasses(element.getAttribute("class") || "") || null,
        renderHTML: (attributes) => attributes.class ? { class: attributes.class } : {},
      },
    };
  },
});

export const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => filterTailwindClasses(element.getAttribute("class") || "") || null,
        renderHTML: (attributes) => attributes.class ? { class: attributes.class } : {},
      },
    };
  },
});

export const CustomListItem = ListItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => filterTailwindClasses(element.getAttribute("class") || "") || null,
        renderHTML: (attributes) => attributes.class ? { class: attributes.class } : {},
      },
    };
  },
});

// ** Custom Link & Image Extensions
export const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => filterTailwindClasses(element.getAttribute("class") || "") || null,
        renderHTML: (attributes) => attributes.class ? { class: attributes.class } : {},
      },
    };
  },
});

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "rounded-md shadow-sm max-w-full h-auto",
        parseHTML: (element) => {
          const rawClass = element.getAttribute("class") || "";
          const cleanClass = filterTailwindClasses(rawClass);
          return cleanClass || "rounded-md shadow-sm max-w-full h-auto";
        },
        renderHTML: (attributes) => {
          return { class: attributes.class || "rounded-md shadow-sm max-w-full h-auto" };
        },
      },
    };
  },
});
