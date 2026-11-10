import { useEffect, useState } from "react";
import { api } from "../api.js";

// Loads listings for a row or page. `params` is a plain object, e.g. { collection: "bahria" }.
export function useListings(params) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const key = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "" && value !== null),
  ).toString();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api(`/listings${key ? `?${key}` : ""}`)
      .then(({ listings: result }) => {
        if (active) setListings(Array.isArray(result) ? result : []);
      })
      .catch((requestError) => {
        if (active) {
          setListings([]);
          setError(requestError instanceof Error ? requestError.message : "Could not load listings.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key]);

  return { listings, loading, error };
}

// Link to the 2-column results page (list on the left, map on the right).
export function exploreLink(params) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
  return `/explore?${query.toString()}`;
}
