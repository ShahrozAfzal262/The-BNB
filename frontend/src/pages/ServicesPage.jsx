import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { exploreLink, useListings } from "../hooks/useListings.js";
import { FALLBACK_IMAGE, firstImage, imageUrl } from "../utils/images.js";
import "../styles/Services.css";

// The services themselves live in the database (npm run seed in /backend).
const serviceCities = ["Kuala Lumpur", "Los Angeles", "London"];
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const inspirationTabs = {
  Popular: [
    ["Cincinnati", "Vacation rentals"], ["Madrid", "Apartment rentals"],
    ["Richmond", "Vacation rentals"], ["Dubai", "Condo rentals"],
    ["Oahu", "House rentals"], ["Raleigh", "Villa rentals"],
    ["Cleveland", "Villa rentals"], ["Pittsburgh", "House rentals"],
    ["Kauai", "Condo rentals"], ["London", "Monthly Rentals"],
    ["Milan", "Monthly Rentals"], ["Ocean City", "House rentals"],
    ["Dublin", "Monthly Rentals"], ["Philadelphia", "Vacation rentals"],
    ["Wilmington", "Monthly Rentals"], ["Key West", "Monthly Rentals"],
    ["Gulf Shores", "Cottage rentals"],
  ],
  "Arts & culture": [
    ["Paris", "Apartment rentals"], ["Rome", "Vacation rentals"],
    ["Florence", "Holiday rentals"], ["New York", "Apartment rentals"],
    ["London", "Monthly rentals"], ["Barcelona", "Apartment rentals"],
  ],
  Beach: [
    ["Miami Beach", "Beach house rentals"], ["Malibu", "Beach house rentals"],
    ["Gold Coast", "Holiday rentals"], ["Oahu", "Beach rentals"],
    ["San Diego", "Vacation rentals"], ["Phuket", "Villa rentals"],
  ],
  Mountains: [
    ["Aspen", "Cabin rentals"], ["Banff", "Vacation rentals"],
    ["Chamonix", "Chalet rentals"], ["Lake Tahoe", "Cabin rentals"],
    ["Queenstown", "Holiday rentals"], ["Interlaken", "Vacation rentals"],
  ],
  Outdoors: [
    ["Yosemite", "Cabin rentals"], ["Boulder", "Vacation rentals"],
    ["Bend", "House rentals"], ["Sedona", "Villa rentals"],
    ["Whistler", "Chalet rentals"], ["Moab", "Vacation rentals"],
  ],
  "Things to do": [
    ["London", "Holiday rentals"], ["Tokyo", "Apartment rentals"],
    ["New York", "Vacation rentals"], ["Sydney", "Apartment rentals"],
    ["Singapore", "Condo rentals"], ["Amsterdam", "House rentals"],
  ],
  "Travel tips & inspiration": [
    ["Weekend getaways", "Vacation ideas"], ["Family trips", "Travel inspiration"],
    ["City breaks", "Travel inspiration"], ["Nature escapes", "Travel inspiration"],
  ],
  "Airbnb-friendly apartments": [
    ["New York", "Apartment rentals"], ["Los Angeles", "Apartment rentals"],
    ["London", "Apartment rentals"], ["Paris", "Apartment rentals"],
  ],
};

function ServiceCard({ item }) {
  const unit = item.priceUnit === "group" ? "group" : "guest";

  return (
    <article className="service-card">
      <Link className="service-image-wrap" to={`/stays/${item._id}`} aria-label={item.title}>
        <img
          className="service-image"
          src={imageUrl(firstImage(item), 600)}
          alt={item.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {item.badge && <span className="service-popular">{item.badge}</span>}
      </Link>

      <h3 className="service-title">
        <Link to={`/stays/${item._id}`}>{item.title}</Link>
      </h3>

      <p className="service-price">
        From <strong>${item.price}</strong> / {unit}
      </p>

      {item.minimumSpend && <p className="service-minimum">Minimum ${item.minimumSpend} to book</p>}

      {item.reviews > 0 && (
        <div className="service-rating">
          <Star size={13} fill="currentColor" />
          <span>{Number(item.rating).toFixed(2)}</span>
          <span className="service-rating-label">out of 5 average rating</span>
        </div>
      )}
    </article>
  );
}

function ServiceRow({ city }) {
  const sliderRef = useRef(null);
  const collection = `services-${slug(city)}`;
  const { listings, loading, error } = useListings({ collection });
  const exploreTo = exploreLink({ collection, title: `Services in ${city}` });

  function slide(direction) {
    sliderRef.current?.scrollBy({
      left: direction * sliderRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section className="services-city-section">
      <div className="services-row-heading">
        <div>
          <h2 className="services-title-row">
            Services in {city}
            <Link className="services-heading-arrow" to={exploreTo} aria-label={`See all services in ${city}`}>
              <ArrowRight size={20} />
            </Link>
          </h2>
          <p>{loading ? "Loading…" : `${listings.length} services`}</p>
        </div>

        <div className="services-arrows">
          <button type="button" onClick={() => slide(-1)} aria-label="Previous services">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => slide(1)} aria-label="Next services">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="services-slider" ref={sliderRef}>
        {!loading && error && <p>{error}</p>}
        {listings.map((item) => (
          <ServiceCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

function Inspiration() {
  const tabs = Object.keys(inspirationTabs);
  const [activeTab, setActiveTab] = useState("Popular");
  const [showAll, setShowAll] = useState(false);
  const places = inspirationTabs[activeTab] || [];
  const visiblePlaces = showAll ? places : places.slice(0, 17);

  return (
    <section className="services-inspiration">
      <h2>Inspiration for future getaways</h2>

      <div className="inspiration-tabs" role="tablist" aria-label="Inspiration categories">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              setShowAll(false);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="inspiration-city-grid">
        {visiblePlaces.map(([city, rental]) => (
          <a
            href={`/inspiration/popular?city=${encodeURIComponent(city)}`}
            className="inspiration-city"
            key={`${city}-${rental}`}
          >
            <strong>{city}</strong>
            <span>{rental}</span>
          </a>
        ))}
      </div>

      {places.length > 17 && (
        <button
          className="inspiration-show-more"
          type="button"
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? "Show less ︿" : "Show more ﹀"}
        </button>
      )}
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="services-page">
      {serviceCities.map((city) => (
        <ServiceRow key={city} city={city} />
      ))}

      <Inspiration />
    </main>
  );
}
