"use client";
import React from "react";

import CTA from "@/components/CTA";
import AboutSection from "@/components/AboutSection";
import OfferSection from "@/components/OfferSection";
import ImageCarousel from "@/components/ImageCarousel";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// export function CallToAction() {
//   return (
//     <div className="flex flex-col items-center justify-center w-full md:w-1/2 rounded-md p-8">
//       {/* ShadCN Card für den CTA */}
//       <Card className="max-w-2xl w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-l hover:shadow-xl transition-all">
//         <CardContent className="flex flex-col items-center">
//           {/* Überschrift */}
//           <CardTitle className="text-3xl text-center font-bold text-neutral-800 dark:text-white mb-4">
//             Obst, Gemüse und Kräuter <br></br> mit ❤️ aus Brandenburg
//           </CardTitle>

//           <CardDescription className="text-xl text-neutral-700 dark:text-gray-300 mb-6">
//             Von unseren Feldern - für Ihren Genuss! 
//           </CardDescription>

//           {/* Accordion für Details */}
//           <div className="w-full">
//             <p>
//               Permdal steht für eine zukunftsorientierte Landwirtschaft: In unserem Agroforstsystem bauen wir Obst, Gemüse und Kräuter nachhaltig an.
//               Einige würden sagen, besser als bio! Unsere Produkte kommen direkt aus der Mark Brandenburg auf Ihre Teller.
//             </p>
//             <Accordion type="single" collapsible>
//               {/* Erster Abschnitt */}
//               <AccordionItem value="item-1">
//                 <AccordionTrigger className="text-lg bg-emerald-50 text-neutral-600 p-4 rounded-md hover:bg-emerald-100 dark:bg-emerald-700 dark:text-white">
//                   Mehr über Permdal
//                 </AccordionTrigger>
//                 {/* Hälfte so dort, Hälfte zum Ausdrucken */}
//                 <AccordionContent className="bg-white text-neutral-600 text-l dark:bg-gray-700 dark:text-white p-4 rounded-md">
//                   Registrieren Sie sich auf unserer Seite, um mehr über unser Angebot zu erfahren. Vorerst ist unser Angebot nur für Selbstabholer zugänglich und nur nach Absprache als Lieferung erhältlich. 
//                   Unser Konzept richtet sich auch an Restaurants, Läden und Landwirte, die an einem Austausch von Erzeugnissen oder einer Zusammenarbeit interessiert sind. Zukünftig finden Sie hier eine Tauschbörse für Landwirte und Möglichkeiten für Sortimentserweiterungen lokaler Geschäfte. Gemeinsam setzen wir auf eine zukunftsfähige und faire Landwirtschaft.
//                   Seien Sie dabei, wenn wir unsere Produktpalette erweitern! Bald gibt es auch Pilze und Ingwer im Angebot.
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>

//           {/* CTA-Text */}
//           <h3 className="text-xl font-bold text-neutral-600 dark:text-white mt-2 mb-2">
//             Bleiben Sie auf dem Laufenden und registrieren Sie sich!
//           </h3>
//         </CardContent>
//         <CardFooter>
//           {/* ShadCN Button für die Registrierung */}
//           <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-lg">
//             <a href="/signup" className="text-center text-xl font-semibold">Registrieren →</a>
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      {/* Add margin-top to main for spacing after Navbar */}
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-8 mt-12">
        <CTA />
        <AboutSection />
        <OfferSection />
        <ImageCarousel />
      </main>
      <Footer />
    </div>
  );
}
