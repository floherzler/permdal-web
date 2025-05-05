import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import Image from "next/image";

import Link from "next/link";
import { useAuthStore } from '@/store/Auth';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <header className="bg-gray-500 dark:bg-gray-300 shadow-sm">
      <div className="container mx-auto p-4 flex justify-center">
        <NavigationMenu className="flex items-center space-x-6">
          <NavigationMenuList className="flex space-x-4">
            {/* Startseite */}
            <NavigationMenuItem>
              <Image
                src="/img/agroforst_ff_blume.png"
                height={80}
                width={80}
                className="h-auto object-cover"
                alt="Permdal Logo"
              />
            </NavigationMenuItem>

            {/* Produkte */}
            <NavigationMenuItem>
              <Link href="/produkte" legacyBehavior passHref>
                <NavigationMenuLink
                  className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Produkte
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <Link href="/blog" legacyBehavior passHref>
                <NavigationMenuLink
                  className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Blog
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* "Bestellungen" if user has "admin" label else "Upgrade" */}
            {user && (
              <NavigationMenuItem>
                {user.labels?.includes("admin") ? (
                  <Link href="/bestellungen" legacyBehavior passHref>
                    <NavigationMenuLink
                      className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Bestellungen
                    </NavigationMenuLink>
                  </Link>
                ) : (
                  <Link href="/mitglied-werden" legacyBehavior passHref>
                    <NavigationMenuLink
                      className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Upgrade
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            )}

            {/* Anmelden */}
            {user ? (
              <NavigationMenuItem>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {user.name} abmelden
                </button>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link href="/login" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Anmelden
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}