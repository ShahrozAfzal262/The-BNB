import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Feather, Flame, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { exploreLink, useListings } from "../hooks/useListings.js";
import { FALLBACK_IMAGE, firstImage, imageUrl } from "../utils/images.js";
import "../styles/Experiences.css";

/* The experiences themselves live in the database (npm run seed in /backend).
   Only the row titles are defined here. */
const originals = {
  id: "originals",
  title: "Airbnb Originals",
  subtitle: "Hosted by the world’s most interesting people",
  badge: "Original",
};

const citySections = [
  { id: "kuala-lumpur", title: "Experiences in Kuala Lumpur", badge: "Trending" },
  { id: "paris", title: "Experiences in Paris", badge: "Trending" },
  { id: "london", title: "Experiences in London", badge: "Trending" },
  { id: "sao-paulo", title: "Experiences in Sao Paulo", badge: "Trending" },
];

function priceText(item) {
  if (item.comingSoon) return "Coming soon";
  const rating = item.rating && item.reviews ? ` · ★ ${Number(item.rating).toFixed(2)}` : "";
  if (!item.price) return `Free${rating}`;
  return `From $${item.price} / guest${rating}`;
}

/* ---------- Experience Row ---------- */
function ExperienceRow({ section, isMain = false }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { ids, toggle } = useFavorites();
  const { listings: items, loading, error } = useListings({ collection: `experiences-${section.id}` });
  const exploreTo = exploreLink({ collection: `experiences-${section.id}`, title: section.title });

  const Heading = isMain ? "h1" : "h3";
  const BadgeIcon = section.badge === "Original" ? Feather : Flame;

  function updateScrollControls() {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 1);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }

  useEffect(() => {
    updateScrollControls();
    window.addEventListener("resize", updateScrollControls);
    return () => window.removeEventListener("resize", updateScrollControls);
  }, [items]);

  function scroll(direction) {
    const rail = railRef.current;
    rail?.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="experiences-section" aria-label={section.title}>
      <div className="experiences-heading">
        <div className="experiences-title">
          <Heading>{section.title}</Heading>

          <Link className="experience-heading-arrow" to={exploreTo} aria-label={`See all: ${section.title}`}>
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="experiences-controls">
          <button type="button" onClick={() => scroll(-1)} disabled={!canScrollLeft} aria-label="Show previous experiences">
            <ArrowLeft size={18} />
          </button>

          <button type="button" onClick={() => scroll(1)} disabled={!canScrollRight} aria-label="Show more experiences">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {section.subtitle && <p className="experiences-subtitle">{section.subtitle}</p>}

      <div className="experiences-rail" ref={railRef} onScroll={updateScrollControls}>
        {loading && <p>Loading experiences…</p>}
        {!loading && error && <p>{error}</p>}

        {items.map((item) => {
          const isFavorite = ids.has(item._id);

          return (
            <article className="experience-card" key={item._id}>
              <div className="experience-photo">
                <Link to={`/stays/${item._id}`} className="experience-photo-link" aria-label={item.title}>
                  <img
                    src={imageUrl(firstImage(item), 650)}
                    alt={item.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </Link>

                <span className="experience-original-badge">
                  <BadgeIcon size={15} /> {section.badge}
                </span>

                <button
                  className={`experience-favorite${isFavorite ? " is-favorite" : ""}`}
                  type="button"
                  onClick={() => toggle(item._id)}
                  aria-label={isFavorite ? `Remove ${item.title} from saved experiences` : `Save ${item.title}`}
                  aria-pressed={isFavorite}
                >
                  <Heart size={25} />
                </button>
              </div>

              <Link className="experience-title" to={`/stays/${item._id}`}>
                {item.title}
              </Link>

              <span className="experience-price">{priceText(item)}</span>
            </article>
          );
        })}

        {items.length > 0 && (
          <Link className="experience-see-all" to={exploreTo} aria-label={`See all: ${section.title}`}>
            <span className="see-all-stack" aria-hidden="true">
              {items.slice(0, 3).map((item, index) => (
                <img
                  key={item._id}
                  src={imageUrl(firstImage(item), 180)}
                  alt=""
                  loading="lazy"
                  style={{ "--stack-index": index }}
                />
              ))}
            </span>

            <strong>See all</strong>
          </Link>
        )}
      </div>
    </section>
  );
}

/* ---------- Inspiration for future getaways ---------- */
function Inspiration() {
  const [activeTab, setActiveTab] = useState("Popular");

  const tabs = [
    "Popular",
    "Arts & culture",
    "Outdoors",
    "Mountains",
    "Beaches",
    "Unique stays",
    "Categories",
  ];

  const inspirationData = {
    Popular: [
      ["Canmore", "Pet-friendly rentals"],
      ["Benalmádena", "Beachfront rentals"],
      ["Marbella", "Villa rentals"],
      ["Mijas", "House rentals"],
      ["Prescott", "Cabin rentals"],
      ["Scottsdale", "Apartment rentals"],
      ["Tucson", "Vacation rentals"],
      ["Jasper", "Cabin rentals"],
      ["Mountain View", "House rentals"],
      ["Devonport", "Holiday rentals"],
      ["Mallacoota", "Beach houses"],
      ["Ibiza", "Holiday rentals"],
    ],

    "Arts & culture": [
      ["Paris", "Apartment rentals"],
      ["London", "House rentals"],
      ["Rome", "Vacation rentals"],
      ["Florence", "Villa rentals"],
      ["Istanbul", "Apartment rentals"],
      ["Barcelona", "Holiday rentals"],
    ],

    Outdoors: [
      ["Banff", "Cabin rentals"],
      ["Lake Tahoe", "Vacation rentals"],
      ["Queenstown", "Holiday rentals"],
      ["Interlaken", "Chalet rentals"],
      ["Nathia Gali", "Mountain stays"],
      ["Murree", "Cabin rentals"],
    ],

    Mountains: [
      ["Murree", "Cabin rentals"],
      ["Nathia Gali", "Mountain stays"],
      ["Hunza", "Guest houses"],
      ["Skardu", "Vacation rentals"],
      ["Banff", "Cabin rentals"],
      ["Aspen", "Chalet rentals"],
    ],

    Beaches: [
      ["Karachi", "Beach houses"],
      ["Dubai", "Beachfront rentals"],
      ["Malibu", "Beach houses"],
      ["Miami", "Vacation rentals"],
      ["Bali", "Villa rentals"],
      ["Phuket", "Beachfront rentals"],
    ],

    "Unique stays": [
      ["Treehouses", "Unique stays"],
      ["Tiny homes", "Vacation rentals"],
      ["Cabins", "Nature stays"],
      ["Houseboats", "Waterfront stays"],
      ["Glamping", "Outdoor stays"],
      ["Castles", "Unique properties"],
    ],

    Categories: [
      ["Amazing views", "Vacation rentals"],
      ["Design", "Unique stays"],
      ["Countryside", "House rentals"],
      ["Luxury", "Villa rentals"],
      ["Historical homes", "Unique stays"],
      ["Lakefront", "Waterfront rentals"],
    ],
  };

  return (
    <section className="inspiration-section">
      <h2>Inspiration for future getaways</h2>

      <div className="inspiration-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="inspiration-grid">
        {inspirationData[activeTab].map(([place, rental]) => (
          <a
            href={`/explore?search=${encodeURIComponent(place)}`}
            className="inspiration-link"
            key={`${activeTab}-${place}`}
          >
            <strong>{place}</strong>
            <span>{rental}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Experiences Page ---------- */
export default function ExperiencesPage() {
  return (
    <main className="experiences-page">
      <ExperienceRow section={originals} isMain />

      <h2 className="experiences-next-heading">Popular with travelers from your area</h2>

      {citySections.map((section) => (
        <ExperienceRow key={section.id} section={section} />
      ))}

      {/* Inspiration comes after the last experience row */}
      <Inspiration />
    </main>
  );
}
