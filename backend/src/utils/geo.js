// Small city / area table used to put listings on the map.
// Hosts can also send exact lat/lng; this is only a fallback.
const places = [
  ["Bahria Town", 31.3677, 74.1869, "Pakistan", ["bahria"]],
  ["Lahore", 31.5204, 74.3587, "Pakistan"],
  ["Karachi", 24.8607, 67.0011, "Pakistan"],
  ["Islamabad", 33.6844, 73.0479, "Pakistan"],
  ["Faisalabad", 31.418, 73.079, "Pakistan"],
  ["Murree", 33.9073, 73.3943, "Pakistan"],
  ["Dubai", 25.2048, 55.2708, "UAE"],
  ["London", 51.5072, -0.1276, "United Kingdom"],
  ["Istanbul", 41.0082, 28.9784, "Turkey"],
  ["Paris", 48.8566, 2.3522, "France"],
  ["Bangkok", 13.7563, 100.5018, "Thailand"],
  ["Kuala Lumpur", 3.139, 101.6869, "Malaysia"],
  ["Al Madinah al Munawwarah", 24.4672, 39.6111, "Saudi Arabia", ["madinah", "medina"]],
  ["Jeddah", 21.4858, 39.1925, "Saudi Arabia"],
  ["Manchester", 53.4808, -2.2426, "United Kingdom"],
  ["Edinburgh", 55.9533, -3.1883, "United Kingdom"],
  ["Amman", 31.9454, 35.9284, "Jordan"],
  ["Birmingham", 52.4862, -1.8904, "United Kingdom"],
  ["Marrakesh", 31.6295, -7.9811, "Morocco", ["marrakech"]],
  ["Barcelona", 41.3851, 2.1734, "Spain"],
  ["Toronto", 43.6532, -79.3832, "Canada"],
  ["Doha", 25.2854, 51.531, "Qatar"],
  ["Mississauga", 43.589, -79.6441, "Canada"],
  ["Rome", 41.9028, 12.4964, "Italy"],
  ["Tokyo", 35.6762, 139.6503, "Japan"],
  ["Calgary", 51.0447, -114.0719, "Canada"],
  ["Hong Kong", 22.3193, 114.1694, "Hong Kong"],
  ["New York", 40.7128, -74.006, "USA"],
  ["Los Angeles", 34.0522, -118.2437, "USA"],
  ["San Francisco", 37.7749, -122.4194, "USA"],
  ["Madrid", 40.4168, -3.7038, "Spain"],
  ["Sao Paulo", -23.5505, -46.6333, "Brazil", ["são paulo"]],
  ["Miami Beach", 25.7907, -80.13, "USA"],
  ["Florence", 43.7696, 11.2558, "Italy"],
  ["Atlanta", 33.749, -84.388, "USA"],
  ["Mexico City", 19.4326, -99.1332, "Mexico"],
  ["Napa", 38.2975, -122.2869, "USA"],
  ["Treviso", 45.6669, 12.243, "Italy"],
  ["Portland", 45.5152, -122.6784, "USA"],
  ["Honolulu", 21.3069, -157.8583, "USA"],
];

export function hashCode(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

export function cityInfo(name) {
  const key = String(name || "").toLowerCase();
  return places.find(([n, , , , aliases = []]) => n.toLowerCase() === key || aliases.includes(key));
}

export function findCoordinates(text) {
  const haystack = String(text || "").toLowerCase();
  let best = null;
  for (const [name, lat, lng, , aliases = []] of places) {
    for (const term of [name.toLowerCase(), ...aliases]) {
      if (haystack.includes(term) && (!best || term.length > best.length)) {
        best = { lat, lng, length: term.length };
      }
    }
  }
  return best ? { lat: best.lat, lng: best.lng } : null;
}

// Deterministic small offset so listings in one city do not stack on one pixel.
export function jitter(lat, lng, seed, spread = 0.035) {
  const a = (hashCode(`${seed}:a`) % 2000) / 1000 - 1;
  const b = (hashCode(`${seed}:b`) % 2000) / 1000 - 1;
  return { lat: +(lat + a * spread).toFixed(5), lng: +(lng + b * spread).toFixed(5) };
}
