// index.ts — Appwrite Cloud Function (Deno, SDK v7), "place order"

import {
    Client,
    Databases,
    Users,
    ID,
} from "https://deno.land/x/appwrite@7.0.0/mod.ts";

type Body = {
    angebotID?: string;
    mitgliedschaftID?: string;
    menge?: number;
};

function ok(res: any, data: unknown, status = 200) {
    return res.json(data, status);
}
function fail(res: any, msg: string, status = 400, extra: Record<string, unknown> = {}) {
    return res.json({ success: false, error: msg, ...extra }, status);
}

export default async ({ req, res, log, error }: any) => {
    try {
        // --- Caller auth (provided by Appwrite gateway) ---
        const callerId: string | undefined =
            req.headers["x-appwrite-user-id"] ?? req.headers["X-Appwrite-User-Id"];
        log(`[placeOrder] Incoming request. Has callerId: ${Boolean(callerId)}`)
        if (!callerId) return fail(res, "Unauthenticated: missing x-appwrite-user-id header", 401);

        // --- Inputs (body JSON or query string) ---
        let body: Body = {};
        try {
            body = await req.json();
            log(`[placeOrder] Parsed JSON body keys: ${Object.keys(body).join(',')}`)
        } catch {
            // ignore if not JSON
            log("[placeOrder] No JSON body provided (or parse failed)")
        }

        const url = new URL(req.url);
        const angebotID = (body.angebotID ?? url.searchParams.get("angebotID") ?? "").trim();
        const mitgliedschaftID = (body.mitgliedschaftID ?? url.searchParams.get("mitgliedschaftID") ?? "").trim();
        const menge = Number(body.menge ?? url.searchParams.get("menge"));
        log(`[placeOrder] Inputs -> angebotID=${angebotID || '(empty)'} mitgliedschaftID=${mitgliedschaftID || '(empty)'} menge=${menge}`)

        if (!angebotID || !mitgliedschaftID || !Number.isFinite(menge) || menge <= 0) {
            return fail(res, "Invalid input: require { angebotID, mitgliedschaftID, menge > 0 }");
        }

        // --- Appwrite clients (reuse your env pattern) ---
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
            .setKey(req.headers["x-appwrite-key"] ?? "");
        log(`[placeOrder] Using endpoint=${process.env.APPWRITE_FUNCTION_API_ENDPOINT} project=${process.env.APPWRITE_FUNCTION_PROJECT_ID}`)

        const db = new Databases(client);
        const users = new Users(client);

        const DB_ID = Deno.env.get("DB_ID")!;
        const COLL_ANGEBOTE = Deno.env.get("COLL_ANGEBOTE")!;
        const COLL_BESTELLUNG = Deno.env.get("COLL_BESTELLUNG")!;
        const COLL_MITGLIEDSCHAFT = Deno.env.get("COLL_MITGLIEDSCHAFT")!;
        const COLL_PRODUKTE = Deno.env.get("COLL_PRODUKTE") ?? "";
        const COLL_NOTIFICATIONS = Deno.env.get("COLL_NOTIFICATIONS") ?? "";
        const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "";
        log(`[placeOrder] Env -> DB=${DB_ID} ANG=${COLL_ANGEBOTE} ORD=${COLL_BESTELLUNG} MITGL=${COLL_MITGLIEDSCHAFT} PROD=${Boolean(COLL_PRODUKTE)} NOTIF=${Boolean(COLL_NOTIFICATIONS)}`)

        // --- Load & validate membership ---
        log(`[placeOrder] Fetch membership ${mitgliedschaftID}`)
        const mitgliedschaft: any = await db.getDocument(DB_ID, COLL_MITGLIEDSCHAFT, mitgliedschaftID);
        log(`[placeOrder] Membership fetched. user_id=${mitgliedschaft?.user_id} status=${mitgliedschaft?.status}`)
        if (mitgliedschaft.user_id !== callerId) {
            return fail(res, "Membership does not belong to caller", 403);
        }
        if (mitgliedschaft.status !== "aktiv") {
            return fail(res, "Membership is not active", 409, { status: mitgliedschaft.status });
        }

        // (Optional) enforce membership quota here:
        // const kontingent = Number(mitgliedschaft.kontingent_aktuell ?? mitgliedschaft.kontingent_start ?? 0);
        // const preisCheck = ... compare against order total later if you want hard quota

        // --- Load Angebot ---
        log(`[placeOrder] Fetch angebot ${angebotID}`)
        const angebot: any = await db.getDocument(DB_ID, COLL_ANGEBOTE, angebotID);
        log(`[placeOrder] Angebot fetched. verfuegbar=${angebot?.mengeVerfuegbar} einheit=${angebot?.einheit} preis=${angebot?.euroPreis}`)

        const verf = Number(angebot.mengeVerfuegbar ?? 0);
        if (!Number.isFinite(verf) || verf < menge) {
            return fail(res, "Not enough available", 409, { available: verf, requested: menge });
        }

        // --- Resolve product name (optional) ---
        let produkt_name = "";
        try {
            if (COLL_PRODUKTE && angebot.produktID) {
                log(`[placeOrder] Resolving product ${angebot.produktID}`)
                const prod: any = await db.getDocument(DB_ID, COLL_PRODUKTE, angebot.produktID);
                produkt_name = [prod.name, prod.sorte].filter(Boolean).join(" – ");
            }
        } catch (_e) {
            // ignore, we'll fall back below
            log("[placeOrder] Product resolution failed, will use fallback name")
        }
        if (!produkt_name) {
            // last resort snapshot
            produkt_name = angebot.produktName ?? angebot.produkt ?? `Produkt ${angebot.produktID ?? ""}`.trim();
        }
        log(`[placeOrder] Using product name: ${produkt_name}`)

        // --- Snapshot pricing & unit ---
        const einheit = String(angebot.einheit);
        const preis_einheit = Number(angebot.euroPreis ?? 0);
        const preis_gesamt = Number((menge * preis_einheit).toFixed(2));
        log(`[placeOrder] Pricing snapshot -> einheit=${einheit} pE=${preis_einheit} menge=${menge} total=${preis_gesamt}`)

        // --- Update Angebot availability (simple check-then-update) ---
        // Note: SDK v7 doesn’t support optimistic "ifRevision" guard; in high traffic,
        // you can wrap this block in a small retry loop.
        const nextVerf = verf - menge;
        const nextAbgeholt = Number(angebot.mengeAbgeholt ?? 0) + menge;
        log(`[placeOrder] Update angebot availability -> vorher=${verf} nachher=${nextVerf} abgeholt=${nextAbgeholt}`)

        await db.updateDocument(DB_ID, COLL_ANGEBOTE, angebotID, {
            mengeVerfuegbar: nextVerf,
            mengeAbgeholt: nextAbgeholt,
        });
        log(`[placeOrder] Angebot availability updated`)

        // --- Create Bestellung (snapshot) ---
        const orderId = ID.unique();
        const nowIso = new Date().toISOString();

        log(`[placeOrder] Create order document id=${orderId}`)
        const bestellung = await db.createDocument(DB_ID, COLL_BESTELLUNG, orderId, {
            user_id: callerId,
            mitgliedschaft_id: mitgliedschaftID,
            angebot_id: angebotID,
            menge,
            einheit,               // snapshot
            preis_einheit,         // snapshot
            preis_gesamt,          // computed
            produkt_name,          // snapshot
            abholung: angebot.abholung ?? null,
            status: "offen",
            erstellt_am: nowIso,
            user_mail: "",         // optional: fill below if we can read user
        });
        log(`[placeOrder] Order document created -> ${bestellung?.$id}`)

        // --- Load user email (best effort) ---
        let userEmail = "";
        try {
            log(`[placeOrder] Fetch user ${callerId}`)
            const user = await users.get(callerId);
            // @ts-ignore older SDK type
            userEmail = (user as any).email ?? "";
            if (userEmail) {
                await db.updateDocument(DB_ID, COLL_BESTELLUNG, bestellung.$id, { user_mail: userEmail });
                log(`[placeOrder] Wrote user email to order`)
            }
        } catch (_e) {
            // not fatal
            log("[placeOrder] Could not fetch user or write email (non-fatal)")
        }

        // --- Notification (for admin panel) ---
        if (COLL_NOTIFICATIONS) {
            try {
                await db.createDocument(DB_ID, COLL_NOTIFICATIONS, ID.unique(), {
                    type: "order_created",
                    order_id: bestellung.$id,
                    angebot_id: angebotID,
                    user_id: callerId,
                    user_email: userEmail,
                    admin_email: ADMIN_EMAIL || null,
                    subject: `Neue Bestellung: ${produkt_name}`,
                    message: [
                        `Bestellung ${bestellung.$id}`,
                        `Produkt: ${produkt_name}`,
                        `Menge: ${menge} ${einheit}`,
                        `Preis: ${preis_einheit.toFixed(2)} €/ ${einheit}`,
                        `Gesamt: ${preis_gesamt.toFixed(2)} €`,
                    ].join("\n"),
                    created_at: nowIso,
                    delivered: false, // your admin UI can flip this after sending an email manually/automatically
                });
            } catch (e) {
                log("[placeOrder] Notification write failed: " + String(e));
            }
        }

        return ok(res, {
            success: true,
            orderId: bestellung.$id,
            angebot: { vorher: verf, nachher: nextVerf },
            preis_gesamt,
        }, 201);
    } catch (e: any) {
        error("[placeOrder] Uncaught error: " + (e?.message ?? String(e)));
        return fail(res, "Internal error", 500, { details: String(e) });
    }
};
