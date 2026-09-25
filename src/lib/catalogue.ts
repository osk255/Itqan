// Single source of product and company content.
// Ported from design_handoff_itqan_website/site/shared/catalogue.js, which was
// audited against itqanpharma.com on 2026-09-25. Nothing here is invented:
// unknown values are `null` and are simply not rendered. Anything still
// missing is tracked in docs/CLIENT_QUESTIONS.md.
import type { ImageKey } from "./images.generated";

export type Product = {
  name: string;
  slug: string;
  /** Strengths exactly as published on the live site; null when not published. */
  strengths: string | null;
  image: ImageKey;
  categorySlug: string;
  categoryTitle: string;
  categoryFull: string;
  /** Position in the full catalogue, "01"–"27". */
  number: string;
  // CLIENT CONFIRMATION REQUIRED: not yet supplied by Itqan.
  activeIngredient: string | null;
  dosageForm: string | null;
};

export type Category = {
  slug: string;
  title: string;
  full: string;
  items: Product[];
};

type Row = [name: string, strengths: string | null, imageFile: string];

const SOURCE: { slug: string; title: string; full: string; products: Row[] }[] = [
  { slug: "anti-histamine", title: "Anti-histamine", full: "Anti-histamine Medications", products: [["Ales", "5", "ales"]] },
  { slug: "anti-inflammatory", title: "Anti-inflammatory", full: "Anti-inflammatory Medications", products: [["Etoria", "60, 90, 120 mg", "etoria"], ["Colochiqan", "0.5 & 1 mg", "colochiqan"]] },
  { slug: "antimicrobial", title: "Antimicrobial", full: "Antimicrobial Medications", products: [["Moximax", null, "moximax"], ["Zeeto", "250 & 500 mg", "zeeto"]] },
  { slug: "cns", title: "Central Nervous System", full: "Central Nervous System Medications", products: [["Dozile", "5, 10 mg", "dozile"], ["Vertiloc", "8, 16, 24 mg", "vertiloc"]] },
  { slug: "endocrine-cardiovascular", title: "Endocrine & Cardiovascular", full: "Endocrine & Cardiovascular Medications", products: [["Emperor", "10 & 20 mg", "emperor"], ["Xaro", "2.5, 10, 15, 20 mg", "xaro"], ["Cresuva", "10 & 20 mg", "cresuva"]] },
  {
    slug: "health-wellness",
    title: "Health & Wellness",
    full: "Health & Wellness Essentials",
    products: [
      ["Stay-Up", null, "stay-up"],
      ["SuperDal", "1000 IU, 2000 IU, 5000 IU, 10,000 IU, 50,000 IU", "superdal"],
      ["Bioactive B12", "1000 & 5000 mcg", "bioactive-b12"],
      ["Ferroqan", null, "ferroqan"],
      ["SuperVit MAX", null, "supervit-max"],
      ["SuperZinc", "30 & 50 mg", "superzinc"],
      ["SuperZinc plus", null, "superzinc-plus"],
      ["Itqan SuperVit C", null, "supervit-c"],
      ["Itqan SuperVit C Plus", null, "supervit-c-plus"],
      ["Evin", null, "evin"],
      ["Breez", null, "breez"],
    ],
  },
  { slug: "male-health", title: "Male Health", full: "Male Health", products: [["Amour", "5, 10, 20 mg", "amour"], ["Extenda", "30 & 60 mg", "extenda"]] },
  { slug: "otc", title: "Over-the-Counter", full: "Over the Counter Medications", products: [["Gastop", null, "gastop"], ["Melaton", "3 & 5 mg", "melaton"], ["Pymol", "500", "pymol"], ["Pymol extra", null, "pymol-extra"]] },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const pad2 = (n: number) => String(n).padStart(2, "0");

export const products: Product[] = [];

export const categories: Category[] = SOURCE.map((c) => ({
  slug: c.slug,
  title: c.title,
  full: c.full,
  items: c.products.map(([name, strengths, file]) => {
    const product: Product = {
      name,
      slug: slugify(name),
      strengths,
      image: `products/${file}` as ImageKey,
      categorySlug: c.slug,
      categoryTitle: c.title,
      categoryFull: c.full,
      number: pad2(products.length + 1),
      activeIngredient: null,
      dosageForm: null,
    };
    products.push(product);
    return product;
  }),
}));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const dosageForms = ["Tablet", "Suppositories", "Sachet", "Capsule", "Soft Gel Capsule", "Liquid Oral", "Semi Solid"] as const;

export const reasons = [
  "Regulatory compliance",
  "Flexibility & elasticity",
  "Constant support & cooperation",
  "State-of-the-art equipment",
  "Top-quality raw materials from certified sources",
  "Strict adherence to quality guidelines",
  "Experienced & qualified personnel",
] as const;

/** "Our production site is currently approved in…" (Business Cooperation page of the live site). */
export const markets = {
  national: ["Jordan", "Iraq", "Lebanon", "Sudan", "Yemen", "Libya", "Kazakhstan", "Kuwait", "UAE", "Oman"],
  central: ["GCC (central approval)"],
  /** Registration in process, NOT approved. Never present these as approvals. */
  inProgress: ["Swissmedic", "European Union"],
} as const;

export const approvalsText =
  "Jordan, Iraq, Lebanon, Sudan, Yemen, Libya, Kazakhstan and centrally in GCC and nationally in Kuwait, UAE, Oman. Itqan is currently in the process of being registered with Swiss medic and the European Union.";

export const statements = {
  founded: "Founded in the Hashemite Kingdom of Jordan, Itqan introduced its first product to the Jordanian market in 2019.",
  experience: "Itqan's founders have 30+ years of experience in this field.",
  vision: "Improving the health and quality of life.",
  mission: "Providing a diverse range of innovative, high-quality medications and products available to all.",
  values: "Patient-oriented, Innovation, Excellence, Integrity",
  meaning: "Itqan means establishing perfection — Fueling wellness.",
  manufacturing:
    "With our extensive technical expertise, skilled workforce, efficient workflow, and top-tier manufacturing capabilities, Itqan Pharma is equipped to bring your product to market quickly and with exceptional quality.",
  cooperation:
    "At Itqan Pharma, we're committed to turning your vision into reality with precision, reliability, and speed. By combining our deep technical expertise, skilled team, and streamlined manufacturing processes, we ensure your product reaches the market quickly—without compromising on quality.",
  contractManufacturing: "Rely on our high-quality manufacturing expertise to meet your needs with precision and reliability",
} as const;
