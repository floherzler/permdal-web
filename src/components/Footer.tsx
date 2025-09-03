import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-permdal-800 text-white py-8 mt-8">
      <div className="container mx-auto px-6 flex flex-col items-center space-y-6">
        {/* Footer Links */}
        <div className="flex space-x-6">
          <Link href="/team" className="hover:underline text-lg">
            Über Uns
          </Link>
          <Link href="/impressum" className="hover:underline text-lg">
            Impressum
          </Link>
          <Link href="/agbs" className="hover:underline text-lg">
            AGBs
          </Link>
          <Link href="/datenschutz" className="hover:underline text-lg">
            Datenschutz
          </Link>
        </div>

        {/* Footer Copyright */}
        <div className="text-sm text-center text-permdal-200">
          &copy; 2025 Agroforst Frank Fege
        </div>
      </div>
    </footer>

  )
}