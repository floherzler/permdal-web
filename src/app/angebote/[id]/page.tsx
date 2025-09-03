import { databases } from "@/models/client/config";
import env from "@/app/env";
import { notFound } from "next/navigation";

// app/angebote/[id]/page.tsx
import AngebotLive from "@/components/AngebotLive";
import CopyMailButton from "@/components/CopyMailButton";

export default async function AngebotPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const angebot = await databases.getDocument(
        env.appwrite.db,
        env.appwrite.angebote_collection_id,
        id
    );

    // Define mailAddress, e.g. from angebot or use a default
    const mailAddress = "team@agroforst-ff.de";

    return (
        <main className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Angebot {id}</h1>

            <div className="rounded-lg border bg-white p-6 shadow-sm space-y-3">
                {/* 👇 hydration: static props + realtime updates */}
                <AngebotLive
                    initial={{
                        ...angebot,
                        mengeVerfuegbar: angebot.mengeVerfuegbar,
                        einheit: angebot.einheit,
                        menge: angebot.menge,
                        euroPreis: angebot.euroPreis,
                    }}
                />

                <p>
                    <span className="font-semibold">Saat-/Pflanzdatum:</span>{" "}
                    {new Date(angebot.saatPflanzDatum).toLocaleDateString("de-DE")}
                </p>
                {angebot.ernteProjektion?.length > 0 && (
                    <p>
                        <span className="font-semibold">Ernteprojektion:</span>{" "}
                        {angebot.ernteProjektion
                            .map((d: string) => new Date(d).toLocaleDateString("de-DE"))
                            .join(" - ")}
                    </p>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
                {/* Kontakt aufnehmen (mailto still there for those who can use it) */}
                <a
                    href={`mailto:${mailAddress}?subject=Anfrage%20zu%20Angebot%20${id}`}
                    className="bg-permdal-600 text-white px-4 py-2 rounded-lg hover:bg-permdal-700 inline-block"
                >
                    Per E-Mail Kontakt aufnehmen
                </a>

                {/* Copy section */}
                <div className="flex flex-wrap items-center gap-3">
                    <CopyMailButton mailAddress={mailAddress} />
                    <CopyMailButton mailAddress={`Anfrage zu Angebot ${id}`} />
                </div>
            </div>


        </main>
    );
}
