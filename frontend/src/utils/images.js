// Photos are stored as plain URLs. This helper asks the image host for a smaller
// version so cards load fast and the big detail photo stays sharp.
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80";

export function imageUrl(src, width = 640) {
  if (!src || typeof src !== "string") return FALLBACK_IMAGE;

  if (src.includes("unsplash.com")) {
    const [base, query = ""] = src.split("?");
    const params = new URLSearchParams(query);
    params.set("auto", "format");
    params.set("fit", "crop");
    params.set("w", String(width));
    params.set("q", "80");
    return `${base}?${params.toString()}`;
  }

  // picsum.photos/seed/<key>/<width>/<height>
  const picsum = src.match(/^(https:\/\/picsum\.photos\/seed\/[^/]+)\/\d+\/\d+/);
  if (picsum) return `${picsum[1]}/${width}/${Math.round(width * 0.85)}`;

  return src;
}

export function listingImages(stay) {
  const all = [
    ...(Array.isArray(stay?.images) ? stay.images : []),
    ...(stay?.image ? [stay.image] : []),
  ]
    .map((item) => (typeof item === "string" ? item : item?.url))
    .filter(Boolean);
  return [...new Set(all)];
}

export function firstImage(stay) {
  return listingImages(stay)[0] || FALLBACK_IMAGE;
}

// "$95 / night", "$40 / guest", "From $120 / group"
export function priceLabel(stay) {
  if (stay?.comingSoon) return "Coming soon";
  const unit = stay?.priceUnit || "night";
  if (!stay?.price) return unit === "night" ? "Price on request" : "Free";
  return `$${stay.price} / ${unit}`;
}
