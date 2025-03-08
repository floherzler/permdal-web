export const dynamic = "force-dynamic";

import env from "@/app/env"
import { databases } from "@/models/server/config"

export async function getStaffeln(): Promise<Staffel[]> {
    const response = await databases.listDocuments(
        env.appwrite.db,
        env.appwrite.staffel_collection_id,
    )
    response.documents.forEach((doc) => console.log(doc.name))
    
    const staffeln: Staffel[] = response.documents.map((doc) => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        produktID: doc.produktID,
        saatDatum: doc.saatDatum,
        ernteProjektion: doc.ernteProjektion,
        einheit: doc.einheit,
        euroPreis: doc.euroPreis,
        menge: doc.menge,
        mengeVerfuegbar: doc.mengeVerfuegbar,
    }))

    return staffeln
}
 