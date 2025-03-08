interface Staffel {
    $id: string;
    $createdAt: string;
    produktID: string;
    saatDatum: Date;
    ernteProjektion: Date[],
    einheit: string;
    euroPreis: number;
    menge: number;
    mengeVerfuegbar: number;
}

interface Produkt {
    $id: string;
    $createdAt: string;
    name: string;
    sorte: string;
    hauptkategorie: string;
    unterkategorie: string;
    lebensdauer: string;
    fruchtfolge_vor: string[];
    fruchtfolge_nach: string[];
    bodenansprueche: string;
    begleitpflanzen: string[];
}