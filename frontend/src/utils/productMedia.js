import { getUploadUrl } from "./request";

export function normalizeProductImages(product) {
  if (!product) return [];
  if (product.images?.length) {
    return product.images.map((img, i) => ({
      id: img.id,
      imageUrl: getUploadUrl(img.image),
      sort_order: img.sort_order ?? i,
    }));
  }
  if (product.image) {
    return [{ id: null, imageUrl: getUploadUrl(product.image), sort_order: 0 }];
  }
  return [];
}
