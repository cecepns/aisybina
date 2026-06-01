export function getWhatsAppNumber() {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER || "6281234567890";
  return String(raw).replace(/\D/g, "");
}

export function buildWhatsAppOrderUrl({ productName, seriesName, categoryTitle }) {
  const phone = getWhatsAppNumber();
  const lines = [
    "Hello Aisybina Export,",
    "",
    "I would like to order / inquire about:",
    `*${productName}*`,
  ];
  if (seriesName) lines.push(`Series: *${seriesName}*`);
  if (categoryTitle) lines.push(`Category: ${categoryTitle}`);
  lines.push("", "Please share price, MOQ, and availability. Thank you.");

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${text}`;
}
