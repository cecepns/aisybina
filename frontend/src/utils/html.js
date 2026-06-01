/** Returns true if string looks like HTML content from Quill */
export function isHtmlContent(value) {
  return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value);
}

/** Strip HTML tags for plain-text preview (tables, etc.) */
export function stripHtml(value) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
