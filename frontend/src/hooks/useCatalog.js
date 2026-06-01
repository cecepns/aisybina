import { useState, useEffect, useCallback } from "react";
import { fetchCatalog } from "../services/productService";
import { PRODUCT_CATEGORIES } from "../data/products";
import { getCategoryIcon } from "../data/categoryIcons";
import { getUploadUrl } from "../utils/request";

function productThumbnail(item) {
  if (item.images?.length) return getUploadUrl(item.images[0].image);
  if (item.image) return getUploadUrl(item.image);
  return null;
}

function normalizeCategory(cat) {
  return {
    ...cat,
    icon: getCategoryIcon(cat.slug || cat.id),
    items: (cat.items || []).map((item) => ({
      ...item,
      imageUrl: productThumbnail(item),
    })),
  };
}

function normalizeStaticFallback() {
  return PRODUCT_CATEGORIES.map((cat) => normalizeCategory(cat));
}

export default function useCatalog() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCatalog();
      const data = (res.data || []).map(normalizeCategory);
      if (data.length) {
        setCategories(data);
        setFromApi(true);
      } else {
        setCategories(normalizeStaticFallback());
        setFromApi(false);
      }
    } catch {
      setCategories(normalizeStaticFallback());
      setFromApi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featuredProducts = categories.flatMap((cat) =>
    (cat.items || []).slice(0, 2).map((item) => ({
      ...item,
      categorySlug: cat.slug || cat.id,
      categoryTitle: cat.shortTitle,
      categoryIcon: cat.icon,
    }))
  );

  const allProducts = categories.flatMap((cat) =>
    (cat.items || []).map((item) => ({
      ...item,
      categorySlug: cat.slug || cat.id,
      categoryTitle: cat.shortTitle,
    }))
  );

  return {
    categories,
    loading,
    fromApi,
    featuredProducts,
    allProducts,
    reload: load,
  };
}
