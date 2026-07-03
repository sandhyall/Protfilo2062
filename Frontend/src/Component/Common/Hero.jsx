import React from "react";
import video from "../../assets/design.mp4";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 container mx-auto px-6 text-center text-white">
        <header className="uppercase tracking-widest text-blue-400 font-semibold mb-4 text-sm">
          End-to-End Digital Solutions
        </header>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Build. Grow. Succeed With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            MERN Stack & Digital Marketing
          </span>
        </h1>

        <h2 className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
          We develop high-performance websites, web applications, and
          result-driven digital marketing strategies that help businesses grow
          faster.
        </h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
          Get Free Consultation
        </button>
      </div>
    </section>
  );
};

export default Hero;
