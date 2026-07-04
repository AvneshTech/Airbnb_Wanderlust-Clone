import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import FlashAlert from "./components/layout/FlashAlert.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

import HomePage from "./pages/HomePage.jsx";
import ListingDetailPage from "./pages/ListingDetailPage.jsx";
import NewListingPage from "./pages/NewListingPage.jsx";
import EditListingPage from "./pages/EditListingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <FlashAlert />
      <main className="container py-3" style={{ flex: 1 }}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
