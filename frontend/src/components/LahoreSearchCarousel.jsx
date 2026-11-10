// 


import { useRef } from "react";
import { ArrowLeft, ArrowRight, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { exploreLink, useListings } from "../hooks/useListings.js";
import { FALLBACK_IMAGE as fallbackImage, firstImage, imageUrl } from "../utils/images.js";

export default function LahoreSearchCarousel({ featured = false }) {
  const railRef = useRef(null);
  const { ids, toggle } = useFavorites();
  const { listings: stays, loading } = useListings({ kind: "Stay", limit: 16 });
  const exploreTo = exploreLink({ kind: "Stay", title: "Explore places to stay" });

  function scroll(direction) {
    if (!railRef.current) return;

    const rail = railRef.current;
    rail.scrollTo({
      left: rail.scrollLeft + direction * rail.clientWidth * 0.82,
      behavior: "smooth",
    });
  }

  return (
    <section
      className={`recent-search-section${featured ? " home-feature-section" : ""}`}
      aria-label="Explore stays around the world"
    >
      <Link className="recent-search-banner" to="/explore">
        <img
          src={imageUrl(stays[0] ? firstImage(stays[0]) : fallbackImage, 900)}
          alt=""
        />

        <span className="recent-search-copy">
          <strong>Explore stays around the world</strong>
          <span>Discover properties in different cities and countries</span>
          <ArrowRight size={17} aria-hidden="true" />
        </span>
      </Link>

      <div className="recommendation-heading">
        <h1>Explore places to stay</h1>

        <Link className="heading-arrow" to={exploreTo} aria-label="See all stays on the list and map page">
          <ArrowRight size={20} />
        </Link>

        <div className="carousel-controls">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Show previous stays"
          >
            <ArrowLeft size={17} />
          </button>

          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Show more stays"
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <div className="recommendation-rail" ref={railRef}>
        {loading && <p>Loading stays...</p>}

        {!loading && stays.length === 0 && (
          <p>No properties available yet. Add listings to explore stays.</p>
        )}

        {stays.map((stay) => {
          const isFavorite = ids.has(stay._id);

          return (
            <article className="recommendation-card" key={stay._id}>
              <Link className="recommendation-photo" to={`/stays/${stay._id}`}>
                <img
                  src={imageUrl(firstImage(stay), 640)}
                  alt={stay.title || "Property"}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />

                <span className="recommendation-favorite">{stay.badge || "Guest favorite"}</span>
              </Link>

              <button
                className={`recommendation-heart${isFavorite ? " is-favorite" : ""}`}
                type="button"
                aria-label={isFavorite ? "Remove from wish list" : "Save to wish list"}
                aria-pressed={isFavorite}
                onClick={() => toggle(stay._id)}
              >
                <Heart size={30} />
              </button>

              <Link className="recommendation-details" to={`/stays/${stay._id}`}>
                <strong>{stay.title || "Property"}</strong>

                <span>
                  <span className="rail-loc">{stay.location}</span>
                  <span className="rail-rating">
                    <Star size={13} fill="currentColor" /> {Number(stay.rating || 5).toFixed(2)}
                  </span>
                </span>

                <span>
                  <strong>${stay.price}</strong> / night
                </span>
              </Link>
            </article>
          );
        })}

        <Link className="see-all-card" to={exploreTo}>
          <span className="see-all-stack">
            {stays.slice(0, 3).map((stay, index) => (
              <img
                key={stay._id}
                src={imageUrl(firstImage(stay), 200)}
                alt=""
                style={{ "--stack-index": index }}
                loading="lazy"
              />
            ))}
          </span>

          <strong>See all</strong>
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
