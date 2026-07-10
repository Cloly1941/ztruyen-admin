// ** Third Party
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";

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
          const cleanClass = rawClass
            .split(/\s+/)
            .filter((c: string) => c && !/^(text-(left|center|right|justify))$/.test(c))
            .join(" ")
            .trim();
          return cleanClass || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          const cleanClass = attributes.class
            .split(/\s+/)
            .filter((c: string) => c && !/^(text-(left|center|right|justify))$/.test(c))
            .join(" ")
            .trim();
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
          const cleanClass = rawClass
            .split(/\s+/)
            .filter((c: string) => c && !/^(text-(left|center|right|justify))$/.test(c))
            .join(" ")
            .trim();
          return cleanClass || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          const cleanClass = attributes.class
            .split(/\s+/)
            .filter((c: string) => c && !/^(text-(left|center|right|justify))$/.test(c))
            .join(" ")
            .trim();
          return cleanClass ? { class: cleanClass } : {};
        },
      },
    };
  },
});
