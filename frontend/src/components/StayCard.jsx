// 



import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api, getErrorMessage } from "../api.js";
import { FALLBACK_IMAGE, imageUrl, listingImages } from "../utils/images.js";
import { useAuth } from "../context/AuthContext.jsx";

const fallbackImage = FALLBACK_IMAGE;

export default function StayCard({
  stay,
  isFavorite = false,
  onFavoriteChange,
  preview = false,
  onHover,
  trip,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

const images = listingImages(stay);

const finalImages = images.length ? images : [fallbackImage];

  const [currentImage, setCurrentImage] = useState(0);
  const [failedImages, setFailedImages] = useState([]);

  const image =
    failedImages.includes(currentImage)
      ? fallbackImage
      : finalImages[currentImage];

  function previousImage(event) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentImage((prev) =>
      prev === 0 ? finalImages.length - 1 : prev - 1
    );
  }

  function nextImage(event) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentImage((prev) =>
      prev === finalImages.length - 1 ? 0 : prev + 1
    );
  }

  async function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate("/login", {
        state: { from: window.location.pathname },
      });
      return;
    }

    try {
      const { saved } = await api(
        `/users/me/favorites/${stay._id}`,
        { method: "PUT" }
      );

      onFavoriteChange?.(stay._id, saved);
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  }

  const imageContent = (
    <>
      <img
        className="stay-image"
        src={imageUrl(image, 720)}
        alt={stay.title}
        loading="lazy"
        onError={() => {
          setFailedImages((prev) =>
            prev.includes(currentImage)
              ? prev
              : [...prev, currentImage]
          );
        }}
      />

      <span className="guest-favorite">
        {preview ? "Example stay" : stay.badge || "Guest favorite"}
      </span>

      {finalImages.length > 1 && (
        <>
          <button
            className="stay-image-arrow stay-image-prev"
            onClick={previousImage}
            type="button"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className="stay-image-arrow stay-image-next"
            onClick={nextImage}
            type="button"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="stay-image-dots">
            {finalImages.map((_, index) => (
              <span
                key={index}
                className={index === currentImage ? "active" : ""}
              />
            ))}
          </div>
        </>
      )}
    </>
  );

  const defaultDetail = (
    <>
      <span className="stay-title">{stay.location}</span>

      <span className="stay-rating">
        <Star size={13} fill="currentColor" />
        {Number(stay.rating || 5).toFixed(2)}
        {preview ? ` (${stay.reviews} reviews)` : ""}
      </span>

      <span className="stay-subtitle">{stay.title}</span>

      <span className="stay-capacity">
        {stay.kind === "Experience" || stay.kind === "Service"
          ? `${stay.kind} · up to ${stay.guests} guests`
          : `${stay.guests} guests · ${stay.bedrooms} bedrooms · ${stay.bathrooms} bath${
              stay.bathrooms === 1 ? "" : "s"
            }`}
      </span>

      <span className="stay-price">
        {stay.comingSoon ? (
          "Coming soon"
        ) : (
          <>
            <strong>${stay.price}</strong> {stay.priceUnit || "night"}
          </>
        )}
      </span>
    </>
  );

  // Airbnb-style card used on the list + map page: type in city, rating, beds, dates and total price
  const tripDetail = trip ? (
    <>
      <span className="stay-title">
        {stay.propertyType || stay.category} in {stay.city || stay.location}
      </span>

      <span className="stay-rating">
        <Star size={13} fill="currentColor" />
        {Number(stay.reviews) > 0 ? `${Number(stay.rating).toFixed(2)} (${stay.reviews})` : "New"}
      </span>

      <span className="stay-subtitle">{stay.title}</span>

      <span className="stay-capacity">
        {stay.bedrooms} bedroom{stay.bedrooms === 1 ? "" : "s"} · {stay.guests} guests · {stay.bathrooms} bath
        {stay.bathrooms === 1 ? "" : "s"}
      </span>

      <span className="stay-capacity">{trip.label}</span>

      <span className="stay-price">
        <strong>${stay.price * trip.nights}</strong> for {trip.nights} nights
      </span>
    </>
  ) : null;
  const detailContent = tripDetail || defaultDetail;

  return (
    <article
      className="stay-card"
      onMouseEnter={() => onHover?.(stay._id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {preview ? (
        <div className="stay-image-wrap">{imageContent}</div>
      ) : (
        <Link className="stay-image-wrap" to={`/stays/${stay._id}`}>
          {imageContent}
        </Link>
      )}

      {!preview && (
        <button
          className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
          onClick={toggleFavorite}
          type="button"
          aria-label={
            isFavorite ? "Remove from wish list" : "Save to wish list"
          }
          aria-pressed={isFavorite}
        >
          <Heart size={22} />
        </button>
      )}

      {preview ? (
        <div className="card-details">{detailContent}</div>
      ) : (
        <Link className="card-details" to={`/stays/${stay._id}`}>
          {detailContent}
        </Link>
      )}
    </article>
  );
}
