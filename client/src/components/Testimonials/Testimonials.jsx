function Testimonials() {
  const testimonials = [
    {
      name: "Priya & Arun",
      event: "Wedding",
      message:
        "The decoration was absolutely beautiful. The team understood exactly what we wanted and created a wonderful wedding atmosphere.",
      rating: 5,
    },
    {
      name: "Karthik",
      event: "Birthday Celebration",
      message:
        "Excellent service and very creative decoration. Everything was completed on time and looked amazing.",
      rating: 5,
    },
    {
      name: "Divya",
      event: "Reception",
      message:
        "The stage and reception decoration exceeded our expectations. Highly recommended for special events.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold uppercase tracking-wider">
            Testimonials
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            What Our Customers Say
          </h2>

          <p className="text-gray-600 mt-4">
            Real experiences from our happy customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-7 hover:shadow-xl transition"
            >

              <div className="flex gap-1 mb-5">
                {[...Array(item.rating)].map((_, starIndex) => (
                  <span
                    key={starIndex}
                    className="text-amber-500 text-xl"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-600 leading-7 mb-6">
                "{item.message}"
              </p>

              <div>
                <h3 className="font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="text-purple-600 text-sm mt-1">
                  {item.event}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;