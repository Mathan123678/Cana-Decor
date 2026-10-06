import { Link } from "react-router-dom";

function ContactCTA() {
  return (
    <section className="py-20 bg-purple-700">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <p className="text-amber-400 font-semibold uppercase tracking-wider">
          Let's Create Something Beautiful
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
          Ready to Plan Your Event?
        </h2>

        <p className="text-purple-100 text-lg mt-5 max-w-2xl mx-auto">
          Let our decoration team transform your special occasion
          into a beautiful and memorable experience.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          <Link
            to="/booking"
            className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Book Your Event
          </Link>

          <Link
            to="/contact"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition"
          >
            Contact Us
          </Link>

        </div>

      </div>
    </section>
  );
}

export default ContactCTA;