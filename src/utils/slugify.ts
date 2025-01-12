/**
 * Converts a string into a URL-friendly slug
 * Handles special characters, accents, and ensures URL compatibility
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Normalize unicode characters
    .normalize('NFKD')
    // Remove accents
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces and special characters
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/[\s_]+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to prevent extremely long URLs
    .substring(0, 200);
}

/**
 * Generates a unique slug by appending a number if the slug already exists
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = slugify(baseSlug);
  let counter = 1;
  
  const original = slug;
  while (existingSlugs.includes(slug)) {
    slug = `${original}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Validates if a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}
