
import { useEffect, useRef, useState } from "react";
import { Menu, Search, UserRound, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NavIllustration from "./NavIllustration.jsx";

const sections = [
  { label: "All", to: "/all", illustration: "all" },
  { label: "Homes", to: "/homes", illustration: "homes" },
  { label: "Hotels", to: "/hotels", illustration: "hotels" },
  { label: "Experiences", to: "/experiences", illustration: "experiences" },
  { label: "Services", to: "/services", illustration: "services" },
];

const suggestedDestinations = [
  { city: "Islamabad", country: "Pakistan", description: "Guests interested in Lahore also looked here", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/ef838e5e-251c-424a-85f8-cfb218717f75.png?im_w=120" },
  { city: "Rawalpindi", country: "Pakistan", description: "Guests interested in Lahore also looked here", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/4f56182b-d556-45ec-95bb-067be0ba62fe.png?im_w=120" },
  { city: "Murree", country: "Pakistan", description: "For a trip abroad", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/0fdfef7b-76ab-4930-b90e-a19a478d6660.png?im_w=120" },
  { city: "Nathia Gali", country: "Pakistan", description: "A hidden gem", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/c23eddbf-55e4-4e3d-ab64-85c11f551be3.png?im_w=120" },
  { city: "Faisalabad", country: "Pakistan", description: "Near you", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/475c6daa-9169-4cdf-8b05-6886e8757a67.png?im_w=120" },
  { city: "Karachi", country: "Pakistan", description: "Guests interested in Lahore also looked here", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/41c7cc00-da07-4f52-8be9-44794f3f1450.png?im_w=120" },
  { city: "Dubai", country: "United Arab Emirates", description: "Popular beach destination", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/c98f58bf-8512-43e3-af54-6c1f0b2c8a23.png?im_w=120" },
  { city: "Bhurban", country: "Pakistan", description: "Guests interested in Lahore also looked here", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/b0d5d3cc-f5d3-4a60-a0cb-0172860decd2.png?im_w=120" },
  { city: "Kuala Lumpur", country: "Malaysia", description: "For sights like Petronas Twin Towers", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/fa207fff-f2dc-4bf9-aa7c-d741bf9f621c.png?im_w=120" },
  { city: "Abbottabad", country: "Pakistan", description: "For a trip abroad", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/8f39e6df-a319-4a1e-834e-60cd0230b643.png?im_w=120" },
  { city: "Al Madinah al Munawwarah", country: "Saudi Arabia", description: "For sights like Al-Masjid an-Nabawi", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/e6abaebf-f910-42e2-b891-d8f262b6ee1d.png?im_w=120" },
  { city: "Jeddah", country: "Saudi Arabia", description: "For its stunning architecture", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/5d2ff9e9-9e15-45b9-bfb2-d3f192198eca.png?im_w=120" },
  { city: "Baku", country: "Azerbaijan", description: "For its bustling nightlife", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/a2d4538a-cccd-44cb-a2fd-89bcffd12f32.png?im_w=120" },
  { city: "Karachi Central", country: "Pakistan", description: "For a trip abroad", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/b0d5d3cc-f5d3-4a60-a0cb-0172860decd2.png?im_w=120" },
  { city: "Peshawar", country: "Pakistan", description: "A hidden gem", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/8f39e6df-a319-4a1e-834e-60cd0230b643.png?im_w=120" },
  { city: "Istanbul", country: "Türkiye", description: "For sights like Galata Tower", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/2a08b260-09ac-40f4-9580-7d418cd0bb2f.png?im_w=120" },
  { city: "London", country: "United Kingdom", description: "For its top-notch dining", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/43b6be43-d8d8-4a97-9c17-e52b6e65ce66.png?im_w=120" },
  { city: "Riyadh", country: "Saudi Arabia", description: "For a trip abroad", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/ed75c050-042b-44ba-a991-54044d93a91b.png?im_w=120" },
  { city: "Casablanca", country: "Morocco", description: "For sights like Hassan II Mosque", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/6d1d155d-c7db-49d7-87b2-3864332d1487.png?im_w=120" },
  { city: "Bangkok", country: "Thailand", description: "For its bustling nightlife", image: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/2ddfa4b7-298d-4c4a-95d1-dacb51ac741a.png?im_w=120" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();

  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [destinationSuggestionsOpen, setDestinationSuggestionsOpen] = useState(false);
  const destinationSearchRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isServicePage = location.pathname === "/services";

  const activeSection = location.pathname === "/all"
    ? "/all"
    : location.pathname.startsWith("/services")
    ? "/services"
    : location.pathname.startsWith("/hotels")
    ? "/hotels"
    : location.pathname.startsWith("/experiences")
    ? "/experiences"
    : location.pathname.startsWith("/homes") ||
      location.pathname.startsWith("/stays") ||
      location.pathname.startsWith("/explore")
    ? "/homes"
    : null;

  useEffect(() => {
    function closeSuggestions(event) {
      if (!destinationSearchRef.current?.contains(event.target)) {
        setDestinationSuggestionsOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setDestinationSuggestionsOpen(false);
    }

    document.addEventListener("pointerdown", closeSuggestions);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeSuggestions);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

function submitSearch(event) {
  event.preventDefault();

  const text = destination.trim();
  const params = new URLSearchParams();

  if (isServicePage) {
    // Services have their own results: the services list + map (empty "Where" = all services)
    params.set("kind", "Service");
    params.set("title", text ? `Services in ${text}` : "Services");
    if (text) params.set("search", text);
    if (type) params.set("service", type);
  } else {
    const searchLocation = text || "Faisalabad";
    params.set("where", searchLocation);
    params.set("search", searchLocation);
    if (type) params.set("guests", type);
  }
  if (date) params.set("date", date);

  navigate(`/explore?${params.toString()}`);

  setMenuOpen(false);
  setDestinationSuggestionsOpen(false);
}

  function chooseDestination(value) {
    setDestination(value);
    setDestinationSuggestionsOpen(false);
      if (!isServicePage) {
        navigate(`/explore?search=${encodeURIComponent(value)}`);
      }
    }

  function changeSection(section) {
    setType("");
    setDate("");
    setMenuOpen(false);
    navigate(section.to);
  }

  function logout() {
    signOut();
    setMenuOpen(false);
    navigate("/");
  }

  // The date input is invisible and sits on top of "Add dates": open the calendar when it is clicked.
  function openDatePicker(event) {
    const input = event.currentTarget;

    try {
      if (typeof input.showPicker === "function") input.showPicker();
    } catch {
      // some browsers only allow showPicker() right after a click; the normal date field still works
    }
  }

  return (
    <header className="site-header">

      {/* Airbnb Brand */}
      <Link to="/" className="brand bnb-brand" aria-label="The bnb home">
        <img src="/bnb-logo.svg" alt="" className="bnb-logo" />
        <span className="bnb-name">The bnb</span>
      </Link>

      {/* Categories */}
      <nav className="primary-nav" aria-label="Explore The bnb">
        {sections.map(({ label, to, illustration }) => (
          <button
            className={`primary-nav-link${
              activeSection === to ? " active" : ""
            }`}
            key={to}
            onClick={() => changeSection({ to })}
            type="button"
            aria-current={activeSection === to ? "page" : undefined}
          >
            <NavIllustration type={illustration} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Account Actions */}
      <div className="nav-actions">
        <Link
          className="host-link"
          to={user ? "/host/new" : "/register"}
        >
          Become a host
        </Link>

        <button
          className="profile-button"
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open account menu"
        >
          {menuOpen ? (
            <X size={19} />
          ) : (
            <>
              <Menu size={18} />
              <UserRound size={19} />
            </>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <form
        className={`nav-search${isServicePage ? " service-search" : ""}`}
        role="search"
        onSubmit={submitSearch}
      >
        <div
          className="destination-search-wrap"
          ref={destinationSearchRef}
          onClick={() => setDestinationSuggestionsOpen(true)}
        >
          <label className="search-field destination-field">
            <span>Where</span>
            <input
              aria-label="Search destinations"
              value={destination}
              onFocus={() => setDestinationSuggestionsOpen(true)}
              onChange={(event) => {
                setDestination(event.target.value);
                setDestinationSuggestionsOpen(true);
              }}
              placeholder="Search destinations"
              aria-expanded={destinationSuggestionsOpen}
              aria-controls="destination-suggestions"
              autoComplete="off"
            />
          </label>
          {destinationSuggestionsOpen && (
            <div className="destination-suggestions" id="destination-suggestions">
              {!destination.trim() && (
                <>
                  <p className="destination-suggestions-heading">Recent searches</p>
                  <button className="destination-suggestion" type="button" onClick={() => chooseDestination("Lahore")}>
                    <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-1/original/c0d7073d-12cf-4674-ba28-2b6c38cae3fc.png?im_w=120" alt="" />
                    <span><strong>Lahore</strong><small>Nov 6 – 8 · Nov 6 – 8</small></span>
                  </button>
                </>
              )}
              <p className="destination-suggestions-heading">Suggested destinations</p>
              {!destination.trim() && (
                <button className="destination-suggestion" type="button" onClick={() => chooseDestination("Lahore")}>
                  <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-hawaii-autosuggest-destination-icons-2/original/ea5e5ee3-e9d8-48a1-b7e9-1003bf6fe850.png?im_w=120" alt="" />
                  <span><strong>Nearby</strong><small>Find what’s around you</small></span>
                </button>
              )}
              {suggestedDestinations
                .filter(({ city, country }) => !destination.trim() || `${city}, ${country}`.toLowerCase().includes(destination.trim().toLowerCase()))
                .map(({ city, country, description, image }) => (
                  <button className="destination-suggestion" type="button" key={city} onClick={() => chooseDestination(city)}>
                    <img src={image} alt="" />
                    <span><strong>{city}, {country}</strong><small>{description}</small></span>
                  </button>
                ))}
              {destination.trim() && !suggestedDestinations.some(({ city, country }) => `${city}, ${country}`.toLowerCase().includes(destination.trim().toLowerCase())) && (
                <p className="destination-suggestions-empty">No suggested destinations. Press Search to find stays.</p>
              )}
            </div>
          )}
        </div>

        <span className="nav-search-divider" aria-hidden="true" />
        
<label className={`search-field date-field${date ? " has-date" : ""}`}>
  <span>When</span>

  <span className="date-display">
    {date
      ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Add dates"}
  </span>

  <input
    className="date-picker-input"
    type="date"
    aria-label="Choose a date"
    value={date}
    min={new Date().toLocaleDateString("en-CA")}
    onChange={(event) => setDate(event.target.value)}
    onClick={openDatePicker}
    onFocus={openDatePicker}
  />
</label>

        <span className="nav-search-divider" aria-hidden="true" />

        <label className="search-field type-field">
          <span>{isServicePage ? "Type of service" : "Who"}</span>

          {isServicePage ? (
            <select
              aria-label="Choose a service"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">Add service</option>
              <option value="chef">Private chef</option>
              <option value="photography">Photography</option>
              <option value="wellness">Wellness</option>
              <option value="tours">Local tours</option>
            </select>
          ) : (
            <select
              aria-label="Number of guests"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">Add guests</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map((guest) => (
                <option value={guest} key={guest}>
                  {guest} {guest === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          )}
        </label>

        <button type="submit" aria-label="Search">
          <Search size={19} />
          <span>Search</span>
        </button>
      </form>

      {/* Account Menu */}
      {menuOpen && (
        <div className="account-menu">
          {user ? (
            <>
              <span className="menu-greeting">
                Hi, {user.name.split(" ")[0]}
              </span>

              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>

              <Link to="/trips" onClick={() => setMenuOpen(false)}>
                My trips
              </Link>

              <Link to="/favorites" onClick={() => setMenuOpen(false)}>
                Wish list
              </Link>

              {user.isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}

              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Log in
              </Link>

              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>

              <span className="menu-rule" />

              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Host a stay
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
