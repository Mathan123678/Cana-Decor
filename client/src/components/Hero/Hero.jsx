import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Sparkles,
  Star,
  Users,
  Heart,
} from "lucide-react";

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-[#5b21b6] via-[#c026d3] to-[#2563eb] text-white">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-fuchsia-400/30 blur-3xl animate-pulse" />

        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/30 blur-3xl animate-pulse" />

        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-pink-400/20 blur-3xl" />
      </div>

      {/* Decorative stars */}
      <div className="absolute top-20 left-[8%] text-yellow-300 animate-bounce">
        <Sparkles size={24} />
      </div>

      <div className="absolute top-32 right-[8%] text-yellow-300 animate-pulse">
        <Sparkles size={30} />
      </div>

      <div className="absolute bottom-20 left-[45%] text-white/30">
        <Sparkles size={20} />
      </div>

      {/* Main container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1500px] items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-20">

        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div className="max-w-3xl">

            {/* Badge */}
            <div
              className="
                mb-7
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/25
                bg-white/10
                px-5
                py-2.5
                text-sm
                font-semibold
                backdrop-blur-md
                shadow-lg
                animate-[fadeIn_0.8s_ease-out]
              "
            >
              <Sparkles size={17} className="text-yellow-300" />

              <span>Premium Event Decoration</span>
            </div>

            {/* Heading */}
            <h1
              className="
                text-5xl
                font-black
                leading-[1.05]
                tracking-tight
                sm:text-6xl
                md:text-7xl
                lg:text-7xl
                xl:text-8xl
              "
            >
              Make Your
              <br />

              <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Dream Event
              </span>

              <br />

              Come True
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-2xl
                text-lg
                leading-8
                text-white/85
                sm:text-xl
              "
            >
              We create unforgettable weddings, birthdays, receptions,
              corporate events and premium celebrations with elegant
              decorations and creative designs.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              {/* Book Now */}
              <Link
                to="/booking"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-white
                  px-7
                  py-4
                  text-base
                  font-bold
                  text-purple-700
                  shadow-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-105
                  hover:shadow-2xl
                "
              >
                <CalendarCheck size={20} />

                Book Now

                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Packages */}
              <Link
                to="/packages"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-white/50
                  bg-white/10
                  px-7
                  py-4
                  text-base
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:text-purple-700
                  hover:shadow-xl
                "
              >
                View Packages

                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

            {/* Statistics */}
            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-5">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md">
                  <Heart size={22} className="text-pink-200" />
                </div>

                <div>
                  <p className="text-2xl font-black sm:text-3xl">
                    100+
                  </p>

                  <p className="text-xs text-white/70 sm:text-sm">
                    Events Decorated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md">
                  <Users size={22} className="text-blue-200" />
                </div>

                <div>
                  <p className="text-2xl font-black sm:text-3xl">
                    50+
                  </p>

                  <p className="text-xs text-white/70 sm:text-sm">
                    Happy Customers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md">
                  <Star
                    size={22}
                    className="fill-yellow-300 text-yellow-300"
                  />
                </div>

                <div>
                  <p className="text-2xl font-black sm:text-3xl">
                    5.0
                  </p>

                  <p className="text-xs text-white/70 sm:text-sm">
                    Customer Rating
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT IMAGE
          ====================================================== */}
          <div className="relative mx-auto w-full max-w-[650px]">

            {/* Glow behind image */}
            <div className="absolute -inset-5 rounded-[40px] bg-white/20 blur-2xl" />

            {/* Image card */}
            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white/30
                bg-white/10
                p-2
                shadow-[0_25px_80px_rgba(0,0,0,0.3)]
                backdrop-blur-sm
                transition-all
                duration-500
                hover:-translate-y-3
                hover:rotate-1
              "
            >

              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85"
                alt="Elegant event decoration"
                className="
                  h-[420px]
                  w-full
                  rounded-[26px]
                  object-cover
                  sm:h-[500px]
                  lg:h-[560px]
                "
              />

              {/* Image overlay */}
              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  right-5
                  rounded-2xl
                  border
                  border-white/20
                  bg-black/45
                  p-5
                  backdrop-blur-xl
                "
              >

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-white/70">
                      Creating beautiful memories
                    </p>

                    <h3 className="mt-1 text-lg font-bold sm:text-xl">
                      Your Event, Our Creativity ✨
                    </h3>
                  </div>

                  <div className="hidden rounded-full bg-yellow-400/20 p-3 sm:block">
                    <Sparkles
                      size={25}
                      className="text-yellow-300"
                    />
                  </div>

                </div>

              </div>
            </div>

            {/* Floating rating */}
            <div
              className="
                absolute
                -bottom-7
                -left-5
                rounded-2xl
                border
                border-white/30
                bg-white
                px-5
                py-4
                text-gray-900
                shadow-2xl
                sm:-left-8
              "
            >

              <div className="flex items-center gap-3">

                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={17}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <span className="font-bold">
                  5.0
                </span>

              </div>

              <p className="mt-1 text-xs text-gray-500">
                Customer Rating
              </p>

            </div>

          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

    </section>
  );
}

export default Hero;