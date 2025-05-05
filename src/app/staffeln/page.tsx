// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import env from "@/app/env";
import StaffelAdmin from "@/components/StaffelAdmin";

export default function Page() {
  const [staffeln, setStaffeln] = useState<Staffel[] | null>(null);

  useEffect(() => {
    async function load() {
      console.log("Fetching staffeln on the client…");
      const resp = await databases.listDocuments(
        env.appwrite.db,
        env.appwrite.staffel_collection_id
      );
      setStaffeln(
        resp.documents.map((doc) => ({
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          produktID: doc.produktID,
          saatPflanzDatum: doc.saatPflanzDatum,
          ernteProjektion: doc.ernteProjektion,
          einheit: doc.einheit,
          euroPreis: doc.euroPreis,
          menge: doc.menge,
          mengeVerfuegbar: doc.mengeVerfuegbar,
          mengeAbgeholt: doc.mengeAbgeholt,
        }))
      );
    }
    load();
  }, []);

  if (!staffeln) {
    return <div>Loading…</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Staffeln</h1>
        <a
          href="/produkte"
          className="text-blue-500 hover:underline text-lg"
        >
          Zu den Produkten
        </a>
      </div>
      <div className="w-full max-w-4xl">
        <StaffelAdmin initialStaffeln={staffeln} />
      </div>
    </main>
  );
}
