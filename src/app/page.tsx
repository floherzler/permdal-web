"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SpinningText } from '@/components/ui/spinning-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


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

import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Importiere ShadCN Card-Komponenten
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAuthStore } from "@/store/Auth";

export function CallToAction() {
  return (
    <div className="flex flex-col items-center justify-center w-full md:w-1/2 rounded-md p-8">
      {/* ShadCN Card für den CTA */}
      <Card className="max-w-2xl w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-l hover:shadow-xl transition-all">
        <CardContent className="flex flex-col items-center">
          {/* Überschrift */}
          <CardTitle className="text-3xl text-center font-bold text-neutral-800 dark:text-white mb-4">
            Obst, Gemüse und Kräuter <br></br> mit ❤️ aus Brandenburg
          </CardTitle>

          <CardDescription className="text-xl text-neutral-700 dark:text-gray-300 mb-6">
            Von unseren Feldern - für Ihren Genuss! 
          </CardDescription>

          {/* Accordion für Details */}
          <div className="w-full">
            <p>
              Permdal steht für eine zukunftsorientierte Landwirtschaft: In unserem Agroforstsystem bauen wir Obst, Gemüse und Kräuter nachhaltig an.
              Einige würden sagen, besser als bio! Unsere Produkte kommen direkt aus der Mark Brandenburg auf Ihre Teller.
            </p>
            <Accordion type="single" collapsible>
              {/* Erster Abschnitt */}
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg bg-emerald-50 text-neutral-600 p-4 rounded-md hover:bg-emerald-100 dark:bg-emerald-700 dark:text-white">
                  Mehr über Permdal
                </AccordionTrigger>
                {/* Hälfte so dort, Hälfte zum Ausdrucken */}
                <AccordionContent className="bg-white text-neutral-600 text-l dark:bg-gray-700 dark:text-white p-4 rounded-md">
                  Registrieren Sie sich auf unserer Seite, um mehr über unser Angebot zu erfahren. Vorerst ist unser Angebot nur für Selbstabholer zugänglich und nur nach Absprache als Lieferung erhältlich. 
                  Unser Konzept richtet sich auch an Restaurants, Läden und Landwirte, die an einem Austausch von Erzeugnissen oder einer Zusammenarbeit interessiert sind. Zukünftig finden Sie hier eine Tauschbörse für Landwirte und Möglichkeiten für Sortimentserweiterungen lokaler Geschäfte. Gemeinsam setzen wir auf eine zukunftsfähige und faire Landwirtschaft.
                  Seien Sie dabei, wenn wir unsere Produktpalette erweitern! Bald gibt es auch Pilze und Ingwer im Angebot.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA-Text */}
          <h3 className="text-xl font-bold text-neutral-600 dark:text-white mt-2 mb-2">
            Bleiben Sie auf dem Laufenden und registrieren Sie sich!
          </h3>
        </CardContent>
        <CardFooter>
          {/* ShadCN Button für die Registrierung */}
          <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-lg">
            <a href="/signup" className="text-center text-xl font-semibold">Registrieren →</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Home() {
  const { user, logout } = useAuthStore();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-gray-500 dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto p-4 flex justify-center">
          <NavigationMenu className="flex items-center space-x-6">
            <NavigationMenuList className="flex space-x-4">
              {/* Startseite */}
              <NavigationMenuItem>
                <Image
                  src="/img/Logo_Permdal_transparent.png"
                  height={100}
                  width={200}
                  // className="h-auto object-cover"
                  alt="Permdal Logo"
                />
              </NavigationMenuItem>
              {/* <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Über Permdal
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}

              {/* Aktuelles */}
              {/* <NavigationMenuItem>
                <Link href="/produkte" legacyBehavior passHref>
                  <NavigationMenuLink
                    className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 bg-emerald-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Aktuelles
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}

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

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
        {/* Logo */}
        <div className="p-4">
          <Image
            src="/img/Permdal_Blume_transparent_rund.png"
            height={200}
            width={200}
            className="h-auto object-cover"
            alt="Permdal Logo"
          />
        </div>

        <CallToAction />

        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
            Die Marke Permdal
          </h2>
          {/* TODO: Zertifikat einfügen */}
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-2xl text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div className="">
          <SpinningText
              radius={4}
              fontSize={1.7}
              className='font-large p-20'
            >
              {`Permdal • Frank Fege • `}
          </SpinningText>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-2/3 pt-4"
        >
          <CarouselContent>
              <CarouselItem key={1} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="flex aspect-[16/9]">
                    <CardContent className="flex items-center justify-center p-1">
                      <img
                        src="/img/kartoffel-hänger.jpeg"
                        alt="Kartoffeln"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem key={2} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="flex aspect-[16/9]">
                    <CardContent className="flex items-center justify-center p-1">
                      <img
                        src="/img/erdbeer-körbe.jpeg"
                        alt="Kartoffeln"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem key={3} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="flex aspect-[16/9]">
                    <CardContent className="flex items-center justify-center p-1">
                      <img
                        src="/img/herbst.jpeg"
                        alt="Herbstliche Blätter"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem key={4} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="flex aspect-[16/9]">
                    <CardContent className="flex items-center justify-center p-1">
                      <img
                        src="/img/garten-nebel.jpeg"
                        alt="Nebliger Garten"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem key={5} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="flex aspect-[16/9]">
                    <CardContent className="flex items-center justify-center p-1">
                      <img
                        src="/img/schnee-feld.jpeg"
                        alt="Feld im Schnee"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="text-black shadow-l"/>
          <CarouselNext className="text-black"/>
        </Carousel>
      </main>

      <footer className="bg-gray-500 text-white py-8 mt-8">
        <div className="container mx-auto px-6 flex flex-col items-center space-y-6">
          {/* Footer Header */}
          {/* <h2 className="text-3xl font-semibold">Permdal</h2>
          <p className="text-center text-lg max-w-lg">
            Building a sustainable future with agroforestry. Join us in making a difference.
          </p> */}

          {/* Footer Links */}
          <div className="flex space-x-6">
            <Link href="/about" className="hover:underline text-lg">
              Über Uns
            </Link>
            <Link href="/datenschutz" className="hover:underline text-lg">
              Datenschutz
            </Link>
            <Link href="/impressum" className="hover:underline text-lg">
              Impressum
            </Link>
            <Link href="/contact" className="hover:underline text-lg">
              Kontakt
            </Link>
          </div>

          {/* Footer Button (Optional, ShadCN Button example)
          <Button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg">
            Get Involved
          </Button> */}

          {/* Footer Copyright */}
          <div className="text-sm text-center text-gray-400">
            &copy; 2025 Agroforst Frank Fege
          </div>
        </div>
      </footer>

    </div>
  );
}
