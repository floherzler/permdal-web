// app/produkte/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { databases } from "@/models/client/config";
import env from "@/app/env";
import { Query, Models } from "appwrite";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Produkt = {
    $id: string;
    $createdAt: string;
    name: string;
    sorte?: string;
    hauptkategorie: "Obst" | "Gemüse" | "Kräuter" | "Maschine" | "Sonstiges" | string;
    unterkategorie?: string;
    lebensdauer?: string;
    fruchtfolge_vor?: string[];
    fruchtfolge_nach?: string[];
    bodenansprueche?: string[];
    begleitpflanzen?: string[];
    saisonalitaet?: number[]; // 1..12
};

type Angebot = Models.Document & { produktID: string };

const DB = env.appwrite.db;
const PRODUKTE = env.appwrite.produce_collection_id;
const ANGEBOTE = env.appwrite.angebote_collection_id;

// Use the exact values you store in Appwrite:
const KATS = ["Obst", "Gemüse", "Kräuter", "Maschine", "Sonstiges"] as const;

export default function ProdukteKatalogPage() {
    const [selectedKat, setSelectedKat] = useState<(typeof KATS)[number]>("Obst");
    const [produkte, setProdukte] = useState<Produkt[]>([]);
    const [angeboteCount, setAngeboteCount] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                // 1) Produkte der gewählten Hauptkategorie
                const prodRes = await databases.listDocuments(DB, PRODUKTE, [
                    Query.equal("hauptkategorie", selectedKat),
                    Query.orderAsc("name"),
                    Query.limit(200),
                ]);
                const list: Produkt[] = prodRes.documents.map(mapProdukt);
                setProdukte(list);

                // 2) Angebots-Counts in einem Request (produktID IN [...])
                if (list.length) {
                    const ids = list.map((p) => p.$id);
                    const anRes = await databases.listDocuments(DB, ANGEBOTE, [
                        Query.equal("produktID", ids),
                        Query.limit(500),
                    ]);
                    const map: Record<string, number> = {};
                    (anRes.documents as Angebot[]).forEach((d) => {
                        map[d.produktID] = (map[d.produktID] ?? 0) + 1;
                    });
                    setAngeboteCount(map);
                } else {
                    setAngeboteCount({});
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedKat]);

    return (
        <main className="min-h-screen container mx-auto p-4 space-y-4">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Katalog</h1>
                    <p className="text-sm text-muted-foreground">
                        {loading ? "Laden…" : `${produkte.length} Produkte`}
                    </p>
                </div>
                <Link href="/staffeln" className="text-blue-600 hover:underline">
                    Zu den Angeboten
                </Link>
            </header>

            {/* Styled Tabs */}
            <Tabs value={selectedKat} onValueChange={(v) => setSelectedKat(v as any)}>
                <TabsList
                    className="
            flex flex-wrap gap-1 rounded-xl
            bg-emerald-50/60 border border-emerald-100 p-1
          "
                >
                    {KATS.map((k) => (
                        <TabsTrigger
                            key={k}
                            value={k}
                            className="
                rounded-lg px-3 py-1.5 text-sm
                data-[state=active]:bg-emerald-200/60
                data-[state=active]:text-emerald-900
                data-[state=active]:shadow-sm
                hover:bg-emerald-100/40 transition
              "
                        >
                            {k}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Grid der Produkte */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {produkte.map((p) => {
                    const count = angeboteCount[p.$id] ?? 0;
                    const hasAngebote = count > 0;
                    return (
                        <article key={p.$id} className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <button
                                    type="button"
                                    className="text-left font-semibold hover:underline"
                                    onClick={() => { }}
                                    title="Produktseite (bald)"
                                >
                                    {p.name}{p.sorte ? ` – ${p.sorte}` : ""}
                                </button>
                                <span
                                    className={[
                                        "text-xs px-2 py-1 rounded-full",
                                        hasAngebote ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-600",
                                    ].join(" ")}
                                    title={hasAngebote ? `${count} Angebot(e)` : "Keine Angebote vorhanden"}
                                >
                                    {hasAngebote ? `${count} Angebote` : "Keine Angebote"}
                                </span>
                            </div>

                            <div className="mt-1 text-sm text-muted-foreground">
                                {p.unterkategorie ?? "–"}
                            </div>

                            <Saisonalitaet months={p.saisonalitaet ?? []} />
                        </article>
                    );
                })}
            </section>

            {!loading && produkte.length === 0 && (
                <div className="text-sm text-muted-foreground">Keine Produkte gefunden.</div>
            )}
        </main>
    );
}

function mapProdukt(doc: any): Produkt {
    // saisonalitaet → robuste number[] 1..12
    const raw = Array.isArray(doc.saisonalitaet) ? doc.saisonalitaet : [];
    const mapped: number[] = raw.map((m: any) => (typeof m === "string" ? parseInt(m, 10) : m));
    const saisonalitaet: number[] = [...new Set<number>(mapped)]
        .filter((n: any) => Number.isFinite(n) && n >= 1 && n <= 12)
        .sort((a, b) => a - b);

    return {
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
        saisonalitaet,
    };
}

/** Saisonalität als durchgehende(n) Balken über 12 Monate (unterstützt Lücken & Wrap-Around) */
function Saisonalitaet({ months }: { months: number[] }) {
    const segments = useMemo(() => computeSegments(months), [months]);
    const monthWidth = 100 / 12;

    return (
        <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Saisonalität</div>

            <div className="relative">
                {/* Baseline: 12 Zellen mit Monats-Kürzeln */}
                <div className="grid grid-cols-12 gap-px h-8">
                    {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} className="bg-muted/60 rounded-[2px] flex items-center justify-center">
                            <span className="text-[10px] leading-none text-muted-foreground">
                                {shortMonth(i + 1)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Overlay: Saison-Bänder */}
                {segments.map((seg, idx) => (
                    <div
                        key={idx}
                        className="
              absolute top-1/2 -translate-y-1/2 h-3
              bg-emerald-500/60 rounded-full
              ring-1 ring-emerald-600/20
            "
                        style={{
                            left: `${(seg.start - 1) * monthWidth}%`,
                            width: `${seg.len * monthWidth}%`,
                        }}
                        aria-label={`Saison von ${monthName(seg.start)} bis ${monthName(endOf(seg))}`}
                        title={`Saison: ${monthName(seg.start)} – ${monthName(endOf(seg))}`}
                    />
                ))}
            </div>
        </div>
    );
}

function computeSegments(months: number[]) {
    // boolean map 1..12
    const present = new Array<boolean>(13).fill(false);
    months.forEach((m) => {
        if (Number.isFinite(m) && m >= 1 && m <= 12) present[m] = true;
    });

    const segs: { start: number; len: number }[] = [];
    for (let m = 1; m <= 12; m++) {
        const prev = m === 1 ? 12 : m - 1;
        // Start eines neuen Segments: Monat ist aktiv, Vormonat nicht
        if (present[m] && !present[prev]) {
            let len = 1;
            let k = m === 12 ? 1 : m + 1;
            while (present[k] && k !== m) {
                len++;
                k = k === 12 ? 1 : k + 1;
                if (len >= 12) break; // Volltreffer (alle Monate)
            }
            segs.push({ start: m, len });
        }
    }
    return segs;
}

function endOf(seg: { start: number; len: number }) {
    // inklusives Ende (1..12)
    return ((seg.start + seg.len - 2) % 12) + 1;
}

function monthName(n: number) {
    return ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][n - 1] ?? String(n);
}
function shortMonth(n: number) {
    return ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][n - 1] ?? String(n);
}
