
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { DashboardPage, FavoritesPage, TripsPage } from "./pages/DashboardPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import AllPage from "./pages/AllPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import HostPage from "./pages/HostPage.jsx";
import ListingPage from "./pages/ListingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import InspirationPage from "./pages/InspirationPage.jsx";
import HotelsPage from "./pages/HotelsPage.jsx";
import ExperiencesPage from "./pages/ExperiencesPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

import FooterInfoPage, { footerPagePaths } from "./pages/FooterInfoPage.jsx";

export default function App() {
  const location = useLocation();

  const isInspirationPage = location.pathname.startsWith("/inspiration/");
  const isFooterInfoPage = footerPagePaths.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!isInspirationPage && !isFooterInfoPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/all" element={<AllPage />} />
        <Route path="/homes" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/inspiration/:category" element={<InspirationPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/stays/:id" element={<ListingPage />} />

        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/host/new"
          element={
            <ProtectedRoute>
              <HostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/host/:id/edit"
          element={
            <ProtectedRoute>
              <HostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />

        {footerPagePaths.map((path) => (
          <Route
            key={path}
            path={path}
            element={<FooterInfoPage />}
          />
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}
