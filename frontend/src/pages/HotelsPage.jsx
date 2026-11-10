import { ArrowLeft, ArrowRight, Award, Luggage, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";
import TravelInspiration from "../components/TravelInspiration.jsx";
import HotelsCarousel from "../components/HotelsCarousel.jsx";

export default function HotelsPage() {
  return (
    <main className="hotels-page">
      <HotelsCarousel />
      <section className="hotel-promo-grid" aria-label="Explore hotel and home offers">
        <article className="hotel-promo-card">
          <span className="hotel-promo-icon hotel-promo-luggage"><Luggage size={43} strokeWidth={1.5} /></span>
          <div>
            <h2>Get 15% Airbnb credit at featured hotels in Hong Kong</h2>
            <Link to="/hotels?city=Hong%20Kong" className="hotel-promo-link">Browse hotels</Link>
          </div>
        </article>
        <article className="hotel-promo-card">
          <span className="hotel-promo-icon hotel-promo-map"><MapPinned size={43} strokeWidth={1.5} /></span>
          <div>
            <h2>Check out weekend getaways nearby</h2>
            <Link to="/explore?search=Hong%20Kong" className="hotel-promo-link">Browse homes</Link>
          </div>
        </article>
        <article className="hotel-promo-card">
          <span className="hotel-promo-icon hotel-promo-award"><Award size={43} strokeWidth={1.5} /></span>
          <div>
            <h2>Discover Guest favorites</h2>
            <p>The most loved homes on Airbnb, near you</p>
            <Link to="/explore?search=Hong%20Kong" className="hotel-promo-link">Browse homes</Link>
          </div>
        </article>
      </section>
      <HotelsCarousel destination="New York" />
      <HotelsCarousel destination="Los Angeles" />
      <HotelsCarousel destination="Paris" />
      <HotelsCarousel destination="Rome" />
      <HotelsCarousel destination="San Francisco" />
      <HotelsCarousel destination="London" />
      <HotelsCarousel destination="Madrid" />
      <TravelInspiration />
    </main>
  );
}
