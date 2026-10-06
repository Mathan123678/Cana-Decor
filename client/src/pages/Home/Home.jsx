import Hero from "../../components/Hero/Hero";

function Home() {
  return (
    <div className="w-full">
      <Hero />

      {/* About preview */}
      <section className="bg-white px-6 py-24 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl text-center">

          <span className="font-semibold uppercase tracking-widest text-purple-600">
            Why EventDecor?
          </span>

          <h2 className="mt-3 text-4xl font-black text-gray-900 sm:text-5xl">
            We Turn Moments Into Memories
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            From intimate celebrations to grand weddings and corporate
            events, our team creates beautiful environments that make
            every occasion unforgettable.
          </p>

          <div className="mt-10">
            <a
              href="/about"
              className="
                inline-flex
                items-center
                rounded-xl
                bg-purple-600
                px-7
                py-3.5
                font-bold
                text-white
                shadow-lg
                transition
                hover:-translate-y-1
                hover:bg-purple-700
              "
            >
              Discover Our Story
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Home;