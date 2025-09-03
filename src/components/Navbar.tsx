"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";

import Image from "next/image";
import Link from "next/link";

import { useAuthStore } from '@/store/Auth';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <header className="bg-gradient-to-r from-permdal-700 to-permdal-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <NavigationMenu className="flex items-center justify-between">
          <NavigationMenuList className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {/* Startseite - Clickable Logo */}
            <NavigationMenuItem>
              <Link href="/" className="block">
                <div className="bg-white rounded-full p-1 sm:p-2 flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <Image
                    src="/img/agroforst_ff_blume.png"
                    height={80}
                    width={80}
                    className="h-12 w-12 sm:h-16 sm:w-16 lg:h-[80px] lg:w-[80px] object-cover"
                    alt="Permdal Logo"
                  />
                </div>
              </Link>
            </NavigationMenuItem>

            {/* Marktplatz */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/marktplatz"
                className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-permdal-600/20 rounded-lg hover:bg-permdal-600/40 transition-all duration-200 border border-permdal-500/30"
              >
                Marktplatz
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blog"
                className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-permdal-600/20 rounded-lg hover:bg-permdal-600/40 transition-all duration-200 border border-permdal-500/30"
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* "Bestellungen" if user has "admin" label else "Upgrade" */}
            {/* {user && (
              <NavigationMenuItem>
                {user.labels?.includes("admin") ? (
                  <NavigationMenuLink
                    href="/bestellungen"
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-permdal-50 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Bestellungen
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuLink
                    href="/mitglied-werden"
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-permdal-50 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Upgrade
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            )} */}

            {/* Anmelden */}
            {user ? (
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/konto"
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-permdal-600/20 rounded-lg hover:bg-permdal-600/40 transition-all duration-200 border border-permdal-500/30 truncate max-w-[120px] sm:max-w-none"
                  title={user.name}
                >
                  {user.name}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/login"
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-permdal-600/20 rounded-lg hover:bg-permdal-600/40 transition-all duration-200 border border-permdal-500/30"
                >
                  Anmelden
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}