// Helper to remove quotes from environment variables
// This is needed because some env loaders may include quotes
export const removeQuotes = (str: string | undefined): string => {
  if (!str) return '';
  return str.replace(/^["']|["']$/g, '');
};
