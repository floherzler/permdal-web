import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-500 text-white py-8 mt-8">
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
        <div className="text-sm text-center text-gray-400">
          &copy; 2025 Agroforst Frank Fege
        </div>
      </div>
    </footer>

  )
}