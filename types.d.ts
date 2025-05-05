interface Staffel {
    $id: string;
    $createdAt: string;
    produktID: string;
    saatPflanzDatum: Date;
    ernteProjektion: Date[],
    einheit: string;
    euroPreis: number;
    menge: number;
    mengeVerfuegbar: number;
    mengeAbgeholt: number;
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

interface BlogPost {
    $id: string;
    $createdAt: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    writtenBy: string;
    writtenAt: Date;
    updatedAt: Date;
}

interface Bestellung {
    $id: string;
    $createdAt: string;
    staffelID: string;
    quantity: string;
    price: number;
    pickup: Date;
    userID: string;
}