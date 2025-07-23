"use client";

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import env from "@/app/env";
import ProduktListe from "@/components/ProductList";

export default function Page() {
  const [produkte, setProdukte] = useState<Produkt[] | null>(null);

  useEffect(() => {
    async function load() {
      console.log("Fetching staffeln on the client…");
      const resp = await databases.listDocuments(
        env.appwrite.db,
        env.appwrite.produce_collection_id
      );
      setProdukte(
        resp.documents.map((doc) => ({
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          name: doc.name,
          sorte: doc.sorte,
          hauptkategorie: doc.hauptkategorie,
          unterkategorie: doc.unterkategorie,
          lebensdauer: doc.lebensdauer,
          fruchtfolge_vor: doc.fruchtfolge_vor,
          fruchtfolge_nach: doc.fruchtfolge_nach,
          bodenansprueche: doc.bodenansprueche,
          begleitpflanzen: doc.begleitpflanzen,
        }))
      );
    }
    load();
  }, []);

  if (!produkte) {
    return <div>Loading…</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Produkte</h1>
        <a
          href="/staffeln"
          className="text-blue-500 hover:underline text-lg"
        >
          Zu den Staffeln
        </a>
      </div>
      <div className="w-full max-w-4xl">
        <ProduktListe initialProdukte={produkte} />
      </div>
    </main>
  );
}