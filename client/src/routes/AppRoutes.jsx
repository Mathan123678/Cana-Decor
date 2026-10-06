import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

// Public Pages
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Packages from "../pages/Packages/Packages";
import Gallery from "../pages/Gallery/Gallery";
import Booking from "../pages/Booking/Booking";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Customer
import CustomerDashboard from "../pages/CustomerDashboard";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminBookings from "../pages/admin/AdminBookings";
import AdminPackages from "../pages/admin/AdminPackages";
import AdminGallery from "../pages/admin/AdminGallery";
import AdminContacts from "../pages/admin/AdminContacts";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            Public Website
        ========================================== */}

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/packages"
            element={<Packages />}
          />

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        {/* ==========================================
            Customer Dashboard
        ========================================== */}

        <Route
          path="/customer-dashboard"
          element={<CustomerDashboard />}
        />

        {/* ==========================================
            Admin Dashboard
        ========================================== */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* ==========================================
            Admin Bookings
        ========================================== */}

        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />

        {/* ==========================================
            Admin Packages
        ========================================== */}

        <Route
          path="/admin/packages"
          element={<AdminPackages />}
        />

        {/* ==========================================
            Admin Gallery
        ========================================== */}

        <Route
          path="/admin/gallery"
          element={<AdminGallery />}
        />
        <Route
            path="/admin/contacts"
            element={<AdminContacts />}
          />

        {/* ==========================================
            Old Customer URL
        ========================================== */}

        <Route
          path="/customer"
          element={
            <Navigate
              to="/customer-dashboard"
              replace
            />
          }
        />

        {/* ==========================================
            404 Page
        ========================================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h1>404 - Page Not Found</h1>

              <p>
                The page you are looking for does not
                exist.
              </p>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;