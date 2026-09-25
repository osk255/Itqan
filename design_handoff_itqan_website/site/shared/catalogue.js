/* Itqan Pharma — shared content model used by every page folder.
   Source: itqanpharma.com (audited 2026-09-25) + existing Next.js redesign (src/lib/products.ts).
   Rule: nothing here is invented. Unknown fields are null and surface as
   "CLIENT CONFIRMATION REQUIRED" only when review notes are switched on. */
(function () {
  const IMG = "../assets/products/";
  const categories = [
    { slug: "anti-histamine", title: "Anti-histamine", full: "Anti-histamine Medications", products: [["Ales", "5", "ales.png"]] },
    { slug: "anti-inflammatory", title: "Anti-inflammatory", full: "Anti-inflammatory Medications", products: [["Etoria", "60, 90, 120 mg", "etoria.png"], ["Colochiqan", "0.5 & 1 mg", "colochiqan.png"]] },
    { slug: "antimicrobial", title: "Antimicrobial", full: "Antimicrobial Medications", products: [["Moximax", null, "moximax.jpeg"], ["Zeeto", "250 & 500 mg", "zeeto.png"]] },
    { slug: "cns", title: "Central Nervous System", full: "Central Nervous System Medications", products: [["Dozile", "5, 10 mg", "dozile.png"], ["Vertiloc", "8, 16, 24 mg", "vertiloc.png"]] },
    { slug: "endocrine-cardiovascular", title: "Endocrine & Cardiovascular", full: "Endocrine & Cardiovascular Medications", products: [["Emperor", "10 & 20 mg", "emperor.png"], ["Xaro", "2.5, 10, 15, 20 mg", "xaro.png"], ["Cresuva", "10 & 20 mg", "cresuva.png"]] },
    { slug: "health-wellness", title: "Health & Wellness", full: "Health & Wellness Essentials", products: [["Stay-Up", null, "stay-up.jpeg"], ["SuperDal", "1000 IU, 2000 IU, 5000 IU, 10,000 IU, 50,000 IU", "superdal.png"], ["Bioactive B12", "1000 & 5000 mcg", "bioactive-b12.png"], ["Ferroqan", null, "ferroqan.png"], ["SuperVit MAX", null, "supervit-max.jpeg"], ["SuperZinc", "30 & 50 mg", "superzinc.jpeg"], ["SuperZinc plus", null, "superzinc-plus.png"], ["Itqan SuperVit C", null, "supervit-c.png"], ["Itqan SuperVit C Plus", null, "supervit-c-plus.png"], ["Evin", null, "evin.png"], ["Breez", null, "breez.png"]] },
    { slug: "male-health", title: "Male Health", full: "Male Health", products: [["Amour", "5, 10, 20 mg", "amour.jpeg"], ["Extenda", "30 & 60 mg", "extenda.jpeg"]] },
    { slug: "otc", title: "Over-the-Counter", full: "Over the Counter Medications", products: [["Gastop", null, "gastop.jpeg"], ["Melaton", "3 & 5 mg", "melaton.jpeg"], ["Pymol", "500", "pymol.jpeg"], ["Pymol extra", null, "pymol-extra.jpeg"]] }
  ];
  const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const products = [];
  categories.forEach((c, ci) => {
    c.index = String(ci + 1).padStart(2, "0");
    c.items = c.products.map(([name, strengths, img]) => {
      const p = {
        name, slug: slugify(name), strengths, image: IMG + img,
        category: c.title, categoryFull: c.full, categorySlug: c.slug,
        activeIngredient: null, dosageForm: null, approvedInfo: null, documents: []
      };
      products.push(p);
      return p;
    });
    c.count = c.items.length;
    c.countLabel = String(c.count).padStart(2, "0");
  });
  products.forEach((p, i) => { p.number = String(i + 1).padStart(2, "0"); });

  window.ITQAN = {
    categories, products,
    company: {
      legalName: "Itqan Pharmaceutical Industries",
      shortName: "Itqan Pharmaceutical Ind.",
      location: "Amman, Jordan",
      phone: "+962 6 402 6371", phoneHref: "tel:+96264026371",
      email: "info@itqanpharma.com", emailHref: "mailto:info@itqanpharma.com",
      maps: "https://maps.app.goo.gl/tRABmUWKA13cP5Dp8",
      facebook: "https://www.facebook.com/share/1JjBmg6u4K/?mibextid=LQQJ4d",
      linkedin: "https://www.linkedin.com/company/itqan-pharmaceutical-industries/"
    },
    dosageForms: ["Tablet", "Suppositories", "Sachet", "Capsule", "Soft Gel Capsule", "Liquid Oral", "Semi Solid"],
    reasons: [
      "Regulatory compliance",
      "Flexibility & elasticity",
      "Constant support & cooperation",
      "State-of-the-art equipment",
      "Top-quality raw materials from certified sources",
      "Strict adherence to quality guidelines",
      "Experienced & qualified personnel"
    ],
    // "Our production site is currently approved in…" — business-cooperation page
    markets: {
      national: ["Jordan", "Iraq", "Lebanon", "Sudan", "Yemen", "Libya", "Kazakhstan", "Kuwait", "UAE", "Oman"],
      central: ["GCC (central approval)"],
      inProgress: ["Swissmedic", "European Union"]
    },
    values: ["Patient-oriented", "Innovation", "Excellence", "Integrity"]
  };
  window.dispatchEvent(new Event("itqan:ready"));
})();
