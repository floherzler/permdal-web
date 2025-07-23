import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";

import Image from "next/image";

import { useAuthStore } from '@/store/Auth';
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <header className="bg-green-800">
      <div className="container mx-auto p-4 flex justify-center">
        <NavigationMenu className="flex items-center space-x-6">
          <NavigationMenuList className="flex space-x-4">
            {/* Startseite */}
            <NavigationMenuItem>
              <div className="bg-white rounded-full p-2 flex items-center justify-center">
                <Image
                  src="/img/agroforst_ff_blume.png"
                  height={80}
                  width={80}
                  className="h-[80px] w-[80px] object-cover"
                  alt="Permdal Logo"
                />
              </div>
            </NavigationMenuItem>

            {/* Produkte */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/produkte"
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-emerald-50 rounded-lg hover:bg-gray-300 transition-all"
              >
                Produkte
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Blog */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blog"
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-emerald-50 rounded-lg hover:bg-gray-300 transition-all"
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* "Bestellungen" if user has "admin" label else "Upgrade" */}
            {user && (
              <NavigationMenuItem>
                {user.labels?.includes("admin") ? (
                  <NavigationMenuLink
                    href="/bestellungen"
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-emerald-50 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Bestellungen
                  </NavigationMenuLink>
                ) : (
                  <NavigationMenuLink
                    href="/mitglied-werden"
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-emerald-50 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Upgrade
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            )}

            {/* Anmelden */}
            {user ? (
              <NavigationMenuItem>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-800 bg-emerald-50 rounded-lg hover:bg-gray-300 transition-all"
                >
                  {user.name} abmelden
                </button>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-800 bg-emerald-50 rounded-lg hover:bg-gray-300 transition-all"
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