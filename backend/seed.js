import "dotenv/config";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "./src/config/database.js";
import Listing from "./src/models/Listing.js";
import Booking from "./src/models/Booking.js";
import User from "./src/models/User.js";
import { sampleListings } from "./data/sampleListings.js";
import { cityInfo, findCoordinates, hashCode, jitter } from "./src/utils/geo.js";

// npm run seed        -> adds / refreshes the demo catalog
// npm run seed:reset  -> removes the old demo catalog first, then adds it again
const reset = process.argv.includes("--reset");
// npm run seed:host -- host@email.com   -> all demo listings become that account's listings
const hostArg =
  process.argv.find((arg) => arg.startsWith("--host="))?.slice(7) ||
  process.argv.slice(2).find((arg) => arg.includes("@")) ||
  process.env.DEMO_HOST_EMAIL ||
  "";
const catalog = JSON.parse(await readFile(new URL("./data/catalog.json", import.meta.url), "utf8"));

const adjectives = ["Cozy", "Modern", "Sunny", "Elegant", "Quiet", "Bright", "Stylish", "Spacious"];
const amenityPool = ["Wi-Fi", "Kitchen", "Air conditioning", "Free parking", "TV", "Self check-in", "Pets allowed", "Washer"];
const hotelAmenities = ["Wi-Fi", "Air conditioning", "Breakfast included", "24-hour reception", "TV", "Room service"];

const lahoreAreas = [
  ["Gulberg", 31.512, 74.3434],
  ["DHA Phase 5", 31.4697, 74.401],
  ["Model Town", 31.484, 74.326],
  ["Johar Town", 31.4697, 74.2728],
  ["Shadman", 31.538, 74.332],
  ["Lahore Cantt", 31.52, 74.4],
  ["Wapda Town", 31.441, 74.263],
  ["Allama Iqbal Town", 31.51, 74.29],
  ["Garden Town", 31.495, 74.315],
];

const experienceCities = {
  originals: [
    "Miami Beach", "Florence", "Tokyo", "Atlanta", "Mexico City", "Napa", "Treviso", "Portland",
    "Los Angeles", "Los Angeles", "Los Angeles", "Portland", "Los Angeles", "Los Angeles", "Los Angeles", "Honolulu",
  ],
  "kuala-lumpur": "Kuala Lumpur",
  paris: "Paris",
  london: "London",
  "sao-paulo": "Sao Paulo",
};

let rank = 0;
const nextRank = () => ++rank;
const slug = (text) => String(text).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const unsplash = (id) => (id.startsWith("premium_photo-") ? `https://plus.unsplash.com/${id}` : `https://images.unsplash.com/${id}`);
const picsum = (key) => `https://picsum.photos/seed/${hashCode(String(key))}/1200/900`;

function pick(pool, count, seed) {
  const start = hashCode(seed);
  return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[(start + i * 3) % pool.length]);
}

// Photo pool for homes and hotels: every interior photo that already appears in the catalog.
const photoPool = [
  ...new Set([
    ...catalog.bahria.map((x) => x.image),
    ...catalog.free.map((x) => x.image),
    ...catalog.similar.map((x) => x.image),
    ...Object.values(catalog.hotels).flat().map((x) => x.image),
  ]),
].filter((id) => !/^photo-17[0-9]{2}/.test(id)); // skip ids that look invalid

function homeGallery(mainId, seed) {
  const others = pick(photoPool.filter((id) => id !== mainId), 4, seed);
  return [mainId, ...others].map(unsplash);
}

function describeHome(adj, type, place) {
  return `${adj} ${type.toLowerCase()} in ${place} with fast Wi-Fi, a comfortable bedroom, a fully equipped kitchen and easy access to cafes, parks and main roads. A relaxed base for couples, families and business travellers.`;
}

function makeHome({ seedKey, item, index, area, collections, forceFreeCancellation = false, country = "Pakistan", city = "Lahore", coords }) {
  const h = hashCode(seedKey);
  const adj = adjectives[index % adjectives.length];
  const type = item.kind || (h % 4 === 0 ? "Home" : "Apartment");
  const { lat, lng } = jitter(coords[0], coords[1], seedKey, 0.006);
  return {
    seedKey,
    title: `${adj} ${type} in ${area}`,
    description: describeHome(adj, type, `${area}, ${city}`),
    location: `${area}, ${city}, ${country}`,
    city,
    kind: "Stay",
    category: "City",
    propertyType: type,
    price: item.price,
    priceUnit: "night",
    guests: 2 + (h % 4),
    bedrooms: 1 + (h % 3),
    bathrooms: 1 + (h % 2),
    image: unsplash(item.image),
    images: homeGallery(item.image, seedKey),
    amenities: pick(amenityPool, 4 + (h % 3), seedKey),
    instantBook: item.favorite !== false,
    freeCancellation: forceFreeCancellation || h % 3 === 0,
    lat,
    lng,
    collections,
    rating: Number(item.rating) || 4.9,
    reviews: 8 + (h % 90),
    badge: item.favorite ? "Guest favorite" : undefined,
    rank: nextRank(),
  };
}

function buildCatalog() {
  const items = [];

  // 1) The original demo stays (these keep their title + location so old rows are refreshed, not duplicated)
  sampleListings.forEach((sample, index) => {
    const found = findCoordinates(sample.location) || { lat: 31.5204, lng: 74.3587 };
    const { lat, lng } = jitter(found.lat, found.lng, sample.title, 0.02);
    items.push({
      ...sample,
      seedKey: `sample-${index}`,
      match: { title: sample.title, location: sample.location },
      kind: "Stay",
      city: sample.location.split(",")[0].trim(),
      image: sample.images[0],
      lat,
      lng,
      collections: ["explore"],
      reviews: 12 + index * 7,
      rank: nextRank(),
    });
  });


  // 1b) Faisalabad homes (the default search city), spread over the city
  const faisalabadAreas = [
    ["D Ground", 31.421, 73.095], ["Peoples Colony", 31.405, 73.074], ["Madina Town", 31.435, 73.06],
    ["Susan Road", 31.438, 73.1], ["Canal Road", 31.4, 73.06], ["Eden Executive", 31.39, 73.045],
    ["Jinnah Colony", 31.4, 73.095], ["Samanabad", 31.43, 73.118], ["Satiana Road", 31.46, 73.04],
    ["Millat Chowk", 31.41, 73.108], ["Gulberg", 31.445, 73.085], ["Civil Lines", 31.427, 73.083],
  ];
  const faisalabadTitles = [
    "Luxury Suite 2BHK Apartment | Self Check-in", "Modern 1 BHK Apartment | Cozy & Comfortable",
    "Luxury Urban Escape | 1BHK Near the Mall", "Studio Apartment for Couples", "Furnished Family Apartment",
    "Designer 2BHK with Self Check-in", "Executive 1BR Furnished Apartment", "Garden View 2-BHK Apartment & Parking",
    "Private Room in a Quiet Home", "Spacious Family Home with Parking", "Bright 2BR with Wi-Fi and AC",
    "Peaceful Home for Business Travellers",
  ];
  const faisalabadTypes = ["Apartment", "Condo", "Apartment", "Home", "Apartment", "Condo", "Apartment", "Apartment", "Room", "Home", "Apartment", "Home"];
  for (let i = 0; i < 24; i += 1) {
    const seedKey = `faisalabad-${i}`;
    const h = hashCode(seedKey);
    const area = faisalabadAreas[i % faisalabadAreas.length];
    const type = faisalabadTypes[i % faisalabadTypes.length];
    const mainId = photoPool[h % photoPool.length];
    const { lat, lng } = jitter(area[1], area[2], seedKey, 0.006);
    const isNew = i % 5 === 0;
    items.push({
      seedKey,
      title: `${faisalabadTitles[i % faisalabadTitles.length]}${i >= 12 ? ` - ${area[0]}` : ""}`,
      description: describeHome(adjectives[i % adjectives.length], type, `${area[0]}, Faisalabad`),
      location: `${area[0]}, Faisalabad, Pakistan`,
      city: "Faisalabad",
      kind: "Stay",
      category: "City",
      propertyType: type,
      price: type === "Room" ? 28 + (h % 20) : 40 + (h % 120),
      priceUnit: "night",
      guests: type === "Room" ? 2 : 2 + (h % 5),
      bedrooms: type === "Room" ? 1 : 1 + (h % 3),
      bathrooms: 1 + (h % 2),
      image: unsplash(mainId),
      images: homeGallery(mainId, seedKey),
      amenities: pick(amenityPool, 5 + (h % 3), seedKey),
      instantBook: h % 2 === 0,
      freeCancellation: h % 3 !== 0,
      lat,
      lng,
      collections: ["faisalabad"],
      rating: isNew ? 5 : Number((4.6 + (h % 40) / 100).toFixed(2)),
      reviews: isNew ? 0 : 3 + (h % 110),
      badge: i % 4 === 1 ? "Guest favorite" : i % 7 === 3 ? "Superhost" : undefined,
      rank: nextRank(),
    });
  }

  // 2) Bahria Town row
  catalog.bahria.forEach((item, index) => {
    items.push(
      makeHome({
        seedKey: `bahria-${index}`,
        item,
        index,
        area: "Bahria Town",
        collections: ["bahria"],
        coords: [31.3677, 74.1869],
      }),
    );
  });

  // 3) Lahore homes with free cancellation row
  catalog.free.forEach((item, index) => {
    const area = lahoreAreas[(index * 2) % lahoreAreas.length];
    items.push(
      makeHome({
        seedKey: `free-${index}`,
        item,
        index: index + 2,
        area: area[0],
        collections: ["free-cancellation"],
        forceFreeCancellation: true,
        coords: [area[1], area[2]],
      }),
    );
  });

  // 4) Available for similar dates row
  catalog.similar.forEach((item, index) => {
    const area = lahoreAreas[(index * 2 + 1) % lahoreAreas.length];
    items.push(
      makeHome({
        seedKey: `similar-${index}`,
        item,
        index: index + 5,
        area: area[0],
        collections: ["similar-dates"],
        coords: [area[1], area[2]],
      }),
    );
  });

  // 5) Two stays for every "Destinations for you" card so each card opens real results
  catalog.destinations.forEach((destination, dIndex) => {
    const info = cityInfo(destination.name);
    if (!info) return;
    const [name, lat0, lng0, country] = info;
    [0, 1].forEach((n) => {
      const seedKey = `destination-${slug(name)}-${n}`;
      const h = hashCode(seedKey);
      const adj = adjectives[(dIndex + n * 3) % adjectives.length];
      const type = n === 0 ? "Apartment" : "Home";
      const mainId = photoPool[h % photoPool.length];
      const { lat, lng } = jitter(lat0, lng0, seedKey, 0.04);
      items.push({
        seedKey,
        title: n === 0 ? `${adj} apartment in ${name}` : `${adj} home near the centre of ${name}`,
        description: `${describeHome(adj, type, name)} ${destination.description}.`,
        location: `${name}, ${country}`,
        city: name,
        kind: "Stay",
        category: "City",
        propertyType: type,
        price: 55 + (h % 140),
        priceUnit: "night",
        guests: 2 + (h % 4),
        bedrooms: 1 + (h % 3),
        bathrooms: 1 + (h % 2),
        image: unsplash(mainId),
        images: homeGallery(mainId, seedKey),
        amenities: pick(amenityPool, 5, seedKey),
        instantBook: h % 2 === 0,
        freeCancellation: h % 3 !== 0,
        lat,
        lng,
        collections: ["destinations"],
        rating: Number((4.7 + (h % 30) / 100).toFixed(2)),
        reviews: 6 + (h % 80),
        rank: nextRank(),
      });
    });
  });

  // 6) Hotels
  Object.entries(catalog.hotels).forEach(([city, hotels]) => {
    const info = cityInfo(city);
    const [name, lat0, lng0, country] = info;
    hotels.forEach((hotel, index) => {
      const seedKey = `hotel-${slug(city)}-${index}`;
      const h = hashCode(seedKey);
      const { lat, lng } = jitter(lat0, lng0, seedKey, 0.04);
      const perNight = Math.max(20, Math.round(Number(String(hotel.price).replace(/,/g, "")) / 2));
      items.push({
        seedKey,
        title: hotel.name,
        description: `${hotel.name} is a well-located hotel in ${name} with comfortable rooms, helpful 24-hour staff and easy access to restaurants, transport and the main sights. Breakfast and room service are available.`,
        location: country === name ? name : `${name}, ${country}`,
        city: name,
        kind: "Hotel",
        category: "Hotel",
        propertyType: "Hotel",
        price: perNight,
        priceUnit: "night",
        guests: 2 + (h % 3),
        bedrooms: 1,
        bathrooms: 1,
        image: unsplash(hotel.image),
        images: [hotel.image, ...pick(photoPool.filter((id) => id !== hotel.image), 4, seedKey)].map(unsplash),
        amenities: pick(hotelAmenities, 5, seedKey),
        instantBook: h % 2 === 0,
        freeCancellation: h % 3 !== 0,
        lat,
        lng,
        collections: [`hotels-${slug(city)}`],
        rating: Number(hotel.rating) || 4.6,
        reviews: 20 + (h % 400),
        rank: nextRank(),
      });
    });
  });

  // 7) Experiences
  const experienceRows = [
    { id: "originals", badge: "Original", items: catalog.originals.items },
    ...catalog.citySections.map((section) => ({ id: section.id, badge: section.badge, items: section.items })),
  ];
  experienceRows.forEach((row) => {
    row.items.forEach((item, index) => {
      const cityName = Array.isArray(experienceCities[row.id]) ? experienceCities[row.id][index] : experienceCities[row.id];
      const info = cityInfo(cityName);
      const [name, lat0, lng0, country] = info;
      const seedKey = `experience-${row.id}-${index}`;
      const { lat, lng } = jitter(lat0, lng0, seedKey, 0.05);
      const mainImage = item.image ? unsplash(item.image) : picsum(item.title);
      const comingSoon = item.price === null;
      items.push({
        seedKey,
        title: item.title,
        description: `Join a friendly local host for "${item.title}" in ${name}. Small groups, everything you need is included, and there is plenty of time for questions and photos.`,
        location: `${name}, ${country}`,
        city: name,
        kind: "Experience",
        category: "Experience",
        propertyType: "Experience",
        price: comingSoon ? 0 : item.price,
        priceUnit: "guest",
        comingSoon,
        badge: row.badge,
        guests: 10,
        bedrooms: 0,
        bathrooms: 1,
        image: mainImage,
        images: [mainImage, picsum(`${item.title}-2`), picsum(`${item.title}-3`), picsum(`${item.title}-4`)],
        amenities: ["Local host", "Small group", "All equipment provided", "Free cancellation up to 24 hours before"],
        instantBook: true,
        freeCancellation: true,
        lat,
        lng,
        collections: [`experiences-${row.id}`],
        rating: Number(item.rating) || 5,
        reviews: item.rating ? 5 + (hashCode(seedKey) % 120) : 0,
        rank: nextRank(),
      });
    });
  });

  // 8) Services
  catalog.services.forEach((section) => {
    const info = cityInfo(section.city);
    const [name, lat0, lng0, country] = info;
    section.items.forEach((item, index) => {
      const seedKey = `service-${slug(section.city)}-${index}`;
      const { lat, lng } = jitter(lat0, lng0, seedKey, 0.04);
      const main = unsplash(item.image);
      items.push({
        seedKey,
        title: item.title,
        description: `${item.title}. A professional local provider comes to you or meets you at a place that suits you in ${name}. Message the host after booking to agree the details.`,
        location: `${name}, ${country}`,
        city: name,
        kind: "Service",
        category: "Service",
        propertyType: "Service",
        price: item.price,
        priceUnit: item.unit === "group" ? "group" : "guest",
        minimumSpend: item.minimum,
        badge: item.popular ? "Popular" : undefined,
        guests: 6,
        bedrooms: 0,
        bathrooms: 1,
        image: main,
        images: [main, picsum(`${item.title}-2`), picsum(`${item.title}-3`)],
        amenities: ["Professional provider", "Flexible scheduling", "Free messaging with your host"],
        instantBook: false,
        freeCancellation: true,
        lat,
        lng,
        collections: [`services-${slug(section.city)}`],
        rating: Number(item.rating) || 4.9,
        reviews: item.rating ? 4 + (hashCode(seedKey) % 60) : 0,
        rank: nextRank(),
      });
    });
  });

  return items;
}

async function getDemoHost() {
  const email = "demo-host@stayora.local";
  let host = await User.findOne({ email });
  if (!host) {
    const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10);
    host = await User.create({ name: "Stayora Demo Host", email, passwordHash });
  }
  return host;
}

// Adds / refreshes the demo catalog. Needs an open database connection.
export async function seedCatalog() {
  if (reset) {
    const old = await Listing.find({ seedKey: { $exists: true } }).select("_id");
    await Booking.deleteMany({ listing: { $in: old.map((listing) => listing._id) } });
    await Listing.deleteMany({ _id: { $in: old.map((listing) => listing._id) } });
    console.log(`Removed ${old.length} old demo listings.`);
  }

  // Demo listings belong to a separate host, so any signed-in account can book them.
  let host;
  if (hostArg) {
    host = await User.findOne({ email: hostArg.trim().toLowerCase() });
    if (!host) throw new Error(`No account with the email "${hostArg}". Register it first, then run the command again.`);
    console.log(`Demo listings will belong to ${host.email}. Book them from a different account.`);
  } else {
    host = await getDemoHost();
  }
  const items = buildCatalog();
  let added = 0;
  let updated = 0;

  for (const item of items) {
    const { match, ...rest } = item;
    const fields = Object.fromEntries(Object.entries(rest).filter(([, value]) => value !== undefined));
    const filter = match || { seedKey: fields.seedKey };
    const result = await Listing.updateOne(filter, { $set: { ...fields, host: host._id } }, { upsert: true, runValidators: true });
    if (result.upsertedCount) added += 1;
    else updated += 1;
  }

  console.log(`Demo catalog ready: ${added} added, ${updated} refreshed (${items.length} total).`);
}

// The API calls this on start-up: if the database has no demo listings yet, it fills them in.
export async function seedIfEmpty() {
  // faisalabad-0 is the newest demo row: if it is missing, (re)run the idempotent seed
  if (await Listing.exists({ seedKey: "faisalabad-0" })) return;
  console.log("No demo listings found, adding them now...");
  await seedCatalog();
}

// `npm run seed` / `npm run seed:reset`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    await seedCatalog();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
