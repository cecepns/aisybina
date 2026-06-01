import { Shirt, GraduationCap, Snowflake, Package } from "lucide-react";

export const CATEGORY_ICONS = {
  "muslim-koko": Shirt,
  "school-uniforms": GraduationCap,
  "frozen-groceries": Snowflake,
};

export function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || Package;
}
