import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Plus,
  Star,
  Users,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getErrorMessage } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { ErrorState, LoadingState } from "../components/PageStates.jsx";
import ListingMap from "../components/ListingMap.jsx";
import { FALLBACK_IMAGE, imageUrl, listingImages } from "../utils/images.js";

const MAX_GUESTS = 12;

// Click anywhere in a date box (not only the small calendar icon) to open the calendar
function openPicker(event) {
  if (event.currentTarget.tagName !== "INPUT" && event.target.tagName === "INPUT") return;
  const input = event.currentTarget.tagName === "INPUT" ? event.currentTarget : event.currentTarget.querySelector("input");
  try {
    input?.showPicker?.();
  } catch {
    // some browsers only open the calendar from the icon
  }
}

const todayString = () => new Date().toISOString().slice(0, 10);
const dayString = (value) => new Date(value).toISOString().slice(0, 10);
const formatDay = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" });

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = Math.ceil((new Date(`${checkOut}T12:00:00`) - new Date(`${checkIn}T12:00:00`)) / 86400000);
  return Math.max(0, diff);
}

export default function ListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const navigate = useNavigate();

  const [stay, setStay] = useState(null);
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [failed, setFailed] = useState(() => new Set());

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setStay(null);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setMessage("");

    Promise.all([api(`/listings/${id}`), api(`/listings/${id}/availability`).catch(() => ({ booked: [] }))])
      .then(([{ listing }, availability]) => {
        if (!active) return;
        setStay(listing);
        setBooked(Array.isArray(availability.booked) ? availability.booked : []);
      })
      .catch((requestError) => active && setError(getErrorMessage(requestError)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  const photos = useMemo(() => (stay ? listingImages(stay) : []), [stay]);
  const isActivity = stay?.kind === "Experience" || stay?.kind === "Service";
  const unit = stay?.priceUnit || "night";

  const bookedRanges = useMemo(
    () => booked.map((range) => ({ checkIn: dayString(range.checkIn), checkOut: dayString(range.checkOut) })),
    [booked],
  );

  // Price for the chosen dates / guests
  const nights = isActivity ? 0 : nightsBetween(checkIn, checkOut);
  let total = 0;
  if (stay) {
    if (isActivity) {
      if (checkIn) {
        total = unit === "guest" ? stay.price * guests : stay.price;
        if (stay.minimumSpend) total = Math.max(total, stay.minimumSpend);
      }
    } else {
      total = stay.price * nights;
    }
  }

  const conflict =
    !isActivity && checkIn && checkOut
      ? bookedRanges.find((range) => checkIn < range.checkOut && checkOut > range.checkIn)
      : null;
  const currentUserId = user?.id || user?._id;
  const isOwner = Boolean(currentUserId && stay?.host?._id && stay.host._id === currentUserId);

  if (loading) return <LoadingState label="Finding your stay…" />;
  if (error || !stay) return <ErrorState message={error || "This stay could not be found."} />;

  const isFavorite = ids.has(stay._id);

  function showPhoto(index) {
    if (!photos.length) return;
    setLightbox((index + photos.length) % photos.length);
  }

  async function reserveStay(event) {
    event.preventDefault();
    setMessage("");

    if (!checkIn || (!isActivity && !checkOut)) {
      setMessage(isActivity ? "Please choose a date." : "Please select check-in and check-out dates.");
      return;
    }
    if (!isActivity && new Date(checkOut) <= new Date(checkIn)) {
      setMessage("Check-out date must be after check-in date.");
      return;
    }
    if (conflict) {
      setMessage(`Those dates are already booked (${formatDay(conflict.checkIn)} – ${formatDay(conflict.checkOut)}).`);
      return;
    }
    if (guests < 1 || guests > MAX_GUESTS) {
      setMessage(`Guests must be between 1 and ${MAX_GUESTS}.`);
      return;
    }
    if (!user) {
      navigate("/login", { state: { from: `/stays/${stay._id}` } });
      return;
    }

    setBooking(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({ listingId: stay._id, checkIn, checkOut: isActivity ? undefined : checkOut, guests }),
      });
      navigate("/trips", { state: { booked: true } });
    } catch (requestError) {
      setMessage(getErrorMessage(requestError));
      api(`/listings/${id}/availability`).then((data) => setBooked(data.booked || [])).catch(() => {});
    } finally {
      setBooking(false);
    }
  }

  const reserveLabel = stay.comingSoon
    ? "Coming soon"
    : booking
      ? "Reserving…"
      : "Reserve your stay";

  return (
    <main className="detail-page">
      <button type="button" className="back-link detail-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="detail-heading">
        <div>
          <p className="eyebrow">
            {stay.kind === "Stay" ? stay.propertyType || stay.category : stay.kind}
            {stay.badge ? ` · ${stay.badge}` : ""}
          </p>
          <h1>{stay.title}</h1>
          <p className="detail-location">
            <MapPin size={15} /> {stay.location} <span>·</span>
            <Star size={14} fill="currentColor" /> {Number(stay.rating || 5).toFixed(2)}
            {stay.reviews > 0 && <span className="detail-reviews"> ({stay.reviews} reviews)</span>}
          </p>
        </div>

        <button
          className={`outline-button${isFavorite ? " is-saved" : ""}`}
          type="button"
          onClick={() => toggle(stay._id)}
          aria-pressed={isFavorite}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "Saved" : "Save"}
        </button>
      </div>

      {/* Photos: click any photo to open the big viewer */}
      <div className={`detail-gallery gallery-${Math.min(photos.length, 5)}`}>
        {(photos.length ? photos.slice(0, 5) : [FALLBACK_IMAGE]).map((photo, index) => (
          <button
            type="button"
            key={photo}
            className="gallery-tile"
            onClick={() => showPhoto(index)}
            aria-label={`Open photo ${index + 1} of ${photos.length || 1}`}
          >
            <img
              src={failed.has(photo) ? FALLBACK_IMAGE : imageUrl(photo, index === 0 ? 1200 : 640)}
              alt={`${stay.title} photo ${index + 1}`}
              onError={() => setFailed((current) => new Set(current).add(photo))}
            />
          </button>
        ))}
        {photos.length > 5 && (
          <button type="button" className="gallery-more" onClick={() => showPhoto(0)}>
            Show all {photos.length} photos
          </button>
        )}
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" type="button" onClick={() => setLightbox(null)} aria-label="Close photos">
            <X size={22} />
          </button>
          {photos.length > 1 && (
            <button
              className="lightbox-arrow lightbox-prev"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPhoto(lightbox - 1);
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <img
            src={imageUrl(photos[lightbox], 1600)}
            alt={`${stay.title} photo ${lightbox + 1}`}
            onClick={(event) => event.stopPropagation()}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          {photos.length > 1 && (
            <button
              className="lightbox-arrow lightbox-next"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPhoto(lightbox + 1);
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          )}
          <span className="lightbox-count">
            {lightbox + 1} / {photos.length}
          </span>
        </div>
      )}

      <div className="detail-layout">
        <section className="detail-copy">
          <div className="host-summary">
            <div className="host-avatar">{stay.host?.name?.slice(0, 1) || "S"}</div>
            <div>
              <h2>Hosted by {stay.host?.name || "a Stayora host"}</h2>
              <p>{isActivity ? "A local host, ready to welcome you" : "A thoughtfully prepared place to stay"}</p>
            </div>
          </div>

          <div className="detail-facts">
            <span>
              <Users size={19} /> Up to {MAX_GUESTS} guests
            </span>
            {!isActivity && (
              <>
                <span>
                  <BedDouble size={19} /> {stay.bedrooms} bedrooms
                </span>
                <span>
                  <Bath size={19} /> {stay.bathrooms} bathrooms
                </span>
              </>
            )}
            {stay.freeCancellation && (
              <span>
                <Check size={19} /> Free cancellation
              </span>
            )}
          </div>

          <div className="detail-description">
            <h2>{isActivity ? "About this experience" : "About this place"}</h2>
            <p>{stay.description}</p>
          </div>

          {stay.amenities?.length > 0 && (
            <div className="amenities">
              <h2>{isActivity ? "What’s included" : "What this place offers"}</h2>
              <div>
                {stay.amenities.map((amenity) => (
                  <span key={amenity}>
                    <Check size={16} />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Number.isFinite(stay.lat) && Number.isFinite(stay.lng) && (
            <div className="detail-map">
              <h2>Where you’ll be</h2>
              <p>{stay.location}</p>
              <div className="detail-map-frame">
                <ListingMap stays={[stay]} single />
              </div>
            </div>
          )}
        </section>

        <aside className="booking-card">
          <div className="booking-price">
            {stay.comingSoon ? (
              <strong>Coming soon</strong>
            ) : (
              <>
                <strong>{stay.price ? `$${stay.price}` : "Free"}</strong>
                {stay.price > 0 && <span> {unit === "night" ? "night" : `/ ${unit}`}</span>}
              </>
            )}
            <span className="rating-inline">
              <Star size={14} fill="currentColor" /> {Number(stay.rating || 5).toFixed(2)}
            </span>
          </div>

          <form onSubmit={reserveStay}>
            {isActivity ? (
              <div className="booking-dates booking-dates-single">
                <label onClick={openPicker}>
                  DATE
                  <input
                    onClick={openPicker}
                    type="date"
                    min={todayString()}
                    value={checkIn}
                    onChange={(event) => setCheckIn(event.target.value)}
                    required
                  />
                </label>
              </div>
            ) : (
              <div className="booking-dates">
                <label onClick={openPicker}>
                  CHECK-IN
                  <input
                    onClick={openPicker}
                    type="date"
                    min={todayString()}
                    value={checkIn}
                    onChange={(event) => {
                      setCheckIn(event.target.value);
                      if (checkOut && event.target.value >= checkOut) setCheckOut("");
                    }}
                    required
                  />
                </label>
                <label onClick={openPicker}>
                  CHECKOUT
                  <input
                    onClick={openPicker}
                    type="date"
                    min={checkIn || todayString()}
                    value={checkOut}
                    onChange={(event) => setCheckOut(event.target.value)}
                    required
                  />
                </label>
              </div>
            )}

            <div className="booking-guest">
              <label htmlFor="booking-guests">GUESTS</label>
              <div>
                <button type="button" aria-label="Remove guest" onClick={() => setGuests(Math.max(1, guests - 1))}>
                  <Minus size={14} />
                </button>
                <span id="booking-guests">{guests}</span>
                <button type="button" aria-label="Add guest" onClick={() => setGuests(Math.min(MAX_GUESTS, guests + 1))}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {conflict && (
              <div className="notice error-notice">
                Already booked from {formatDay(conflict.checkIn)} to {formatDay(conflict.checkOut)}. Please pick other dates.
              </div>
            )}
            {message && !conflict && <div className="notice error-notice">{message}</div>}

            <button className="auth-submit" type="submit" disabled={booking || stay.comingSoon || isOwner || Boolean(conflict)}>
              {isOwner ? "This is your listing" : reserveLabel}
            </button>
          </form>

          {total > 0 && !stay.comingSoon && (
            <div className="booking-total">
              <span>
                {isActivity
                  ? unit === "guest"
                    ? `$${stay.price} × ${guests} guest${guests === 1 ? "" : "s"}`
                    : "Group price"
                  : `$${stay.price} × ${nights} night${nights === 1 ? "" : "s"}`}
              </span>
              <strong>${total}</strong>
              <span>Cleaning and service fees are not included.</span>
            </div>
          )}

          {bookedRanges.length > 0 && !isActivity && (
            <p className="booking-note booking-unavailable">
              <CalendarDays size={14} /> Not available:{" "}
              {bookedRanges.map((range) => `${formatDay(range.checkIn)}–${formatDay(range.checkOut)}`).join(", ")}
            </p>
          )}

          <p className="booking-note">
            <CalendarDays size={14} />{" "}
            The host confirms your request · You won't be charged yet
          </p>
        </aside>
      </div>
    </main>
  );
}
