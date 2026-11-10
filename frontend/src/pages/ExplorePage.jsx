import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import StayGrid from "../components/StayGrid.jsx";
import ListingMap from "../components/ListingMap.jsx";

const searchFilters = [
  "Allows pets",
  "Free parking",
  "1+ bathrooms",
  "Kitchen",
  "Wi-Fi",
  "Self check-in",
  "Instant Book",
  "Air conditioning",
  "TV",
  "Free cancellation",
];

const categories = ["All stays", "Beachfront", "Cabins", "Design", "Countryside", "Pools", "Mountains", "City"];

// /explore                         -> all stays with category chips
// /explore?search=Dubai            -> list on the left, map on the right
// /explore?collection=bahria&title=...   (the arrow next to a row title)
// /explore?kind=Hotel&city=Paris         (the arrow next to a hotels row)
export default function ExplorePage() {
  const [params, setParams] = useSearchParams();

  const search = params.get("search") || params.get("where") || "";
  const collection = params.get("collection") || "";
  const kind = params.get("kind") || "";
  const city = params.get("city") || "";
  const customTitle = params.get("title") || "";

  const [activeFilters, setActiveFilters] = useState(() =>
    searchFilters.filter((filter) => {
      if (filter === "Free cancellation") return params.get("freeCancellation") === "true";
      if (filter === "Instant Book") return params.get("instantBook") === "true";
      return false;
    }),
  );
  const [category, setCategory] = useState("");
  const [mapStays, setMapStays] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const isResultsView = Boolean(search || collection || kind || city);
  const isActivity = /^(experiences|services)-/.test(collection) || kind === "Experience" || kind === "Service";
  const placeName = search || city;
  // A plain search shows homes and hotels; a row link (collection) shows exactly that row.
  const apiKind = collection ? kind : kind || "Stay,Hotel";

  const heading =
    customTitle ||
    (search ? `Homes in and around ${search}` : city ? `Stays in ${city}` : "Explore places to stay");

  function toggleFilter(filter) {
    setActiveFilters((current) => (current.includes(filter) ? [] : [filter]));
  }

  return (
    <>
      <section className="search-results-heading">
        <p className="eyebrow">{!isResultsView ? "The world, a little closer" : collection || kind ? "Collection" : "Search results"}</p>
        <h1>{heading}</h1>
        <p>{isResultsView ? "Browse the list on the left and see every place on the map." : "Every stay in the world is on the map. Zoom in, or pick a category."}</p>
      </section>

      <div className="explore-toolbar search-filter-toolbar">
        {!isActivity && (
          <details className="search-filter-menu">
            <summary className="category-chip filters-button">
              <SlidersHorizontal size={15} />
              Filters{activeFilters.length ? ` · ${activeFilters.length}` : ""}
            </summary>

            <div className="search-filter-popover">
              <div className="search-filter-popover-heading">
                <strong>Filters</strong>
                {activeFilters.length > 0 && (
                  <button className="text-button" type="button" onClick={() => setActiveFilters([])}>
                    Clear all
                  </button>
                )}
              </div>

              {searchFilters.map((filter) => (
                <label className="search-filter-option" key={filter}>
                  <input checked={activeFilters.includes(filter)} onChange={() => toggleFilter(filter)} type="checkbox" />
                  <span>{filter}</span>
                </label>
              ))}
            </div>
          </details>
        )}

        {!isResultsView && (
          <div className="category-list">
            {categories.map((label) => {
              const value = label === "All stays" ? "" : label;
              return (
                <button
                  className={`category-chip${category === value ? " active" : ""}`}
                  key={label}
                  onClick={() => setCategory(value)}
                  type="button"
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {!isActivity && (
          <div className="category-list">
            {searchFilters.map((filter) => (
              <button
                aria-pressed={activeFilters.includes(filter)}
                className={`category-chip${activeFilters.includes(filter) ? " active" : ""}`}
                key={filter}
                onClick={() => toggleFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {isResultsView && (
          <button className="text-button" type="button" onClick={() => setParams({})}>
            Clear search
          </button>
        )}
      </div>

      <div className="explore-results-layout">
        <div className="explore-listings-column">
          <StayGrid
            compact
            filters={activeFilters}
            search={search}
            kind={apiKind}
            collection={collection}
            city={collection ? "" : city}
            onLoaded={setMapStays}
            onHover={setHoveredId}
            date={params.get("date") || ""}
            category={isResultsView ? "" : category}
            limit={400}
            minGuests={Number(params.get("guests")) || 0}
          />
        </div>

        <aside className="explore-map-panel">
          <ListingMap stays={mapStays} hoveredId={hoveredId} placeName={placeName} />
        </aside>
      </div>
    </>
  );
}
