
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  DollarSign,
  Heart,
  House,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { api, getErrorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StayCard from "../components/StayCard.jsx";
import { ErrorState, LoadingState } from "../components/PageStates.jsx";

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboard, ownListings, hostReservations, earningsData, myTrips] =
        await Promise.all([
          api("/users/me"),
          api("/users/me/listings"),
          api("/bookings/host"),
          api("/bookings/host/earnings"),
          api("/bookings"),
        ]);

      setTrips(myTrips.bookings || []);
      setStats(dashboard.stats);
      setListings(ownListings.listings);
      setHostBookings(hostReservations.bookings);
      setEarnings(earningsData.totalEarnings);
      setConfirmedBookings(earningsData.confirmedBookings);

    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function deleteListing(id) {
    if (
      !window.confirm(
        "Delete this stay? Its existing reservations will also be removed."
      )
    )
      return;

    try {
      await api(`/listings/${id}`, { method: "DELETE" });

      setListings((current) =>
        current.filter((stay) => stay._id !== id)
      );

      setStats((current) => ({
        ...current,
        listings: Math.max(0, current.listings - 1),
      }));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function cancelTrip(id) {
    setError("");

    try {
      await api(`/bookings/${id}/cancel`, { method: "PATCH" });
      setTrips((current) =>
        current.map((trip) => (trip._id === id ? { ...trip, status: "cancelled" } : trip))
      );
      setStats((current) => ({ ...current, bookings: Math.max(0, current.bookings - 1) }));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function updateBookingStatus(id, status) {
    setError("");

    try {
      const { booking } = await api(`/bookings/host/${id}/status`, {
        method: "PATCH",
        body: { status },
      });

      setHostBookings((current) =>
        current.map((item) => (item._id === id ? booking : item))
      );

      const earningsData = await api("/bookings/host/earnings");
      setEarnings(earningsData.totalEarnings);
      setConfirmedBookings(earningsData.confirmedBookings);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  if (loading) return <LoadingState label="Loading your dashboard…" />;

  if (error)
    return <ErrorState message={error} onRetry={loadDashboard} />;

  return (
    <main className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">Your bnb</p>
          <h1>Good to see you, {user.name.split(" ")[0]}.</h1>
          <p>
            Everything you need for your next great stay, all in one place.
          </p>
        </div>

        <Link className="primary-button" to="/host/new">
          <Plus size={17} /> Add a stay
        </Link>
      </section>

      <div className="dashboard-stats">
        <StatCard icon={<House />} label="Your stays" value={stats.listings} />
        <StatCard
          icon={<CalendarDays />}
          label="Upcoming trips"
          value={stats.bookings}
        />
        <StatCard
          icon={<Heart />}
          label="Wish list"
          value={stats.favorites}
        />
        <StatCard
          icon={<DollarSign />}
          label="Total earnings"
          value={`$${earnings.toLocaleString()}`}
        />

      </div>

      <section className="dashboard-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">Your trips</p>
            <h2>Stays you booked</h2>
          </div>
          <Link className="outline-button" to="/trips">
            See all trips
          </Link>
        </div>

        {trips.length ? (
          <div className="booking-list">
            {trips.slice(0, 6).map((trip) => (
              <article className="trip-card" key={trip._id}>
                <img src={trip.listing?.image} alt={trip.listing?.title || "Booked stay"} />

                <div className="trip-info">
                  <p className="eyebrow">
                    {trip.status === "confirmed"
                      ? "Reservation confirmed"
                      : trip.status === "pending"
                        ? "Waiting for the host to confirm"
                        : "Reservation cancelled"}
                  </p>
                  <h2>
                    <Link to={trip.listing?._id ? `/stays/${trip.listing._id}` : "/trips"}>
                      {trip.listing?.title || "Stay"}
                    </Link>
                  </h2>
                  <p>{trip.listing?.location}</p>
                  <p>
                    {new Date(trip.checkIn).toLocaleDateString()} – {new Date(trip.checkOut).toLocaleDateString()} ·{" "}
                    {trip.guests} guests
                  </p>
                  <strong>Total ${trip.totalPrice}</strong>
                </div>

                {trip.status !== "cancelled" && (
                  <button className="outline-button cancel-button" type="button" onClick={() => cancelTrip(trip._id)}>
                    Cancel reservation
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No trips yet</h3>
            <p>Book a stay and it will show up here.</p>
            <Link to="/explore" className="primary-button">
              Explore stays
            </Link>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">Your hosting</p>
            <h2>Your stays</h2>
          </div>

          <Link to="/host/new" className="inline-link">
            Create a stay <ArrowRight size={15} />
          </Link>
        </div>

        {listings.length ? (
          <div className="listing-grid">
            {listings.map((stay) => (
              <div className="managed-stay" key={stay._id}>
                <StayCard stay={stay} />

                <div className="managed-stay-actions">
                  <Link
                    to={`/host/${stay._id}/edit`}
                    className="outline-button"
                  >
                    <Pencil size={14} /> Edit
                  </Link>

                  <button
                    className="outline-button"
                    type="button"
                    onClick={() => deleteListing(stay._id)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <House size={24} />

            <div>
              <h3>Your hosting journey starts here</h3>
              <p>
                Share your space with travelers searching for something special.
              </p>
            </div>

            <Link to="/host/new" className="outline-button">
              List your place <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>



      <section className="dashboard-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">Your hosting</p>
            <h2>Guest reservations</h2>
          </div>

          <span>{hostBookings.length} bookings</span>
        </div>

        {hostBookings.length ? (
          <div className="booking-list">
            {hostBookings.map((booking) => (
              <article className="trip-card" key={booking._id}>
                <img
                  src={booking.listing?.image}
                  alt={booking.listing?.title || "Booked stay"}
                />

                <div className="trip-info">
                  <p className="eyebrow">
                    {booking.status === "pending"
                      ? "Pending"
                      : booking.status === "confirmed"
                        ? "Confirmed"
                        : "Cancelled"}
                  </p>

                  <h2>{booking.listing?.title || "Stay"}</h2>
                  <p>Guest: {booking.guest?.name || "Guest"}</p>
                  <p>Email: {booking.guest?.email || "Email unavailable"}</p>
                  <p>{booking.listing?.location}</p>

                  <p>
                    {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>

                  <p>{booking.guests} guests</p>
                  <strong>Total: ${booking.totalPrice}</strong>

                  {booking.status === "pending" && (
                    <div className="managed-stay-actions">
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => updateBookingStatus(booking._id, "confirmed")}
                      >
                        Confirm booking
                      </button>

                      <button
                        className="outline-button"
                        type="button"
                        onClick={() => updateBookingStatus(booking._id, "cancelled")}
                      >
                        Cancel booking
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CalendarDays size={30} />
            <h2>No guest reservations yet</h2>
            <p>
              When guests book your stays, their reservations will appear here.
            </p>
          </div>
        )}
      </section>



      <section className="dashboard-links">
        <Link to="/trips">
          <CalendarDays />
          <span>
            <strong>Manage your trips</strong>
            <small>Check your bookings and travel plans</small>
          </span>
          <ArrowRight />
        </Link>

        <Link to="/favorites">
          <Heart />
          <span>
            <strong>See your wish list</strong>
            <small>All the stays you’ve saved in one place</small>
          </span>
          <ArrowRight />
        </Link>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function FavoritesPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);

    api("/users/me/favorites")
      .then(({ listings: saved }) => setListings(saved))
      .catch((requestError) =>
        setError(getErrorMessage(requestError))
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState label="Loading your wish list…" />;

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <main className="dashboard-page">
      <div className="section-title">
        <div>
          <p className="eyebrow">Your little black book</p>
          <h1>Wish list</h1>
        </div>
        <Heart />
      </div>

      {listings.length ? (
        <div className="listing-grid">
          {listings.map((stay) => (
            <StayCard
              key={stay._id}
              stay={stay}
              isFavorite
              onFavoriteChange={(id, saved) => {
                if (!saved) {
                  setListings((current) =>
                    current.filter((item) => item._id !== id)
                  );
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={30} />
          <h2>Your wish list is ready for inspiration</h2>
          <p>
            Tap the heart on a stay you love, and you’ll find it here.
          </p>
          <Link className="primary-button" to="/explore">
            Explore stays
          </Link>
        </div>
      )}
    </main>
  );
}

export function TripsPage() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    location.state?.booked
      ? "Your stay is reserved. You can see the details below."
      : ""
  );

  const load = useCallback(() => {
    setLoading(true);

    api("/bookings")
      .then(({ bookings: upcoming }) => setBookings(upcoming))
      .catch((requestError) =>
        setError(getErrorMessage(requestError))
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancelBooking(id) {
    setError("");

    try {
      await api(`/bookings/${id}/cancel`, { method: "PATCH" });

      setBookings((current) =>
        current.map((booking) =>
          booking._id === id
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      setNotice("Your reservation was cancelled.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  if (loading) return <LoadingState label="Loading your trips…" />;

  return (
    <main className="dashboard-page">
      <p className="eyebrow">The good part is getting there</p>
      <h1>Your trips</h1>

      {notice && <div className="notice success-notice">{notice}</div>}
      {error && <div className="notice error-notice">{error}</div>}

      {bookings.length ? (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="trip-card" key={booking._id}>
              <img
                src={booking.listing?.image}
                alt={booking.listing?.title || "Booked stay"}
              />

              <div className="trip-info">
                <p className="eyebrow">
                  {booking.status === "confirmed"
                    ? "Reservation confirmed"
                    : booking.status === "pending"
                      ? "Waiting for the host to confirm"
                      : "Reservation cancelled"}
                </p>

                <h2>{booking.listing?.title || "Stay"}</h2>
                <p>{booking.listing?.location}</p>

                <p>
                  {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                  {new Date(booking.checkOut).toLocaleDateString()} ·{" "}
                  {booking.guests} guests
                </p>

                <strong>Total ${booking.totalPrice}</strong>
              </div>

              {booking.status !== "cancelled" && (
                <button
                  className="outline-button cancel-button"
                  onClick={() => cancelBooking(booking._id)}
                >
                  Cancel reservation
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CalendarDays size={32} />
          <h2>Your next adventure is waiting</h2>
          <p>
            Once you book a stay, you’ll find all your trip details right here.
          </p>
          <Link to="/explore" className="primary-button">
            Explore stays
          </Link>
        </div>
      )}
    </main>
  );
}
