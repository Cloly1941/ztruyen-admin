export const filterTailwindClasses = (rawClass: string, stripAlign = true): string => {
  if (!rawClass) return "";
  const allowedRegex = /^(text|font|bg|p[xytrbl]?|m[xytrbl]?|rounded|shadow|w|h|max-w|leading|tracking|border)(-|$)/;
  const forbiddenRegex = /^(fixed|absolute|z-|w-screen|h-screen|inset-)/;
  const textAlignRegex = /^(text-(left|center|right|justify))$/;

  return rawClass
    .split(/\s+/)
    .filter((c) => {
      if (!c) return false;
      if (stripAlign && textAlignRegex.test(c)) return false;
      return allowedRegex.test(c) && !forbiddenRegex.test(c);
    })
    .join(" ")
    .trim();
};
