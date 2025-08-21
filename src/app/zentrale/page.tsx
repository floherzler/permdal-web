'use client';

import { useEffect, useState } from "react";
import { databases } from "@/models/client/config";
import env from "@/app/env";
import ZentraleAdmin from "@/components/ZentraleAdmin";

export default function Page() {
  const [produkte, setProdukte] = useState<Produkt[] | null>(null);
  const [staffeln, setStaffeln] = useState<Staffel[] | null>(null);

  useEffect(() => {
    async function load() {
      const [produkteResp, staffelnResp] = await Promise.all([
        databases.listDocuments(
          env.appwrite.db,
          env.appwrite.produce_collection_id
        ),
        databases.listDocuments(
          env.appwrite.db,
          env.appwrite.angebote_collection_id
        ),
      ]);

      setProdukte(
        produkteResp.documents.map((doc) => ({
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

      setStaffeln(
        staffelnResp.documents.map((doc) => ({
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          produktID: doc.produktID,
          saatPflanzDatum: doc.saatPflanzDatum,
          ernteProjektion: doc.ernteProjektion,
          menge: doc.menge,
          einheit: doc.einheit,
          euroPreis: doc.euroPreis,
          mengeVerfuegbar: doc.mengeVerfuegbar,
          mengeAbgeholt: doc.mengeAbgeholt,
        }))
      );
    }
    load();
  }, []);

  if (!produkte || !staffeln) {
    return <div>Loading…</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Zentrale</h1>
      </div>
      <div className="w-full max-w-4xl">
        <ZentraleAdmin initialProdukte={produkte} initialStaffeln={staffeln} />
      </div>
    </main>
  );
}
