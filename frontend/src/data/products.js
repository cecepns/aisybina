import { Shirt, GraduationCap, Snowflake } from "lucide-react";

export const PRODUCT_CATEGORIES = [
  {
    id: "muslim-koko",
    slug: "muslim-koko",
    title: "Muslim Koko Clothes for Children",
    shortTitle: "Muslim Koko",
    icon: Shirt,
    tagline: "Modern design with traditional Indonesian touches",
    description:
      "Aisybina Export presents a collection of Muslim koko shirts for children that combine modern designs with traditional Indonesian touches. Made from high-quality materials, they are comfortable and durable.",
    highlights: [
      "Premium breathable fabrics",
      "Traditional & modern fusion designs",
      "Comfortable for daily wear",
      "Export-quality stitching",
    ],
    items: [
      {
        id: "koko-1",
        name: "Classic Embroidered Koko",
        category: "muslim-koko",
        description: "Elegant embroidered koko with soft cotton blend, ideal for daily and ceremonial wear.",
      },
      {
        id: "koko-2",
        name: "Modern Slim Fit Koko",
        category: "muslim-koko",
        description: "Contemporary slim-cut koko with minimalist collar detail for active children.",
      },
      {
        id: "koko-3",
        name: "Festive Batik Accent Koko",
        category: "muslim-koko",
        description: "Premium koko featuring subtle batik accents celebrating Indonesian heritage.",
      },
      {
        id: "koko-4",
        name: "School Prayer Koko Set",
        category: "muslim-koko",
        description: "Durable koko set designed for school and mosque activities with easy-care fabric.",
      },
    ],
  },
  {
    id: "school-uniforms",
    slug: "school-uniforms",
    title: "Children's School Uniforms",
    shortTitle: "School Uniforms",
    icon: GraduationCap,
    tagline: "Premium uniforms for elementary to high school",
    description:
      "We produce premium-quality school uniforms for elementary, middle, and high school students. Our school uniforms are made from selected, strong, comfortable, and durable fabrics, supporting children's learning activities without compromising comfort.",
    highlights: [
      "Elementary, middle & high school lines",
      "Strong yet comfortable fabrics",
      "Customizable school branding",
      "Consistent sizing & colors",
    ],
    items: [
      {
        id: "uniform-1",
        name: "Elementary Complete Set",
        category: "school-uniforms",
        description: "Full uniform set for primary students with reinforced seams for active learning.",
      },
      {
        id: "uniform-2",
        name: "Middle School Standard Set",
        category: "school-uniforms",
        description: "Professional middle school uniform with moisture-wicking fabric technology.",
      },
      {
        id: "uniform-3",
        name: "High School Formal Set",
        category: "school-uniforms",
        description: "Sharp, formal high school uniform designed for comfort and long-lasting wear.",
      },
      {
        id: "uniform-4",
        name: "Sports & PE Uniform",
        category: "school-uniforms",
        description: "Flexible athletic uniform for physical education and extracurricular activities.",
      },
    ],
  },
  {
    id: "frozen-groceries",
    slug: "frozen-groceries",
    title: "Frozen Groceries",
    shortTitle: "Frozen Groceries",
    icon: Snowflake,
    tagline: "Frozen staples with preserved freshness & nutrition",
    description:
      "In addition to fashion products, Aisybina Export operates in the food sector, providing frozen groceries consisting of frozen staple foods. These products are processed using modern technology to maintain freshness, flavor, and nutritional quality.",
    highlights: [
      "Modern freezing technology",
      "Hygienic processing standards",
      "Long shelf life with fresh taste",
      "Export-ready packaging",
    ],
    items: [
      {
        id: "frozen-1",
        name: "Frozen Rice Portions",
        category: "frozen-groceries",
        description: "Pre-portioned frozen rice maintaining texture and flavor after reheating.",
      },
      {
        id: "frozen-2",
        name: "Frozen Vegetable Mix",
        category: "frozen-groceries",
        description: "Selected Indonesian vegetables flash-frozen to preserve nutrients and color.",
      },
      {
        id: "frozen-3",
        name: "Frozen Protein Staples",
        category: "frozen-groceries",
        description: "Quality frozen protein products processed under strict hygiene controls.",
      },
      {
        id: "frozen-4",
        name: "Frozen Ready-to-Cook Meals",
        category: "frozen-groceries",
        description: "Convenient frozen meal components for households and food service partners.",
      },
    ],
  },
];

export const COMPANY_VALUES = [
  {
    id: 1,
    title: "Guaranteed Quality",
    description:
      "Every product undergoes careful selection and quality control to meet international export standards. We prioritize hygiene, durability, and consistency in every production stage.",
  },
  {
    id: 2,
    title: "Professional & Trusted",
    description:
      "We build long-term partnerships based on professionalism, transparency, and trust—with clear communication, timely delivery, and responsible service worldwide.",
  },
  {
    id: 3,
    title: "Sustainable Innovation",
    description:
      "We adapt to global trends while preserving Indonesian cultural identity and local craftsmanship, creating modern, competitive, and sustainable products.",
  },
  {
    id: 4,
    title: "Social Commitment",
    description:
      "Business growth creates positive social impact through local workforce empowerment, MSME collaboration, and environmentally responsible practices.",
  },
];

export const MISSION_ITEMS = [
  "Providing export products that are high quality, hygienic, and meet international standards",
  "Supporting the growth of local Indonesian MSMEs by opening access to global markets",
  "Establishing sustainable partnerships based on trust, professionalism, and mutual benefit",
  "Presenting product innovations that suit the needs of the modern market",
  "Promoting a positive image of Indonesian products on the international stage",
];
