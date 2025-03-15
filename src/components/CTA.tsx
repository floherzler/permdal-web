import React from "react";

export default function CTA() {
  return (
    <div
      className="relative w-3/4 max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg flex flex-col items-center text-center p-6"
      style={{
        backgroundImage: "url(/img/garten-nebel.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="p-4"></div>
          <img
            src="/img/permdal-logo.png"
            alt="Agroforst Frank Fege"
            className="w-1/2 h-1/3 rounded-xl bg-white bg-opacity-25 p-2"
          />
        </div>

        {/* Subheading */}
        <div className="relative z-10 flex flex-col items-center w-full">
          <h2 className="text-2xl font-medium mt-4 text-white">
            Produkte aus Prignitzer Permakultur.
          </h2>

        {/* CTA Button */}
        <a
          href="/signup"
          className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition-all mt-6 w-3/4"
        >
          Anmelden, um keine Neuigkeiten zu verpassen!
        </a>
      </div>
    </div>
  );
}
