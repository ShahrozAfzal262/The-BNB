import { useRef } from "react";
import { ArrowLeft, ArrowRight, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { useListings } from "../hooks/useListings.js";
import { FALLBACK_IMAGE, firstImage, imageUrl } from "../utils/images.js";

// One horizontal row of stays. Used by Bahria Town, Free cancellation and Similar dates.
//  - clicking a photo or the text opens the stay (dates, guests, booking)
//  - the big arrow next to the title opens the 2-column list + map page
export default function ListingRail({
  title,
  subtitle,
  ariaLabel,
  query,
  exploreTo,
  sectionClass = "nearby-section",
  headingClass = "",
  seeAllClass = "",
}) {
  const railRef = useRef(null);
  const { ids, toggle } = useFavorites();
  const { listings, loading, error } = useListings(query);

  function scroll(direction) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollTo({ left: rail.scrollLeft + direction * rail.clientWidth * 0.82, behavior: "smooth" });
  }

  const titleRow = (
    <div className="nearby-title-row">
      <h2>{title}</h2>
      <Link to={exploreTo} className="heading-arrow" aria-label={`See all: ${title}`}>
        <ArrowRight size={20} />
      </Link>
    </div>
  );

  return (
    <section className={sectionClass} aria-label={ariaLabel || title}>
      <div className={`nearby-heading ${headingClass}`.trim()}>
        {subtitle ? (
          <div>
            {titleRow}
            <p>{subtitle}</p>
          </div>
        ) : (
          titleRow
        )}
        <div className="carousel-controls">
          <button type="button" onClick={() => scroll(-1)} aria-label="Show previous stays">
            <ArrowLeft size={17} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Show more stays">
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <div className="recommendation-rail nearby-rail" ref={railRef}>
        {loading && <p>Loading stays…</p>}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p>No stays here yet. Run <code>npm run seed</code> in the backend folder to add demo stays.</p>
        )}

        {listings.map((stay) => {
          const isFavorite = ids.has(stay._id);
          return (
            <article className="recommendation-card" key={stay._id}>
              <Link className="recommendation-photo" to={`/stays/${stay._id}`}>
                <img
                  src={imageUrl(firstImage(stay), 640)}
                  alt={stay.title}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                {(stay.badge || Number(stay.rating) >= 4.9) && (
                  <span className="recommendation-favorite">{stay.badge || "Guest favorite"}</span>
                )}
              </Link>
              <button
                className={`recommendation-heart${isFavorite ? " is-favorite" : ""}`}
                type="button"
                onClick={() => toggle(stay._id)}
                aria-label={isFavorite ? "Remove from wish list" : "Save to wish list"}
                aria-pressed={isFavorite}
              >
                <Heart size={30} />
              </button>
              <Link className="recommendation-details" to={`/stays/${stay._id}`}>
                <strong>{stay.title}</strong>
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

        {listings.length > 0 && (
          <Link className={`see-all-card ${seeAllClass}`.trim()} to={exploreTo}>
            <span className="see-all-stack">
              {listings.slice(0, 3).map((stay, index) => (
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
        )}
      </div>
    </section>
  );
}
