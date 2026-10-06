import { Link } from "react-router-dom";

function FeaturedPackages() {
  const packages = [
    {
      name: "Wedding Elegance",
      price: "₹25,000",
      description:
        "Beautiful wedding decoration with flowers, stage setup and elegant lighting.",
      features: [
        "Wedding Stage Decoration",
        "Fresh Flower Decoration",
        "Lighting Setup",
        "Entrance Decoration",
      ],
    },
    {
      name: "Reception Premium",
      price: "₹20,000",
      description:
        "Premium reception decoration designed to create a memorable atmosphere.",
      features: [
        "Reception Stage",
        "Table Decoration",
        "Flower Arrangement",
        "Ambient Lighting",
      ],
    },
    {
      name: "Birthday Celebration",
      price: "₹10,000",
      description:
        "Colorful and creative birthday decoration for an unforgettable celebration.",
      features: [
        "Balloon Decoration",
        "Birthday Backdrop",
        "Table Setup",
        "LED Lighting",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold uppercase tracking-wider">
            Our Packages
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Popular Decoration Packages
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Choose from our professionally designed decoration packages
            for your special occasion.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-7 border border-gray-100"
            >
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="text-purple-700 text-2xl font-bold mt-3">
                  {item.price}
                </p>
              </div>

              <p className="text-gray-600 leading-6 mb-6">
                {item.description}
              </p>

              <div className="space-y-3 mb-7">
                {item.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <span className="text-green-600 font-bold">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/booking"
                className="block text-center bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Book This Package
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/packages"
            className="inline-block border-2 border-purple-700 text-purple-700 px-7 py-3 rounded-lg font-semibold hover:bg-purple-700 hover:text-white transition"
          >
            View All Packages
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedPackages;