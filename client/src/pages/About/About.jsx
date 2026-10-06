import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Target,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-pink-900 text-white py-32">

        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20" />

        <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -bottom-20 -right-20" />

        <motion.div
          className="relative max-w-5xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
            <Sparkles size={16} />
            About EventDecor
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            We Turn
            <span className="text-pink-300"> Moments</span>
            <br />
            Into Memories.
          </h1>

          <p className="text-purple-100 text-lg md:text-xl max-w-3xl mx-auto mt-7 leading-8">
            We create beautiful, meaningful and unforgettable event
            experiences through creative decoration and thoughtful design.
          </p>

        </motion.div>

      </section>


      {/* STORY */}

      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <span className="text-purple-600 font-bold tracking-widest text-sm">
              OUR STORY
            </span>

            <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900">
              Every celebration deserves
              <span className="text-purple-600">
                {" "}something special.
              </span>
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              EventDecor was created with one simple idea:
              make professional event decoration easier and more
              accessible for everyone.
            </p>

            <p className="text-gray-600 mt-4 leading-8">
              Whether it's a wedding, reception, birthday or corporate
              celebration, our goal is to transform your ideas into
              beautiful spaces that people remember.
            </p>

            <Link
              to="/booking"
              className="inline-flex items-center gap-2 mt-8 bg-purple-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-800 hover:-translate-y-1 transition"
            >
              Start Planning
              <ArrowRight size={18} />
            </Link>

          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <div className="grid grid-cols-2 gap-5">

              <div className="h-56 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white">
                <Heart size={70} />
              </div>

              <div className="h-56 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                <Sparkles size={70} />
              </div>

              <div className="h-56 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <Users size={70} />
              </div>

              <div className="h-56 rounded-3xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white">
                <Target size={70} />
              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* VALUES */}

      <section className="bg-gray-50 py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">

            <span className="text-purple-600 font-bold tracking-widest text-sm">
              OUR VALUES
            </span>

            <h2 className="text-4xl md:text-5xl font-black mt-3">
              What Makes Us Different
            </h2>

          </div>


          <div className="grid md:grid-cols-3 gap-7">

            {[
              {
                icon: Sparkles,
                title: "Creativity",
                text: "We create unique concepts instead of repeating the same decoration everywhere.",
              },
              {
                icon: Heart,
                title: "Passion",
                text: "We genuinely care about making your special moments beautiful.",
              },
              {
                icon: Users,
                title: "Customer First",
                text: "Your ideas, preferences and satisfaction guide every decision we make.",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                  whileHover={{
                    y: -10,
                    boxShadow:
                      "0 25px 60px rgba(0,0,0,0.1)",
                  }}
                >

                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Icon size={27} />
                  </div>

                  <h3 className="text-2xl font-bold mt-6">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-7 mt-3">
                    {item.text}
                  </p>

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;