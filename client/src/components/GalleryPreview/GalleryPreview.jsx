import { Link } from "react-router-dom";

function GalleryPreview() {
  const images = [
    {
      title: "Wedding Decoration",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Reception Decoration",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Birthday Decoration",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Stage Decoration",
      image:
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold uppercase tracking-wider">
            Our Gallery
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Beautiful Moments We Created
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore some of our recent event decoration work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl h-72 shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                <h3 className="text-white text-lg font-semibold p-5">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-block bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
          >
            View Full Gallery
          </Link>
        </div>

      </div>
    </section>
  );
}

export default GalleryPreview;