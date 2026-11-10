import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { categoryHero } from "../components/TravelInspiration.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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

function categorySlug(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function InspirationPage() {
  const { category: categoryParam } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const category = categories.find((item) => categorySlug(item) === categoryParam) || "Popular";
  const hero = categoryHero[category];
  const city = searchParams.get("city")?.trim() || hero.city;
  const countryByCity = {
    Paris: "France",
    "Goose Rocks Beach": "Maine, United States",
    "Cabo San Lucas": "Mexico",
    "Nye Beach": "Oregon, United States",
    "Porto da Barra Beach": "Brazil",
    "Berawa Beach": "Bali, Indonesia",
    Sanur: "Bali, Indonesia",
    "Playa Cocles": "Costa Rica",
    "Sanibel Island": "Florida, United States",
    "La Jolla Shores Beach": "California, United States",
    "Armacao dos Buzios": "Brazil",
    "Padang Padang Beach": "Bali, Indonesia",
    "Punta Rucia": "Dominican Republic",
    "Pipa Beach": "Brazil",
    "Alki Beach": "Washington, United States",
    "Coxen Hole": "Honduras",
    "Sarasota Beach": "Florida, United States",
    "Zipolite, Oaxaca": "Mexico",
    "Lake Tahoe": "United States",
    Calgary: "Canada",
  };
  const country = countryByCity[city] || hero.country;
  const title = hero.title.replace(hero.city, city);
  const imageHost = hero.premium ? "https://plus.unsplash.com" : "https://images.unsplash.com";

  function searchStays(event) {
    event.preventDefault();
    const params = new URLSearchParams({ search: city });
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    navigate(`/explore?${params.toString()}`);
  }

  return (
    <main className="inspiration-landing">
      <header className="inspiration-landing-header">
        <Link to="/" className="inspiration-landing-brand" aria-label="Airbnb home">
          <img src="/airbnb-logo.png" alt="Airbnb" />
        </Link>
        <nav className="inspiration-landing-actions" aria-label="Account">
          <Link to={user ? "/host/new" : "/register"}>Become a host</Link>
          <Link to={user ? "/dashboard" : "/login"}>{user ? "Account" : "Log in"}</Link>
        </nav>
      </header>

      <section className="inspiration-hero" aria-label={`${category} getaway search`}>
        <img
          className="inspiration-hero-image"
          src={`${imageHost}/${hero.image}?auto=format&fit=crop&w=1800&h=1000&q=85`}
          alt={`${city}, ${country}`}
        />
        <form className="inspiration-search-card" onSubmit={searchStays}>
          <h1>{title}</h1>
          <p>{hero.description}</p>
          <label className="inspiration-location-field">
            <span>Location</span>
            <strong>{city}, {country}</strong>
          </label>
          <div className="inspiration-date-fields">
            <label>
              <span><CalendarDays size={15} /> Check in</span>
              <input
                aria-label="Check in"
                type="date"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
              />
            </label>
            <label>
              <span><CalendarDays size={15} /> Check out</span>
              <input
                aria-label="Check out"
                type="date"
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
              />
            </label>
          </div>
          <button type="submit" className="inspiration-search-button">
            <Search size={19} /> Search
          </button>
        </form>
      </section>
    </main>
  );
}
