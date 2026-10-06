import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navClass = ({ isActive }) =>
    `transition duration-300 ${
      isActive
        ? "text-purple-700 font-bold"
        : "text-gray-700 hover:text-purple-700"
    }`;

  return (
    <header className="sticky top-0 z-50">

      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}

          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={21} />
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight">
                Cana<span className="text-purple-600">Decor</span>
              </div>

              <div className="text-[9px] tracking-[3px] text-gray-400 font-bold">
                CREATE • CELEBRATE • REMEMBER
              </div>
            </div>

          </Link>


          {/* DESKTOP NAVIGATION */}

          <div className="hidden md:flex items-center gap-8">

            <NavLink
              to="/"
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={navClass}
            >
              About
            </NavLink>

            <NavLink
              to="/packages"
              className={navClass}
            >
              Packages
            </NavLink>

            <NavLink
              to="/gallery"
              className={navClass}
            >
              Gallery
            </NavLink>

            <NavLink
              to="/contact"
              className={navClass}
            >
              Contact
            </NavLink>

          </div>


          {/* DESKTOP BUTTONS */}

          <div className="hidden md:flex items-center gap-3">

            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition"
            >
              Login
            </Link>

            <Link
              to="/booking"
              className="px-6 py-2.5 rounded-xl text-white font-bold bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-200 hover:-translate-y-1 transition"
            >
              Book Now
            </Link>

          </div>


          {/* MOBILE BUTTON */}

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

        </div>


        {/* MOBILE MENU */}

        {menuOpen && (

          <div className="md:hidden border-t border-gray-100 bg-white">

            <div className="px-6 py-6 flex flex-col gap-5">

              <NavLink
                to="/"
                onClick={closeMenu}
                className={navClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                onClick={closeMenu}
                className={navClass}
              >
                About
              </NavLink>

              <NavLink
                to="/packages"
                onClick={closeMenu}
                className={navClass}
              >
                Packages
              </NavLink>

              <NavLink
                to="/gallery"
                onClick={closeMenu}
                className={navClass}
              >
                Gallery
              </NavLink>

              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={navClass}
              >
                Contact
              </NavLink>

              <Link
                to="/login"
                onClick={closeMenu}
                className="text-center py-3 rounded-xl border border-purple-200 text-purple-700 font-bold"
              >
                Login
              </Link>

              <Link
                to="/booking"
                onClick={closeMenu}
                className="text-center py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold"
              >
                Book Your Event
              </Link>

            </div>

          </div>

        )}

      </nav>

    </header>
  );
}

export default Navbar;