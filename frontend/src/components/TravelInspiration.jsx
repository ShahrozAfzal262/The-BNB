import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  "Popular",
  "Arts & culture",
  "Beach",
  "Mountains",
  "Outdoors",
  "Things to do",
  "Travel tips & inspiration",
  "Airbnb-friendly apartments",
];

const destinations = [
  { city: "Honolulu", rental: "House rentals", tags: ["Popular", "Beach", "Outdoors", "Things to do"] },
  { city: "San Juan", rental: "Condo rentals", tags: ["Popular", "Beach", "Arts & culture"] },
  { city: "Portland", rental: "Vacation rentals", tags: ["Popular", "Mountains", "Outdoors", "Travel tips & inspiration"] },
  { city: "Minneapolis", rental: "House rentals", tags: ["Popular", "Outdoors", "Things to do"] },
  { city: "Galveston", rental: "Condo rentals", tags: ["Popular", "Beach", "Things to do"] },
  { city: "Amsterdam", rental: "Apartment rentals", tags: ["Popular", "Arts & culture", "Things to do"] },
  { city: "Cleveland", rental: "Monthly Rentals", tags: ["Popular", "Arts & culture", "Airbnb-friendly apartments"] },
  { city: "Sacramento", rental: "House rentals", tags: ["Popular", "Outdoors", "Airbnb-friendly apartments"] },
  { city: "Jersey City", rental: "Monthly Rentals", tags: ["Popular", "Arts & culture", "Airbnb-friendly apartments"] },
  { city: "Savannah", rental: "Vacation rentals", tags: ["Popular", "Arts & culture", "Outdoors"] },
  { city: "Manhattan", rental: "Condo rentals", tags: ["Popular", "Things to do", "Arts & culture"] },
  { city: "Kansas City", rental: "Monthly Rentals", tags: ["Popular", "Travel tips & inspiration", "Airbnb-friendly apartments"] },
  { city: "Charlotte", rental: "Apartment rentals", tags: ["Popular", "Outdoors", "Airbnb-friendly apartments"] },
  { city: "London", rental: "House rentals", tags: ["Popular", "Arts & culture", "Things to do", "Travel tips & inspiration"] },
  { city: "Athens", rental: "House rentals", tags: ["Popular", "Arts & culture", "Things to do"] },
  { city: "Santo Domingo", rental: "Apartment rentals", tags: ["Popular", "Beach", "Arts & culture"] },
  { city: "Richmond", rental: "Apartment rentals", tags: ["Popular", "Mountains", "Outdoors"] },
  { city: "Aspen", rental: "Cabin rentals", tags: ["Mountains", "Outdoors", "Travel tips & inspiration"] },
  { city: "Lake Tahoe", rental: "Cabin rentals", tags: ["Mountains", "Outdoors"] },
  { city: "Maui", rental: "Beach house rentals", tags: ["Beach", "Outdoors", "Things to do"] },
  { city: "Malibu", rental: "Beach house rentals", tags: ["Beach", "Travel tips & inspiration"] },
  { city: "Boulder", rental: "Cabin rentals", tags: ["Mountains", "Outdoors", "Things to do"] },
  { city: "New York", rental: "Apartment rentals", tags: ["Arts & culture", "Things to do", "Airbnb-friendly apartments"] },
  { city: "Los Angeles", rental: "Apartment rentals", tags: ["Things to do", "Arts & culture", "Travel tips & inspiration"] },
  { city: "Seattle", rental: "Vacation rentals", tags: ["Outdoors", "Travel tips & inspiration"] },
  { city: "Miami", rental: "Condo rentals", tags: ["Beach", "Things to do", "Airbnb-friendly apartments"] },
];

const extraDestinations = [
  { city: "Boston", rental: "Apartment rentals" },
  { city: "Nashville", rental: "Vacation rentals" },
  { city: "San Diego", rental: "Beach house rentals" },
  { city: "Vancouver", rental: "Monthly Rentals" },
  { city: "New Orleans", rental: "House rentals" },
  { city: "Denver", rental: "Cabin rentals" },
];

const beachDestinations = [
  { city: "Goose Rocks Beach", rental: "Vacation rentals" },
  { city: "Cabo San Lucas", rental: "Apartment rentals" },
  { city: "Nye Beach", rental: "Vacation rentals" },
  { city: "Porto da Barra Beach", rental: "Monthly Rentals" },
  { city: "Berawa Beach", rental: "Pet-friendly rentals" },
  { city: "Sanur", rental: "Apartment rentals" },
  { city: "Playa Cocles", rental: "Monthly Rentals" },
  { city: "Sanibel Island", rental: "Vacation rentals" },
  { city: "La Jolla Shores Beach", rental: "Condo rentals" },
  { city: "Armacao dos Buzios", rental: "Monthly Rentals" },
  { city: "Padang Padang Beach", rental: "Pet-friendly rentals" },
  { city: "Punta Rucia", rental: "Pet-friendly rentals" },
  { city: "Pipa Beach", rental: "Apartment rentals" },
  { city: "Alki Beach", rental: "House rentals" },
  { city: "Coxen Hole", rental: "Beachfront rentals" },
  { city: "Sarasota Beach", rental: "Beachfront rentals" },
  { city: "Zipolite, Oaxaca", rental: "Apartment rentals" },
];

const extraBeachDestinations = [
  { city: "Honolulu", rental: "House rentals" },
  { city: "San Juan", rental: "Condo rentals" },
  { city: "Galveston", rental: "Condo rentals" },
  { city: "Maui", rental: "Beach house rentals" },
  { city: "Malibu", rental: "Beach house rentals" },
  { city: "Miami", rental: "Condo rentals" },
];

export const categoryHero = {
  Popular: {
    city: "Paris",
    country: "France",
    title: "House vacation rentals in Paris",
    description: "Find and book unique houses on Airbnb",
    image: "photo-1502602898657-3e91760cbb34",
  },
  "Arts & culture": {
    city: "Amsterdam",
    country: "Netherlands",
    title: "Cultural stays in Amsterdam",
    description: "Stay close to art, history, and local culture",
    image: "photo-1541432901042-2d8bd64b4a9b",
  },
  Beach: {
    city: "Maui",
    country: "Hawaii",
    title: "Beach house rentals in Maui",
    description: "Find a sunny place to stay by the water",
    image: "photo-1507525428034-b723cf961d3e",
  },
  Mountains: {
    city: "Calgary",
    country: "Canada",
    title: "Mountain stays near Calgary",
    description: "Find a cozy base for your next mountain escape",
    image: "premium_photo-1672116452571-896980a801c8",
    premium: true,
  },
  Outdoors: {
    city: "Lake Tahoe",
    country: "United States",
    title: "Outdoor getaways in Lake Tahoe",
    description: "Book a stay surrounded by the outdoors",
    image: "photo-1470770841072-f978cf4d019e",
  },
  "Things to do": {
    city: "Tokyo",
    country: "Japan",
    title: "Places to stay in Tokyo",
    description: "Make more of every day of your trip",
    image: "photo-1540959733332-eab4deabeeaf",
  },
  "Travel tips & inspiration": {
    city: "London",
    country: "United Kingdom",
    title: "Plan your next London getaway",
    description: "Find a stay that makes the journey memorable",
    image: "photo-1513635269975-59663e0ac1ad",
  },
  "Airbnb-friendly apartments": {
    city: "New York",
    country: "United States",
    title: "Airbnb-friendly apartments in New York",
    description: "Find an apartment for your next city stay",
    image: "photo-1600210492486-724fe5c67fb0",
  },
};

export default function TravelInspiration() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [showMore, setShowMore] = useState(false);

  function getCityPageUrl(city) {
    const category = activeCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `/inspiration/${category}?city=${encodeURIComponent(city)}`;
  }

  const visibleDestinations = activeCategory === "Beach"
    ? beachDestinations
    : destinations.filter((destination) => destination.tags.includes(activeCategory));
  const extraCategoryDestinations = activeCategory === "Beach"
    ? extraBeachDestinations
    : activeCategory === "Popular"
      ? extraDestinations
      : [];
  const expandedDestinations = showMore
    ? [...visibleDestinations, ...extraCategoryDestinations]
    : visibleDestinations;

  return (
    <section className="travel-inspiration" aria-label="Inspiration for future getaways">
      <h2>Inspiration for future getaways</h2>
      <div className="inspiration-tabs" role="tablist" aria-label="Travel inspiration categories">
        {categories.map((category) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            className={`inspiration-tab${activeCategory === category ? " active" : ""}`}
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setShowMore(false);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="inspiration-grid">
        {expandedDestinations.map((destination) => (
          <Link
            className="inspiration-destination"
            key={`${activeCategory}-${destination.city}`}
            to={getCityPageUrl(destination.city)}
          >
            <strong>{destination.city}</strong>
            <span>{destination.rental}</span>
          </Link>
        ))}
        {extraCategoryDestinations.length > 0 && (
          <button
            className="inspiration-show-more"
            type="button"
            aria-expanded={showMore}
            onClick={() => setShowMore((current) => !current)}
          >
            {showMore ? "Show less" : "Show more"}
            {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>
    </section>
  );
}
