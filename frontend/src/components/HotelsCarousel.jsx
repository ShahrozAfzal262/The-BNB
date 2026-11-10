import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { exploreLink, useListings } from "../hooks/useListings.js";
import { FALLBACK_IMAGE, firstImage, imageUrl } from "../utils/images.js";

// A row of hotels for one city.
//  - clicking a hotel photo or name opens the hotel page (dates, guests, booking)
//  - the arrow next to the title opens the 2-column list + map page
export default function HotelsCarousel({ destination }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [params] = useSearchParams();
  const city = destination || params.get("city") || "Hong Kong";
  const { ids, toggle } = useFavorites();
  const { listings: hotels, loading, error } = useListings({ kind: "Hotel", city });
  const exploreTo = exploreLink({ kind: "Hotel", city, title: `Hotels in ${city}` });

  function updateScrollControls() {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 1);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }

  useEffect(() => {
    updateScrollControls();
  }, [hotels]);

  function scroll(direction) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="hotels-carousel" aria-label={`Hotels in ${city}`}>
      <div className="hotels-carousel-heading">
        <h1>Hotels in {city}</h1>
        <Link className="hotel-heading-arrow" to={exploreTo} aria-label={`See all hotels in ${city}`}>
          <ArrowRight size={20} />
        </Link>
        <div className="hotels-carousel-controls">
          <button type="button" onClick={() => scroll(-1)} disabled={!canScrollLeft} aria-label="Show previous hotels">
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={!canScrollRight} aria-label="Show more hotels">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="hotels-rail" ref={railRef} onScroll={updateScrollControls}>
        {loading && <p>Loading hotels…</p>}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && hotels.length === 0 && <p>No hotels found in {city} yet.</p>}

        {hotels.map((hotel) => {
          const isFavorite = ids.has(hotel._id);
          return (
            <article className="hotel-card" key={hotel._id}>
              <Link
                className={`hotel-photo${isFavorite ? " is-favorite" : ""}`}
                to={`/stays/${hotel._id}`}
                aria-label={`View ${hotel.title} in ${city}`}
              >
                <img
                  src={imageUrl(firstImage(hotel), 650)}
                  alt={`${hotel.title} hotel in ${city}`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </Link>
              <button
                className={`hotel-favorite${isFavorite ? " is-favorite" : ""}`}
                type="button"
                onClick={() => toggle(hotel._id)}
                aria-label={isFavorite ? `Remove ${hotel.title} from saved hotels` : `Save ${hotel.title}`}
                aria-pressed={isFavorite}
              >
                <Heart size={25} />
              </button>
              <Link className="hotel-card-details" to={`/stays/${hotel._id}`}>
                <strong>{hotel.title}</strong>
                <span>
                  ${hotel.price} / night{hotel.rating ? ` · ★ ${Number(hotel.rating).toFixed(2)}` : ""}
                </span>
              </Link>
            </article>
          );
        })}

        {hotels.length > 0 && (
          <Link className="hotel-see-all-card" to={exploreTo} aria-label={`See all hotels in ${city}`}>
            <span className="see-all-stack" aria-hidden="true">
              {hotels.slice(0, 3).map((hotel, index) => (
                <img
                  key={hotel._id}
                  src={imageUrl(firstImage(hotel), 180)}
                  alt=""
                  loading="lazy"
                  style={{ "--stack-index": index }}
                />
              ))}
            </span>
            <span>See all</span>
            <ArrowRight size={20} />
          </Link>
        )}
      </div>
    </section>
  );
}
