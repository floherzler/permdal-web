// app/produkte/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { databases } from "@/models/client/config";
import env from "@/app/env";
import { Query, Models } from "appwrite";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

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

// Exact values from your DB:
const KATS = ["Obst", "Gemüse", "Kräuter", "Maschine", "Sonstiges"] as const;
type ViewMode = "cards" | "table";

export default function ProdukteKatalogPage() {
    const [selectedKat, setSelectedKat] = useState<(typeof KATS)[number]>("Obst");
    const [view, setView] = useState<ViewMode>("cards");

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [produkte, setProdukte] = useState<Produkt[]>([]);
    const [angeboteCount, setAngeboteCount] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const base = [Query.equal("hauptkategorie", selectedKat), Query.limit(200)];
                let list: Produkt[] = [];

                if (debouncedSearch.trim().length > 0) {
                    // OR-Suche über name ODER sorte -> zwei Requests, clientseitig mergen
                    const [byName] = await Promise.all([
                        databases.listDocuments(DB, PRODUKTE, [
                            ...base, Query.search("name", debouncedSearch.trim()),
                        ]),
                    ]);
                    list = dedupeById([...byName.documents,]).map(mapProdukt);
                    // optional sort by name
                    list.sort((a, b) => a.name.localeCompare(b.name, "de"));
                } else {
                    const prodRes = await databases.listDocuments(DB, PRODUKTE, [
                        ...base, Query.orderAsc("name"),
                    ]);
                    list = prodRes.documents.map(mapProdukt);
                }

                setProdukte(list);

                // Angebote-Counts für sichtbare Produkte
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
    }, [selectedKat, debouncedSearch]);

    return (
        <main className="min-h-screen container mx-auto p-4 space-y-4">
            {/* Top bar: title + search + view switch */}
            {/* --- Top controls (title+tabs on left, single toolbar on right) --- */}
            <section className="grid grid-cols-12 gap-4 items-start">
                {/* Left: Title + count + Category tabs */}
                <div className="col-span-12 lg:col-span-8 space-y-3">
                    <div>
                        <h1 className="text-3xl font-bold">Katalog</h1>
                        <p className="text-sm text-muted-foreground">
                            {loading ? "Laden…" : `${produkte.length} Produkte`}
                        </p>
                    </div>

                    {/* Category tabs */}
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
                </div>

                {/* Right: Single toolbar (Search + View switch) */}
                <div className="col-span-12 lg:col-span-4">
                    <div
                        className="
        flex flex-col gap-2 rounded-xl border bg-white/70
        backdrop-blur supports-[backdrop-filter]:bg-white/60
        p-2 shadow-sm lg:sticky lg:top-2
      "
                        role="region"
                        aria-label="Ansicht & Suche"
                    >
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    className="pl-8 w-full"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Suche (Name oder Sorte)…"
                                    aria-label="Produkte suchen"
                                />
                            </div>

                            {/* View switch */}
                            <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
                                <TabsList
                                    className="
              flex gap-1 rounded-lg
              bg-emerald-50/60 border border-emerald-100 p-1
            "
                                >
                                    <TabsTrigger
                                        value="cards"
                                        className="
                rounded-md px-3 py-1.5 text-sm shrink-0
                data-[state=active]:bg-emerald-200/60
                data-[state=active]:text-emerald-900
                data-[state=active]:shadow-sm
                hover:bg-emerald-100/40 transition
              "
                                    >
                                        Karten
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="table"
                                        className="
                rounded-md px-3 py-1.5 text-sm shrink-0
                data-[state=active]:bg-emerald-200/60
                data-[state=active]:text-emerald-900
                data-[state=active]:shadow-sm
                hover:bg-emerald-100/40 transition
              "
                                    >
                                        Tabelle
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </section>



            {/* Content */}
            {
                view === "cards" ? (
                    <CardsView produkte={produkte} angeboteCount={angeboteCount} />
                ) : (
                    <TableView produkte={produkte} angeboteCount={angeboteCount} />
                )
            }

            <div className="flex justify-between items-center">
                <Link href="/staffeln" className="text-blue-600 hover:underline">
                    Zu den Angeboten
                </Link>
                {!loading && produkte.length === 0 && (
                    <div className="text-sm text-muted-foreground">Keine Produkte gefunden.</div>
                )}
            </div>
        </main >
    );
}

/* ---------- Views ---------- */

function CardsView({
    produkte, angeboteCount,
}: { produkte: Produkt[]; angeboteCount: Record<string, number> }) {
    return (
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
    );
}

function TableView({
    produkte, angeboteCount,
}: { produkte: Produkt[]; angeboteCount: Record<string, number> }) {
    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Kategorie</TableHead>
                        <TableHead>Unterkategorie</TableHead>
                        <TableHead>Angebote</TableHead>
                        <TableHead className="w-[360px]">Saisonalität</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {produkte.map((p) => {
                        const count = angeboteCount[p.$id] ?? 0;
                        const hasAngebote = count > 0;
                        return (
                            <TableRow key={p.$id}>
                                <TableCell className="font-medium">
                                    <button
                                        type="button"
                                        className="hover:underline"
                                        onClick={() => { }}
                                        title="Produktseite (bald)"
                                    >
                                        {p.name}{p.sorte ? ` – ${p.sorte}` : ""}
                                    </button>
                                </TableCell>
                                <TableCell>{p.hauptkategorie}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {p.unterkategorie ?? "–"}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={[
                                            "text-xs px-2 py-1 rounded-full",
                                            hasAngebote ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-600",
                                        ].join(" ")}
                                    >
                                        {hasAngebote ? `${count} Angebote` : "Keine"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Saisonalitaet months={p.saisonalitaet ?? []} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

/* ---------- Helpers ---------- */

function mapProdukt(doc: any): Produkt {
    const raw = Array.isArray(doc.saisonalitaet) ? doc.saisonalitaet : [];
    const saisonalitaet: number[] = [
        ...new Set<number>(
            raw.map((m: any) => (typeof m === "string" ? parseInt(m, 10) : m))
        )
    ]
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

function dedupeById(docs: any[]) {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const d of docs) {
        if (!seen.has(d.$id)) { seen.add(d.$id); out.push(d); }
    }
    return out;
}

/** Debounce helper */
function useDebounce<T>(value: T, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

/** Season bands (supports gaps + wrap-around) */
function Saisonalitaet({
    months,
    seasonColors,
}: {
    months: number[];
    seasonColors?: Partial<{
        winter: string;  // e.g. "#60a5fa"
        spring: string;  // e.g. "#34d399"
        summer: string;  // e.g. "#ef4444"
        autumn: string;  // e.g. "#f59e0b"
    }>;
}) {
    // Default palette (override via prop)
    const C = {
        winter: seasonColors?.winter ?? "#7d7fecff", // blue-400
        spring: seasonColors?.spring ?? "#d3b634ff", // emerald-400
        summer: seasonColors?.summer ?? "#ef4444", // red-500
        autumn: seasonColors?.autumn ?? "#f59e0b", // amber-500
    };

    const segments = useMemo(() => computeSegments(months), [months]);
    const monthWidth = 100 / 12;

    return (
        <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Saisonalität</div>

            <div className="relative">
                {/* Underlay: gradient ribbons */}
                <div className="absolute inset-0 flex items-center z-0 pointer-events-none">
                    {segments.map((seg, idx) => {
                        // Build a multi-stop gradient with one stop per month in this segment
                        const monthsInSeg = Array.from({ length: seg.len }, (_, i) => ((seg.start + i - 1) % 12) + 1);
                        const stops = monthsInSeg.map((m, i) => {
                            const t = seg.len === 1 ? 0 : i / (seg.len - 1); // 0..1 along segment
                            const hsl = monthHsl(m, C);
                            return `${hslToCss(hsl)} ${Math.round(t * 100)}%`;
                        });
                        const gradient = `linear-gradient(to right, ${stops.join(", ")})`;

                        return (
                            <div
                                key={idx}
                                className="absolute h-3 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                                style={{
                                    left: `${(seg.start - 1) * monthWidth}%`,
                                    width: `${seg.len * monthWidth}%`,
                                    backgroundImage: gradient,
                                    opacity: 0.85,
                                }}
                                aria-label={`Saison von ${monthName(seg.start)} bis ${monthName(endOf(seg))}`}
                                title={`Saison: ${monthName(seg.start)} – ${monthName(endOf(seg))}`}
                            />
                        );
                    })}
                </div>

                {/* Overlay: neutral month cells + labels (stay readable) */}
                <div className="relative z-10 grid grid-cols-12 gap-px h-8">
                    {Array.from({ length: 12 }, (_, i) => (
                        <div
                            key={i}
                            className="bg-muted/70 rounded-[2px] flex items-center justify-center"
                            title={monthName(i + 1)}
                        >
                            <span className="text-[10px] leading-none text-foreground/90">
                                {shortMonth(i + 1)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---------- Gradient color math (season anchors) ---------- */

type HSL = { h: number; s: number; l: number };

function monthHsl(
    m: number,
    C: { winter: string; spring: string; summer: string; autumn: string }
): HSL {
    // Anchors at Jan(1)=Winter, Apr(4)=Spring, Jul(7)=Summer, Oct(10)=Autumn, wrap to Jan(13)=Winter
    const anchors = [
        { m: 1, c: hexToHsl(C.winter) },
        { m: 4, c: hexToHsl(C.spring) },
        { m: 7, c: hexToHsl(C.summer) },
        { m: 10, c: hexToHsl(C.autumn) },
        { m: 13, c: hexToHsl(C.winter) },
    ] as const;

    let i = 0;
    while (!(anchors[i].m <= m && m < anchors[i + 1].m)) i++;
    const a = anchors[i];
    const b = anchors[i + 1];
    const t = (m - a.m) / (b.m - a.m);
    return lerpHsl(a.c, b.c, t);
}

function lerpHsl(a: HSL, b: HSL, t: number): HSL {
    let dh = b.h - a.h;
    if (Math.abs(dh) > 180) dh -= Math.sign(dh) * 360; // shortest arc
    const h = mod(a.h + dh * t, 360);
    const s = a.s + (b.s - a.s) * t;
    const l = a.l + (b.l - a.l) * t;
    return { h, s, l };
}

function hslToCss(h: HSL) {
    return `hsl(${h.h.toFixed(1)} ${Math.round(h.s * 100)}% ${Math.round(h.l * 100)}%)`;
}

function hexToHsl(hex: string): HSL {
    const { r, g, b } = hexToRgb(hex);
    const rr = r / 255, gg = g / 255, bb = b / 255;
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rr: h = (gg - bb) / d + (gg < bb ? 6 : 0); break;
            case gg: h = (bb - rr) / d + 2; break;
            case bb: h = (rr - gg) / d + 4; break;
        }
        h *= 60;
    }
    return { h, s, l };
}
function hexToRgb(hex: string) {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

/* ---------- segment helpers (gaps + wrap + full year) ---------- */

function computeSegments(months: number[]) {
    const present = new Array<boolean>(13).fill(false);
    let count = 0;
    months.forEach((m) => {
        if (Number.isFinite(m) && m >= 1 && m <= 12 && !present[m]) {
            present[m] = true;
            count++;
        }
    });

    // Special case: full year
    if (count === 12) return [{ start: 1, len: 12 }];

    const segs: { start: number; len: number }[] = [];
    for (let m = 1; m <= 12; m++) {
        const prev = m === 1 ? 12 : m - 1;
        if (present[m] && !present[prev]) {
            let len = 1;
            let k = m === 12 ? 1 : m + 1;
            while (present[k] && k !== m) {
                len++;
                k = k === 12 ? 1 : k + 1;
            }
            segs.push({ start: m, len });
        }
    }
    return segs;
}
function endOf(seg: { start: number; len: number }) {
    return ((seg.start + seg.len - 2) % 12) + 1;
}
function monthName(n: number) {
    return ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][n - 1] ?? String(n);
}
function shortMonth(n: number) {
    return ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][n - 1] ?? String(n);
}