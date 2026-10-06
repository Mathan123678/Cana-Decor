import { useEffect, useState } from "react";
import { X, Maximize2 } from "lucide-react";
import axios from "axios";
import { API_URL, SERVER_URL } from "../../config/api.js";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] =
    useState("All");
  const [selectedImage, setSelectedImage] =
    useState(null);

  const galleryEndpoint = `${API_URL}/gallery`;

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await axios.get(galleryEndpoint);

      console.log("Gallery API:", response.data);

      const data =
        response.data?.gallery ||
        response.data?.data ||
        [];

      setGallery(data);
    } catch (error) {
      console.error(
        "Gallery fetch error:",
        error
      );

      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80";
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
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      gallery
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTER
  // =====================================================

  const filteredGallery =
    activeCategory === "All"
      ? gallery
      : gallery.filter(
          (item) =>
            item.category === activeCategory
        );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">

          <div className="relative w-20 h-20 mx-auto">

            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />

          </div>

          <p className="text-white mt-6 text-xl font-semibold">
            Loading our celebrations...
          </p>

          <p className="text-gray-400 mt-2">
            Creating your visual experience
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff]">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative min-h-[620px] overflow-hidden flex items-center bg-slate-950">

        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/70 via-transparent to-amber-900/20" />

        {/* Decorative blobs */}

        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-amber-400/20 blur-3xl" />

        {/* Content */}

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 py-32">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white mb-8">

              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />

              OUR EVENT GALLERY

            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tight">

              Moments

              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300">
                Worth Remembering
              </span>

            </h1>

            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed">

              Explore the celebrations we've
              transformed with creativity, elegance
              and unforgettable decoration.

            </p>

            <a
              href="#gallery"
              className="inline-block mt-10 px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 hover:scale-105 transition-all shadow-xl shadow-purple-900/30"
            >
              Explore Gallery ↓
            </a>

          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#faf8ff] to-transparent" />

      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      <section
        id="gallery"
        className="max-w-7xl mx-auto px-6 md:px-10 py-20"
      >

        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-purple-600 font-bold uppercase tracking-[0.3em] text-sm">
            Our Work
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mt-4">
            Every Event Tells
            <span className="text-purple-600">
              {" "}a Story
            </span>
          </h2>

          <p className="text-gray-500 text-lg mt-5">
            A glimpse into the beautiful events we've
            created for our clients.
          </p>

        </div>

        {/* Categories */}

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
                    : "bg-white text-gray-600 border border-gray-200 hover:text-purple-600 hover:border-purple-300"
                }`}
              >
                {category}
              </button>

            ))}

          </div>
        )}

        {/* Gallery Grid */}

        {filteredGallery.length > 0 ? (

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mt-14">

            {filteredGallery.map((item, index) => (

              <div
                key={item.id}
                className="group relative mb-6 break-inside-avoid rounded-[1.5rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                onClick={() =>
                  setSelectedImage(item)
                }
              >

                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                    index % 3 === 0
                      ? "min-h-[450px]"
                      : "min-h-[300px]"
                  }`}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80";
                  }}
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* View Icon */}

                <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                  <Maximize2 size={20} />
                </div>

                {/* Text */}

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">

                  {item.category && (
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold mb-3">
                      {item.category}
                    </span>
                  )}

                  <h3 className="text-2xl font-black text-white">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-gray-200 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="text-center py-24">

            <div className="text-7xl">
              📸
            </div>

            <h3 className="text-2xl font-bold mt-5">
              Gallery is being prepared
            </h3>

            <p className="text-gray-500 mt-2">
              Beautiful event photos will appear here.
            </p>

          </div>

        )}

      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section className="bg-slate-950 py-24 relative overflow-hidden">

        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">

          <span className="text-amber-400 uppercase tracking-[0.3em] text-sm font-bold">
            Your Event Could Be Next
          </span>

          <h2 className="text-4xl md:text-6xl font-black text-white mt-5">
            Let's Create Your
            <br />
            Beautiful Story
          </h2>

          <p className="text-gray-400 text-lg mt-6">
            Ready to transform your celebration?
          </p>

          <a
            href="/booking"
            className="inline-block mt-8 px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-500 hover:scale-105 transition"
          >
            Book Your Event →
          </a>

        </div>

      </section>

      {/* =================================================
          IMAGE MODAL
      ================================================= */}

      {selectedImage && (

        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-5"
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <div
            className="relative max-w-6xl max-h-[90vh]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={getImageUrl(
                selectedImage.image
              )}
              alt={selectedImage.title}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() =>
                setSelectedImage(null)
              }
              className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-xl"
            >
              <X size={22} />
            </button>

            <div className="text-center mt-5">

              <h3 className="text-2xl font-bold text-white">
                {selectedImage.title}
              </h3>

              {selectedImage.description && (
                <p className="text-gray-400 mt-2">
                  {selectedImage.description}
                </p>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Gallery;