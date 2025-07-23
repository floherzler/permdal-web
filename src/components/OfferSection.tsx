import Link from "next/link";

export default function OfferSection() {
    return (
        <div className="relative w-3/4 max-w-3xl bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center mx-auto">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Wir bieten euch:
            </h2>

            {/* Bullet Points */}
            <ul className="text-lg text-gray-700 dark:text-gray-300 space-y-2 text-left">
                <li className="flex items-center justify-center">
                    🍓 <span className="ml-2">planbare Abholung</span>
                </li>
                <li className="flex items-center justify-center">
                    🥔 <span className="ml-2">Rezepte zum Ausprobieren</span>
                </li>
                <li className="flex items-center justify-center">
                    🥕 <span className="ml-2">Informationen zu Anbau und Ernte</span>
                </li>


            </ul>

            {/* Subtitle */}
            <p className="mt-6 text-gray-600 dark:text-gray-300 italic">
                ...und natürlich alles ökologisch. Hand drauf!
            </p>

            {/* CTA Button with Hand-Drawn Look */}
            <Link href="/signup" className="mt-6 flex items-center justify-center">
                <button className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md border-2 border-green-700 hover:bg-green-600 transition-all flex items-center">
                    🤝 <span className="ml-2">jetzt Mitglied werden!</span>
                </button>
            </Link>
        </div>
    );
}
