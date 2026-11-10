import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { firstImage, imageUrl } from "../utils/images.js";

const escapeHtml = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function priceText(stay) {
  if (stay.comingSoon) return "Soon";
  if (!stay.price) return "Free";
  return `$${stay.price}`;
}

// Map with one price pin for every listing that has coordinates.
//  - hovering a card on the left highlights its pin (hoveredId)
//  - clicking a pin opens a small card, and the card opens the stay page
//  - when there are no listings, the map is centred on `placeName` (looked up on OpenStreetMap)
export default function ListingMap({ stays, hoveredId = null, placeName = "", single = false }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const pinsRef = useRef(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    const map = L.map(containerRef.current, { scrollWheelZoom: !single, zoomControl: true, minZoom: 2, worldCopyJump: true }).setView([25, 40], 2);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const resize = window.setTimeout(() => map.invalidateSize(), 150);
    return () => {
      window.clearTimeout(resize);
      map.remove();
      mapRef.current = null;
    };
  }, [single]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return undefined;

    layer.clearLayers();
    pinsRef.current = new Map();

    const located = stays.filter((stay) => Number.isFinite(stay.lat) && Number.isFinite(stay.lng));
    const bounds = [];

    located.forEach((stay) => {
      const icon = L.divIcon({
        className: "map-price-pin",
        html: `<span>${escapeHtml(single ? "●" : priceText(stay))}</span>`,
        iconSize: [0, 0],
      });
      const marker = L.marker([stay.lat, stay.lng], { icon }).addTo(layer);
      bounds.push([stay.lat, stay.lng]);
      pinsRef.current.set(stay._id, marker);

      if (!single) {
        const card = document.createElement("a");
        card.className = "map-popup";
        card.href = `/stays/${stay._id}`;
        card.innerHTML = `<img src="${escapeHtml(imageUrl(firstImage(stay), 320))}" alt="" />
          <strong>${escapeHtml(stay.title)}</strong>
          <span>${escapeHtml(stay.location)}</span>
          <span>${escapeHtml(stay.comingSoon ? "Coming soon" : `$${stay.price} / ${stay.priceUnit || "night"}`)} · ★ ${Number(stay.rating || 5).toFixed(2)}</span>`;
        card.addEventListener("click", (event) => {
          event.preventDefault();
          navigate(`/stays/${stay._id}`);
        });
        marker.bindPopup(card, { closeButton: false, minWidth: 190, maxWidth: 220 });
      }
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], single ? 13 : 12);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else if (placeName) {
      let cancelled = false;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(placeName)}`)
        .then((response) => response.json())
        .then((results) => {
          if (!cancelled && results?.[0] && mapRef.current) {
            mapRef.current.setView([Number(results[0].lat), Number(results[0].lon)], 11);
          }
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, [stays, placeName, single, navigate]);

  useEffect(() => {
    pinsRef.current.forEach((marker, id) => {
      const element = marker.getElement();
      if (!element) return;
      element.classList.toggle("is-active", id === hoveredId);
      marker.setZIndexOffset(id === hoveredId ? 1000 : 0);
    });
  }, [hoveredId, stays]);

  function showWholeWorld() {
    mapRef.current?.setView([25, 15], 2);
  }

  return (
    <div className="listing-map-wrap">
      <div className="listing-map" ref={containerRef} role="region" aria-label="Map of the stays" />
      {!single && (
        <button type="button" className="map-world-button" onClick={showWholeWorld}>
          🌍 Whole world
        </button>
      )}
    </div>
  );
}
