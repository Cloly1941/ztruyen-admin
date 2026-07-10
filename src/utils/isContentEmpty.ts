export const isContentEmpty = (html: string): boolean => {
  if (typeof html !== "string" || !html) return true;
  
  // Strip HTML tags to extract raw text content
  const textWithoutTags = html.replace(/<[^>]*>/g, "").trim();
  // Filter out non-breaking space entities and zero-width characters
  const cleanText = textWithoutTags.replace(/&nbsp;|\u200B|\u200C|\u200D|\uFEFF/gi, "").trim();
  
  // Keep content valid if it has at least one image element
  const hasImage = /<img\b[^>]*>/i.test(html);
  
  // NOTE: If in the future we whitelist other interactive content (like videos or iframes),
  // this check must be expanded to include those tags (e.g. /<(img|video|iframe)\b[^>]*>/i).
  
  return cleanText.length === 0 && !hasImage;
};
