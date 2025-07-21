import { Client, Users, Databases } from "https://deno.land/x/appwrite@7.0.0/mod.ts";
import { parse } from "jsr:@std/csv";

export default async ({ req, res, log, error }: any) => {
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers["x-appwrite-key"] ?? "");
  const users = new Users(client);
  const db = new Databases(client);

  // Fetch CSV file from Nextcloud using a sharing link
  try {
    const csvUrl = Deno.env.get("NEXTCLOUD_CSV_URL");
    if (!csvUrl) {
      throw new Error("NEXTCLOUD_CSV_URL environment variable is not set.");
    }

    // TODO: Implement a dry‑run mode here to validate CSV schema before actual sync.
    //   - Check required headers
    //   - Verify data types (dates, numbers, IDs)
    //   - Produce a validation report (e.g., as JSON) and abort on errors.

    // Fetch the CSV content
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = await parse(csvText, {
      skipFirstRow: true, // use header
      separator: ';'
    });

    // TODO: Backup existing data snapshot before any writes
    //   e.g., export current "produkte" and "staffeln" into a timestamped JSON/CSV in Cloud Storage.

    // TODO: Split CSV into two logical sets:
    //   1. product data ("produkte"): static fields per sort
    //   2. season data ("staffeln"): dynamic fields (saatDatum, ernteProjektion, menge, mengeVerfuegbar, euroPreis)
    //   This will help minimize redundant writes and keep history clean.

    // TODO: For each row:
    //   - Lookup or INSERT into "produkte" collection by sorte_id
    //     • Ensure unique constraint on sorte_id to avoid duplicates
    //   - Then INSERT or UPDATE a document in "staffeln" collection
    //     • use a composite key (sorte_id + start date) for idempotency
    //   - Wrap per-row operations in a transaction if supported (or simulate via multi‑step rollback)

    // TODO: Track amounts changes:
    //   - Compare incoming `mengeVerfuegbar` and `menge` with existing values
    //   - If changed, write an entry into an "amounts" audit-collection:
    //       { staffel_id, oldMenge, newMenge, oldAvailable, newAvailable, timestamp }
    //   - Optionally regenerate a small CSV export for the amounts only, for easy download.

    // TODO: Log summary metrics after processing:
    //   - rows read, products created/updated, seasons created/updated, amount changes logged
    //   - send notification (email/Slack) if error rate > threshold

    // Log the first row
    if (rows.length > 0) {
      log(`First row: ${JSON.stringify(rows[0])}`);
    } else {
      log("CSV file contains no data rows.");
    }

    // Log the first row after the header
    if (rows.length > 1) {
      log(`First row after header: ${JSON.stringify(rows[1])}`);
    } else {
      log("CSV file contains no data rows.");
    }
  } catch (err) {
    // TODO: On error, trigger rollback or restore from backup if partial writes occurred
    error(`Error processing CSV: ${err.message}`);
    return res.json({ success: false, error: err.message });
  }

  // Respond with success
  return res.json({
    success: true,
    message: "CSV processed successfully. Check logs for details.",
  });
};
