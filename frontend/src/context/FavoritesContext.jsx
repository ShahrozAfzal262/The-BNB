import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const FavoritesContext = createContext(null);

// One shared wish list, so the heart is the same on every row, card and detail page.
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ids, setIds] = useState(new Set());

  useEffect(() => {
    let active = true;
    if (!user) {
      setIds(new Set());
      return undefined;
    }
    api("/users/me/favorites")
      .then(({ listings }) => {
        if (active) setIds(new Set((Array.isArray(listings) ? listings : []).map((stay) => stay._id)));
      })
      .catch(() => {
        if (active) setIds(new Set());
      });
    return () => {
      active = false;
    };
  }, [user]);

  const toggle = useCallback(
    async (id) => {
      if (!user) {
        navigate("/login", { state: { from: window.location.pathname + window.location.search } });
        return;
      }
      try {
        const { saved } = await api(`/users/me/favorites/${id}`, { method: "PUT" });
        setIds((current) => {
          const next = new Set(current);
          if (saved) next.add(id);
          else next.delete(id);
          return next;
        });
      } catch (error) {
        window.alert(getErrorMessage(error));
      }
    },
    [user, navigate],
  );

  const value = useMemo(() => ({ ids, toggle }), [ids, toggle]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
