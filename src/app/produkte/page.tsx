export const dynamic = "force-dynamic";

import React from "react";
import { getStaffeln } from "../actions/getStaffeln";
// import StaffelList from "@/components/StaffelList";

export default async function Page() {
  const staffeln: Staffel[] = await getStaffeln();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-200 mb-4">
          Produkte im Aufbau
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Hier findet ihr demnächst unsere <strong>Permdal-Produkte</strong> und auch Produkte
          anderer <strong>Bio- und Öko-Betriebe</strong> aus der Region.
        </p>

        {/* Uncomment when ready */}
        {/* <StaffelList initialStaffeln={staffeln} /> */}

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
          Schaut regelmäßig vorbei – es lohnt sich!
        </div>
      </div>
    </main>
  );
}
