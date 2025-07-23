export const dynamic = "force-dynamic";

import env from "@/app/env"
import { databases } from "@/models/client/config"

export async function getStaffeln(): Promise<Staffel[]> {
    console.log("Fetching staffeln...")
    const response = await databases.listDocuments(
        env.appwrite.db,
        env.appwrite.staffel_collection_id,
    )
    response.documents.forEach((doc) => console.log(doc.$id))

    const staffeln: Staffel[] = response.documents.map((doc) => ({
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

    return staffeln
}
