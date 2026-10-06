import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Packages from "./pages/Packages/Packages.jsx";
import Booking from "./pages/Booking/Booking.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            Home
        ================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =================================
            Authentication
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================
            Customer
        ================================= */}

        <Route
          path="/customer-dashboard"
          element={
            <CustomerDashboard />
          }
        />

        <Route
          path="/packages"
          element={
            <Packages />
          }
        />

        <Route
          path="/booking"
          element={
            <Booking />
          }
        />

        {/* =================================
            Admin - Temporary
        ================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <div
              style={{
                padding: "40px",
              }}
            >
              <h1>
                Admin Dashboard
              </h1>

              <p>
                Admin dashboard will be
                built next.
              </p>
            </div>
          }
        />

        {/* =================================
            Old Customer Route
        ================================= */}

        <Route
          path="/customer"
          element={
            <Navigate
              to="/customer-dashboard"
              replace
            />
          }
        />

        {/* =================================
            404
        ================================= */}

        <Route
          path="*"
          element={
            <div
              style={{
                padding: "40px",
              }}
            >
              <h1>
                404 - Page Not Found
              </h1>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;