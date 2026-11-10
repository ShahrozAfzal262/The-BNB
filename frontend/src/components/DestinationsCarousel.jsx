import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const destinations = [
  { name: "Dubai", description: "Similar to Lahore", image: "photo-1512453979798-5ea266f8880c" },
  { name: "Kuala Lumpur", description: "For the Petronas Towers", image: "photo-1596422846543-75c6fc197f07" },
  { name: "Al Madinah al Munawwarah", description: "For a trip abroad", image: "photo-1564769625905-50e93615e769" },
  { name: "Jeddah", description: "Epic architecture", image: "photo-1578895101408-1a36b834405b" },
  { name: "Istanbul", description: "Vibrant nightlife", image: "photo-1541432901042-2d8bd64b4a9b" },
  { name: "London", description: "Epic architecture", image: "photo-1513635269975-59663e0ac1ad" },
  { name: "Bangkok", description: "World-class dining", image: "photo-1508009603885-50cf7c579365" },
  { name: "Manchester", description: "Vibrant nightlife", image: "photo-1500530855697-b586d89ba3ee" },
  { name: "Edinburgh", description: "Epic architecture", image: "photo-1530789253388-582c481c54b0" },
  { name: "Amman", description: "For the Amman Citadel", image: "photo-1480714378408-67cf0d13bc1b" },
  { name: "Birmingham", description: "For a trip abroad", image: "photo-1470770841072-f978cf4d019e" },
  { name: "Marrakesh", description: "Popular destination", image: "photo-1539020140153-e479b8c22e70" },
  { name: "Paris", description: "World-class dining", image: "photo-1502602898657-3e91760cbb34" },
  { name: "Barcelona", description: "Prime beach spot", image: "photo-1507525428034-b723cf961d3e" },
  { name: "Toronto", description: "For the CN Tower", image: "photo-1519501025264-65ba15a82390" },
  { name: "Doha", description: "For a trip abroad", image: "photo-1509099836639-18ba1795216d" },
  { name: "Mississauga", description: "For a trip abroad", image: "photo-1517935706615-2717063c2225" },
  { name: "Rome", description: "Top destination", image: "photo-1552832230-c0197dd311b5" },
  { name: "Tokyo", description: "For a trip abroad", image: "photo-1540959733332-eab4deabeeaf" },
  { name: "Calgary", description: "For nature lovers", image: "premium_photo-1672116452571-896980a801c8" },
];

export default function DestinationsCarousel() {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollControls() {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 0);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }

  function scroll(direction) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth, behavior: "smooth" });
  }

  function getDestinationImageUrl(image) {
    const host = image.startsWith("premium_photo-")
      ? "https://plus.unsplash.com"
      : "https://images.unsplash.com";
    return `${host}/${image}?auto=format&fit=crop&w=400&h=380&q=82`;
  }

  return (
    <section className="destinations-section" aria-label="Destinations for you">
      <div className="destinations-heading">
        <h2>Destinations for you</h2>
        <div className="carousel-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Show previous destinations" disabled={!canScrollLeft}>
            <ArrowLeft size={17} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Show more destinations" disabled={!canScrollRight}>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="destinations-rail" ref={railRef} onScroll={updateScrollControls}>
        {destinations.map((destination) => (
          <Link
            className="destination-card"
            key={destination.name}
            to={`/explore?search=${encodeURIComponent(destination.name)}`}
          >
            <img
              src={getDestinationImageUrl(destination.image)}
              alt={`${destination.name} destination`}
              loading="lazy"
            />
            <strong>{destination.name}</strong>
            <span>{destination.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
