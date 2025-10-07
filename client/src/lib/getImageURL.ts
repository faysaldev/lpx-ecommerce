export const getImageUrl = (imgPath: string) => {
  if (!imgPath) return "";

  // Handle different path formats
  const cleanPath = imgPath.replace(/\\/g, "/");

  // If it's already a full URL, return as is
  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  // If it starts with /, it's already relative to base
  if (cleanPath.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_BASE_URL || ""}${cleanPath}`;
  }

  // Otherwise, prepend base URL
  return `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${cleanPath}`;
};
