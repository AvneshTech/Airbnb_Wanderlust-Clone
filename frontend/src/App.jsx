import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import FlashAlert from "./components/layout/FlashAlert.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import Loader from "./components/common/Loader.jsx";

// Route-level code splitting: each page is only fetched when the user
// navigates to it, instead of bundling every page into the initial load.
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ListingDetailPage = lazy(() => import("./pages/ListingDetailPage.jsx"));
const NewListingPage = lazy(() => import("./pages/NewListingPage.jsx"));
const EditListingPage = lazy(() => import("./pages/EditListingPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const BookingPage = lazy(() => import("./pages/BookingPage.jsx"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage.jsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

function AppRoutes() {
  // Remounting the boundary on every route change means an error on one
  // page never permanently breaks navigation to the rest of the app.
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings/new" element={<ProtectedRoute><NewListingPage /></ProtectedRoute>} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
          <Route path="/listings/:id/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/bookings/my" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <FlashAlert />
      <main className="container py-3" style={{ flex: 1 }}>
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
