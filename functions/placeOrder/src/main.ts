// index.ts — Appwrite Cloud Function (Deno, SDK v7), "place order"

import {
    Client,
    Databases,
    Users,
    ID,
    Permission,
    Role
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
        log(`[placeOrder] Incoming request. Caller present: ${Boolean(callerId)} 🔒`)
        if (!callerId) return fail(res, "Unauthenticated: missing x-appwrite-user-id header", 401);

        // --- Inputs (body JSON or query string) ---
        let body: Body = {};
        // 1) Try the standard fetch-style JSON helper if available
        try {
            body = await req.json();
            log(`[placeOrder] Parsed JSON body keys: ${Object.keys(body).join(',')} 🧾`)
        } catch {
            // ignore if not JSON
            log("[placeOrder] No JSON body provided (or parse failed) 🧾")
        }
        // 2) Appwrite Functions v7: prefer bodyJson/bodyText on the request
        try {
            if (!Object.keys(body).length && req.bodyJson && typeof req.bodyJson === 'object') {
                body = req.bodyJson as Body;
                log(`[placeOrder] Parsed req.bodyJson keys: ${Object.keys(body).join(',')} 🧾`)
            } else if (!Object.keys(body).length && typeof req.bodyText === 'string' && req.bodyText.length > 0) {
                log(`[placeOrder] Found bodyText (length ${req.bodyText?.length ?? 0}) 🧾`)
                try {
                    const parsed = JSON.parse(req.bodyText);
                    if (parsed && typeof parsed === 'object') {
                        body = parsed as Body;
                        log(`[placeOrder] Parsed bodyText JSON keys: ${Object.keys(body).join(',')}`)
                    }
                } catch (e) {
                    log(`[placeOrder] bodyText is not valid JSON (parse error) ⚠️`)
                }
            }
        } catch (e) {
            log(`[placeOrder] Error reading request body (non-fatal) ⚠️`)
        }
        // 3) Legacy fallbacks sometimes seen (bodyRaw/payload)
        try {
            if (!Object.keys(body).length) {
                const raw: unknown = (typeof (req as any).bodyRaw === 'string')
                    ? (req as any).bodyRaw
                    : (typeof (req as any).payload === 'string' ? (req as any).payload : undefined);
                if (typeof raw === 'string' && raw.length > 0) {
                    log(`[placeOrder] Found raw payload (length ${String((raw as string)?.length ?? 0)}) 🧾`)
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed && typeof parsed === 'object') {
                            body = parsed as Body;
                            log(`[placeOrder] Parsed raw payload keys: ${Object.keys(body).join(',')} 🧾`)
                        }
                    } catch (e) {
                        log(`[placeOrder] Raw payload is not valid JSON (parse error) ⚠️`)
                    }
                }
            }
        } catch (e) {
            log(`[placeOrder] Error inspecting raw payload (non-fatal) ⚠️`)
        }

        const url = new URL(req.url);
        const angebotID = (body.angebotID ?? url.searchParams.get("angebotID") ?? "").trim();
        const mitgliedschaftID = ((body.mitgliedschaftID ?? url.searchParams.get("mitgliedschaftID") ?? "") as string).trim();
        const menge = Number(body.menge ?? url.searchParams.get("menge"));
        log(`[placeOrder] Inputs -> angebotIDProvided=${!!angebotID} mitgliedschaftProvided=${!!mitgliedschaftID} menge=${menge} 🔎`)

        // mitgliedschaftID is optional now; require only angebotID and menge > 0
        if (!angebotID || !Number.isFinite(menge) || menge <= 0) {
            return fail(res, "Invalid input: require { angebotID, menge > 0 }");
        }

        // --- Appwrite clients (reuse your env pattern) ---
        const endpoint = Deno.env.get("APPWRITE_FUNCTION_API_ENDPOINT") ?? (process.env.APPWRITE_FUNCTION_API_ENDPOINT as string | undefined) ?? "";
        const projectId = Deno.env.get("APPWRITE_FUNCTION_PROJECT_ID") ?? (process.env.APPWRITE_FUNCTION_PROJECT_ID as string | undefined) ?? "";
        const client = new Client()
            .setEndpoint(endpoint)
            .setProject(projectId)
            .setKey(req.headers["x-appwrite-key"] ?? "");
        log(`[placeOrder] Appwrite client configured ✅`)

        const db = new Databases(client);
        const users = new Users(client);

        const DB_ID = Deno.env.get("DB_ID")!;
        const COLL_ANGEBOTE = Deno.env.get("COLL_ANGEBOTE")!;
        const COLL_BESTELLUNG = Deno.env.get("COLL_BESTELLUNG")!;
        const COLL_MITGLIEDSCHAFT = Deno.env.get("COLL_MITGLIEDSCHAFT")!;
        const COLL_PRODUKTE = Deno.env.get("COLL_PRODUKTE") ?? "";
        const COLL_NOTIFICATIONS = Deno.env.get("COLL_NOTIFICATIONS") ?? "";
        const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "";
        log(`[placeOrder] Environment loaded: DB configured=${!!DB_ID}, collections present: angebote=${!!COLL_ANGEBOTE}, bestellung=${!!COLL_BESTELLUNG}, mitgliedschaft=${!!COLL_MITGLIEDSCHAFT} 📦`)

        // --- Load & validate membership (optional) ---
        let mitgliedschaft: any = null;
        if (mitgliedschaftID) {
            log(`[placeOrder] Fetching membership (if provided) 🔎`)
            mitgliedschaft = await db.getDocument(DB_ID, COLL_MITGLIEDSCHAFT, mitgliedschaftID);
            log(`[placeOrder] Membership fetched. status=${mitgliedschaft?.status} ✅`)
            if (mitgliedschaft.userID !== callerId) {
                return fail(res, "Membership does not belong to caller", 403);
            }
            if (mitgliedschaft.status !== "aktiv") {
                return fail(res, "Membership is not active", 409, { status: mitgliedschaft.status });
            }
        } else {
            log(`[placeOrder] No mitgliedschaftID provided; proceeding without membership checks ⚠️`)
        }

        // (Optional) enforce membership quota here:
        // const kontingent = Number(mitgliedschaft.kontingent_aktuell ?? mitgliedschaft.kontingent_start ?? 0);
        // const preisCheck = ... compare against order total later if you want hard quota

        // --- Load Angebot ---
        log(`[placeOrder] Fetching angebot (id not logged) 🔎`)
        const angebot: any = await db.getDocument(DB_ID, COLL_ANGEBOTE, angebotID);
        log(`[placeOrder] Angebot fetched. verfuegbar=${angebot?.mengeVerfuegbar} einheit=${angebot?.einheit} preis=${angebot?.euroPreis} 📦`)

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
        log(`[placeOrder] Pricing snapshot -> einheit=${einheit} pE=${preis_einheit} menge=${menge} total=${preis_gesamt} 🧾`)

        // --- Update Angebot availability (simple check-then-update) ---
        // Note: SDK v7 doesn’t support optimistic "ifRevision" guard; in high traffic,
        // you can wrap this block in a small retry loop.
        const nextVerf = verf - menge;
        const nextAbgeholt = Number(angebot.mengeAbgeholt ?? 0) + menge;
        log(`[placeOrder] Update angebote availability -> vorher=${verf} nachher=${nextVerf} abgeholt=${nextAbgeholt} 🔄`)

        await db.updateDocument(DB_ID, COLL_ANGEBOTE, angebotID, {
            mengeVerfuegbar: nextVerf,
            mengeAbgeholt: nextAbgeholt,
        });
        log(`[placeOrder] Angebot availability updated`)

        // --- Create Bestellung (snapshot) ---
        const orderId = ID.unique();
        const nowIso = new Date().toISOString();

        log(`[placeOrder] Creating order document (new) 📝`)
        const bestellung = await db.createDocument(DB_ID, COLL_BESTELLUNG, orderId, {
            userID: callerId,
            mitgliedschaftID: mitgliedschaftID || null,
            angebotID: angebotID,
            menge,
            einheit,               // snapshot
            preis_einheit,         // snapshot
            preis_gesamt,          // computed
            produkt_name,         // snapshot
            abholung: angebot.abholung ?? null,
            status: "angefragt",
            user_mail: "",         // optional: fill below if we can read user
        },
            // grant read permission to the caller so they can view their order
            [Permission.read(Role.user(callerId))]
        );
        log(`[placeOrder] Order document created ✅`)

        // --- Load user email (best effort) ---
        let userEmail = "";
        try {
            log(`[placeOrder] Fetching user profile (caller) 🔎`)
            const user = await users.get(callerId);
            // @ts-ignore older SDK type
            userEmail = (user as any).email ?? "";
            if (userEmail) {
                await db.updateDocument(DB_ID, COLL_BESTELLUNG, bestellung.$id, { user_mail: userEmail });
                log(`[placeOrder] Wrote user email to order (masked) 🔒`)
            }
        } catch (_e) {
            // not fatal
            log("[placeOrder] Could not fetch user or write email (non-fatal) ⚠️")
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
                log("[placeOrder] Notification write failed (non-fatal) ⚠️");
            }
        }

        return ok(res, {
            success: true,
            orderId: bestellung.$id,
            angebot: { vorher: verf, nachher: nextVerf },
            preis_gesamt,
        }, 201);
    } catch (e: any) {
        // Log the error details to the function logs for debugging. We still return a generic
        // message to the caller to avoid leaking internal state to the client.
        try {
            const msg = String(e?.message ?? e ?? 'Unknown error');
            const stack = String(e?.stack ?? '');
            error(`[placeOrder] Uncaught error: ${msg} 🚨`);
            if (stack) error(`[placeOrder] Stack trace: ${stack.split('\n').slice(0, 5).join(' | ')} ...`);
        } catch (_logErr) {
            // If logging itself fails, fall back to a minimal message
            error('[placeOrder] Uncaught error (failed to stringify) 🚨');
        }
        return fail(res, "Internal error", 500);
    }
};
