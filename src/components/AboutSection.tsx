import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <div className="relative w-3/4 max-w-3xl p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 max-w-4xl mx-auto">
      {/* Image Section */}
      <div className="w-full md:w-1/2">
        <Image
          src="/img/kartoffel-hänger.jpeg" // Replace with your actual image path
          width={600}
          height={400}
          alt="Permdal Landwirtschaft"
          className="rounded-lg"
        />
      </div>
      {/* Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-800">
          Die Marke Permdal
        </h2>
        <p className="text-lg text-gray-700">
          Wir bauen tolle Sachen an, die ihr euch abholen könnt. Kontaktiert uns auch gerne für interessante Kooperationen mit regionaler Gastronomie!
        </p>
        <p className="text-lg text-gray-700 mt-2">
          Ins Leben gerufen von Frank F. und seinem Team. Erfahre noch mehr:
        </p>

        {/* Buttons */}
        <div className="flex justify-center md:justify-start mt-4 space-x-4">
          <Link href="/permdal">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md border-2 border-permdal-200 hover:bg-permdal-50 transition-all">
              Über Permdal
            </button>
          </Link>
          <Link href="/team">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md border-2 border-permdal-200 hover:bg-permdal-50 transition-all">
              Über das Team
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}