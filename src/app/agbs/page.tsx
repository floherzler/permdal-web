export const dynamic = "force-dynamic";

import React from "react";

export default async function Page() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
            <div className="max-w-2xl text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-permdal-800 dark:text-permdal-200 mb-4">
                    Allgemeine Geschäftsbedingungen
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Hier findet ihr demnächst unsere AGBs.
                </p>
            </div>
        </main>
    );
}
