import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, SERVER_URL } from "../../config/api.js";

function Packages() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPackage, setSelectedPackage] = useState(null);

  // =====================================================
  // API
  // =====================================================

  const packagesEndpoint = `${API_URL}/packages`;

  // =====================================================
  // FETCH PACKAGES
  // =====================================================

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const response = await axios.get(packagesEndpoint);

      console.log("Packages API:", response.data);

      const packageData =
        response.data?.packages ||
        response.data?.data ||
        [];

      setPackages(packageData);
    } catch (error) {
      console.error("Error fetching packages:", error);

      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BOOK SELECTED PACKAGE
  // =====================================================

  const handleBookPackage = (packageData) => {
    if (!packageData) {
      console.error("Package data is missing");
      return;
    }

    console.log("Selected Package:", packageData);

    navigate("/booking", {
      state: {
        packageData: packageData,
      },
    });
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      packages
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTER
  // =====================================================

  const filteredPackages =
    activeCategory === "All"
      ? packages
      : packages.filter(
          (item) =>
            item.category === activeCategory
        );

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    return `${SERVER_URL}/uploads/${image}`;
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">

          <div className="relative w-20 h-20 mx-auto">

            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>

            <div className="absolute inset-5 rounded-full bg-purple-600/20 blur-md"></div>

          </div>

          <p className="text-white mt-6 text-lg font-medium">
            Preparing beautiful packages...
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Please wait
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#faf8ff]">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative min-h-[620px] flex items-center overflow-hidden bg-slate-950">

        {/* Background Image */}

        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40"></div>

        <div className="absolute inset-0 bg-purple-950/30"></div>

        {/* Decorative circles */}

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-40 left-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"></div>

        {/* Content */}

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 py-24">

          <div className="max-w-3xl">

            {/* Small label */}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm mb-7">

              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>

              Premium Event Experiences

            </div>

            {/* Heading */}

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">

              Make Your

              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300">
                Moments Magical
              </span>

            </h1>

            {/* Description */}

            <p className="text-lg md:text-xl text-gray-300 mt-8 max-w-2xl leading-relaxed">

              From elegant weddings to unforgettable
              birthdays, choose a decoration package
              designed to turn your special day into a
              beautiful memory.

            </p>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <a
                href="#packages"
                className="group px-7 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-900/30 text-center"
              >
                Explore Packages

                <span className="inline-block ml-2 group-hover:translate-y-1 transition">
                  ↓
                </span>
              </a>

              <a
                href="#packages"
                className="px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white hover:text-slate-950 hover:scale-105 transition-all duration-300 text-center"
              >
                Plan My Event
              </a>

            </div>

          </div>

        </div>

        {/* Bottom fade */}

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8ff] to-transparent"></div>

      </section>

      {/* =================================================
          PACKAGE SECTION
      ================================================= */}

      <section
        id="packages"
        className="max-w-7xl mx-auto px-6 md:px-10 py-20"
      >

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-purple-600 font-bold uppercase tracking-[0.25em] text-sm">
            Our Collections
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mt-4">

            Choose Your

            <span className="text-purple-600">
              {" "}Perfect Package
            </span>

          </h2>

          <p className="text-gray-500 text-lg mt-5 leading-relaxed">

            Beautifully designed decoration packages
            created for every celebration and every
            budget.

          </p>

        </div>

        {/* =================================================
            CATEGORY FILTER
        ================================================= */}

        {categories.length > 1 && (

          <div className="flex flex-wrap justify-center gap-3 mt-12">

            {categories.map((category) => (

              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:-translate-y-1"
                }`}
              >
                {category}
              </button>

            ))}

          </div>

        )}

        {/* =================================================
            PACKAGE CARDS
        ================================================= */}

        {filteredPackages.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-14">

            {filteredPackages.map(
              (item, index) => {

                const isFeatured =
                  index === 1;

                return (

                  <article
                    key={item.id}
                    className={`group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 ${
                      isFeatured
                        ? "ring-2 ring-purple-500"
                        : ""
                    }`}
                  >

                    {/* Featured badge */}

                    {isFeatured && (

                      <div className="absolute top-5 left-5 z-20 px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-bold shadow-lg">
                        ⭐ MOST POPULAR
                      </div>

                    )}

                    {/* Image */}

                    <div className="relative h-72 overflow-hidden">

                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80";
                        }}
                      />

                      {/* Image overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>

                      {/* Category */}

                      {item.category && (

                        <div className="absolute bottom-5 left-5 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-purple-700 text-sm font-bold">
                          {item.category}
                        </div>

                      )}

                      {/* Price */}

                      <div className="absolute bottom-5 right-5 bg-slate-950/80 backdrop-blur-md text-white rounded-2xl px-4 py-3">

                        <p className="text-xs text-gray-300">
                          Starting from
                        </p>

                        <p className="text-xl font-black">
                          ₹{formatPrice(item.price)}
                        </p>

                      </div>

                    </div>

                    {/* Content */}

                    <div className="p-7">

                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 mt-3 leading-relaxed line-clamp-3">
                        {item.description ||
                          "Beautiful event decoration designed to make your special occasion unforgettable."}
                      </p>

                      {/* Features */}

                      <div className="grid grid-cols-2 gap-3 mt-6">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-purple-600">
                            ✨
                          </span>
                          Premium Decor
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-purple-600">
                            🎨
                          </span>
                          Custom Theme
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-purple-600">
                            💡
                          </span>
                          Lighting
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-purple-600">
                            🎉
                          </span>
                          Event Setup
                        </div>

                      </div>

                      {/* Buttons */}

                      <div className="flex gap-3 mt-7">

                        {/* View Details */}

                        <button
                          onClick={() =>
                            setSelectedPackage(item)
                          }
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-purple-500 hover:text-purple-600 transition"
                        >
                          View Details
                        </button>

                        {/* FIXED BOOK NOW */}

                        <button
                          type="button"
                          onClick={() =>
                            handleBookPackage(item)
                          }
                          className="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold text-center hover:bg-purple-700 hover:shadow-lg transition"
                        >
                          Book Now
                        </button>

                      </div>

                    </div>

                  </article>

                );
              }
            )}

          </div>

        ) : (

          /* =================================================
              EMPTY STATE
          ================================================= */

          <div className="text-center py-24">

            <div className="w-24 h-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-5xl">
              🎉
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-6">
              No packages available
            </h3>

            <p className="text-gray-500 mt-2">
              Please check again later.
            </p>

            <button
              onClick={fetchPackages}
              className="mt-6 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Refresh
            </button>

          </div>

        )}

      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-24">

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          <span className="text-amber-400 font-bold uppercase tracking-[0.25em] text-sm">
            Let's Create Something Beautiful
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-5">

            Your Dream Event

            <br />

            Starts Here.

          </h2>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">

            Tell us what you're celebrating and we'll
            help you create a decoration experience
            your guests will remember.

          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-9">

            <a
              href="#packages"
              className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 hover:scale-105 transition"
            >
              Choose a Package →
            </a>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl border border-white/20 text-white font-bold text-lg hover:bg-white hover:text-slate-950 transition"
            >
              Talk to Us
            </Link>

          </div>

        </div>

      </section>

      {/* =================================================
          PACKAGE DETAILS MODAL
      ================================================= */}

      {selectedPackage && (

        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() =>
            setSelectedPackage(null)
          }
        >

          <div
            className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Image */}

            <div className="relative h-72">

              <img
                src={getImageUrl(
                  selectedPackage.image
                )}
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() =>
                  setSelectedPackage(null)
                }
                className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/50 text-white text-xl hover:bg-black/70 transition"
              >
                ✕
              </button>

            </div>

            {/* Modal Content */}

            <div className="p-8">

              <div className="flex flex-wrap items-center gap-3">

                {selectedPackage.category && (

                  <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                    {selectedPackage.category}
                  </span>

                )}

                <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
                  Premium Package
                </span>

              </div>

              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-5">
                {selectedPackage.title}
              </h2>

              <p className="text-gray-500 text-lg leading-relaxed mt-4">
                {selectedPackage.description}
              </p>

              <div className="mt-7 p-5 rounded-2xl bg-purple-50">

                <p className="text-sm text-purple-600 font-medium">
                  Package Price
                </p>

                <p className="text-3xl font-black text-purple-700 mt-1">
                  ₹{formatPrice(selectedPackage.price)}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">

                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-2xl">✨</p>
                  <p className="font-semibold mt-2">
                    Premium Decoration
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-2xl">🎨</p>
                  <p className="font-semibold mt-2">
                    Custom Theme
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-2xl">💡</p>
                  <p className="font-semibold mt-2">
                    Event Lighting
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-2xl">🎉</p>
                  <p className="font-semibold mt-2">
                    Complete Setup
                  </p>
                </div>

              </div>

              {/* FIXED MODAL BOOK BUTTON */}

              <button
                type="button"
                onClick={() =>
                  handleBookPackage(selectedPackage)
                }
                className="block w-full text-center mt-7 px-6 py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition"
              >
                Book This Package →
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Packages;