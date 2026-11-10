import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api.js";
import StayCard from "./StayCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function matchesFilter(stay, filter) {
  const amenities = (stay.amenities || []).map((amenity) => String(amenity).toLowerCase());
  const hasAmenity = (pattern) => amenities.some((amenity) => pattern.test(amenity));

  switch (filter) {
    case "Allows pets":
      return hasAmenity(/\bpets?\b|pet[ -]friendly/);
    case "Free parking":
      return hasAmenity(/free parking/);
    case "1+ bathrooms":
      return Number(stay.bathrooms) >= 1;
    case "Kitchen":
      return hasAmenity(/kitchen/);
    case "Wi-Fi":
      return hasAmenity(/wi-?fi|internet/);
    case "Self check-in":
      return hasAmenity(/self check[ -]?in/);
    case "Instant Book":
      return stay.instantBook === true;
    case "Air conditioning":
      return hasAmenity(/air conditioning|air-conditioning|\bac\b/);
    case "TV":
      return hasAmenity(/\btv\b|television/);
    case "Free cancellation":
      return stay.freeCancellation === true;
    default:
      return true;
  }
}

// A grid of stay cards loaded from the API.
//  - `onLoaded(stays)` gives the (filtered) list to the parent, so the map can show the same stays
//  - `onHover(id)` tells the parent which card the mouse is on, so the map pin can light up
//  - `compact` shows only the result count (used in the list + map page)
export default function StayGrid({
  category = "",
  search = "",
  kind = "",
  collection = "",
  city = "",
  filters = [],
  title = "Places to stay, made for you",
  showEmptyState = true,
  compact = false,
  onLoaded,
  onHover,
  date = "",
  limit = 0,
  minGuests = 0,
}) {
  const { user } = useAuth();

  const [stays, setStays] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredStays = stays.filter(
    (stay) => filters.every((filter) => matchesFilter(stay, filter)) && (!minGuests || Number(stay.guests) >= minGuests),
  );
  const signature = `${loading}:${filteredStays.map((stay) => stay._id).join(",")}`;

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (kind) params.set("kind", kind);
    if (collection) params.set("collection", collection);
    if (city) params.set("city", city);
    if (limit) params.set("limit", String(limit));

    let isActive = true;
    setLoading(true);
    setError("");

    api(`/listings${params.toString() ? `?${params}` : ""}`)
      .then(({ listings }) => {
        if (isActive) setStays(Array.isArray(listings) ? listings : []);
      })
      .catch((requestError) => {
        if (isActive) {
          setStays([]);
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [category, search, kind, collection, city, limit]);

  useEffect(() => {
    onLoaded?.(loading ? [] : filteredStays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(() => {
    let isActive = true;

    if (!user) {
      setFavoriteIds(new Set());
      return undefined;
    }

    api("/users/me/favorites")
      .then(({ listings }) => {
        if (isActive) {
          setFavoriteIds(new Set((Array.isArray(listings) ? listings : []).map((stay) => stay._id)));
        }
      })
      .catch(() => {
        if (isActive) setFavoriteIds(new Set());
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  function updateFavorite(id, saved) {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (saved) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const countText = loading
    ? "Finding your next stay…"
    : compact && !collection && kind !== "Experience" && kind !== "Service"
      ? `${filteredStays.length} ${filteredStays.length === 1 ? "home" : "homes"}`
      : `${filteredStays.length} ${filteredStays.length === 1 ? "place" : "places"} to explore`;

  // Dates shown on every card: the date chosen in the search bar, or a trip starting in 3 days
  const nights = 5;
  const start = date ? new Date(`${date}T12:00:00`) : new Date(Date.now() + 3 * 86400000);
  const end = new Date(start.getTime() + nights * 86400000);
  const month = (value) => value.toLocaleDateString("en-US", { month: "short" });
  const tripLabel =
    month(start) === month(end)
      ? `${month(start)} ${start.getDate()} – ${end.getDate()}`
      : `${month(start)} ${start.getDate()} – ${month(end)} ${end.getDate()}`;

  return (
    <section className="listing-section" id={search || collection || kind ? "search-results-listings" : undefined}>
      {compact ? (
        <div className="results-bar">
          <h2 className="results-count-compact">{countText}</h2>
          <span className="all-fees-note">🏷️ Prices include all fees</span>
        </div>
      ) : (
        <div className="section-heading">
          <div>
            <p className="eyebrow">A little different, a lot memorable</p>
            <h1>{search ? "Search results" : title}</h1>
          </div>

          <span className="results-count">{countText}</span>
        </div>
      )}

      {error && <div className="notice error-notice">{error}</div>}

      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: compact ? 6 : 8 }, (_, index) => (
            <div className="skeleton-card" key={index} />
          ))}
        </div>
      ) : filteredStays.length > 0 ? (
        <div className="listing-grid">
          {filteredStays.map((stay) => (
            <StayCard
              key={stay._id}
              stay={stay}
              isFavorite={favoriteIds.has(stay._id)}
              onFavoriteChange={updateFavorite}
              onHover={onHover}
              trip={compact && (stay.kind === "Stay" || stay.kind === "Hotel") ? { nights, label: tripLabel } : undefined}
            />
          ))}
        </div>
      ) : showEmptyState && !error ? (
        <div className="empty-state">
          <span>⌕</span>
          <h2>{filters.length ? "No stays match these filters" : "No stays found just yet"}</h2>
          <p>
            {filters.length
              ? "Remove one or more filters to see more places."
              : "Try a different search, or be the first to share a special place."}
          </p>
        </div>
      ) : null}
    </section>
  );
}
