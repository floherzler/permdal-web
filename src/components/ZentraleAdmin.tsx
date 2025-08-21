'use client'

import env from "@/app/env";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { client, databases } from '@/models/client/config';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';

const hauptkategorieValues = ["Obst", "Gemüse", "Kräuter", "Blumen", "Maschine", "Dienstleistung", "Sonstiges"] as const;
const unterkategorieValues = [
    "Hülsenfrüchte",
    "Kohlgemüse",
    "Wurzel-/Knollengemüse",
    "Blattgemüse/Salat",
    "Fruchtgemüse",
    "Zwiebelgemüse",
    "Kernobst",
    "Steinobst",
    "Beeren",
    "Zitrusfrüchte",
    "Schalenfrüchte"
] as const;
const lebensdauerValues = ["einjährig", "zweijährig", "mehrjährig"] as const;

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    sorte: z.string().optional(),
    hauptkategorie: z.enum(hauptkategorieValues).optional(),
    unterkategorie: z.enum(unterkategorieValues).optional(),
    lebensdauer: z.enum(lebensdauerValues).optional(),
    fruchtfolge_vor: z.array(z.string()).optional(),
    fruchtfolge_nach: z.array(z.string()).optional(),
    bodenansprueche: z.array(z.string()).optional(),
    begleitpflanzen: z.array(z.string()).optional(),
})

// function ArrayInput({ field, label }: { field: any, label: string }) {
//     const [inputValue, setInputValue] = useState('');

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(e.target.value);
//     };

//     const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             if (inputValue.trim() !== '') {
//                 field.onChange([...(field.value || []), inputValue.trim()]);
//                 setInputValue('');
//             }
//         }
//     };

//     const removeItem = (index: number) => {
//         const newValue = [...(field.value || [])];
//         newValue.splice(index, 1);
//         field.onChange(newValue);
//     };

//     return (
//         <FormItem>
//             <FormLabel>{label}</FormLabel>
//             <FormControl>
//                 <Input
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     onKeyDown={handleInputKeyDown}
//                 />
//             </FormControl>
//             <div className="flex flex-wrap gap-2 mt-2">
//                 {(field.value || []).map((item: string, index: number) => (
//                     <Badge key={index} variant="secondary">
//                         {item}
//                         <button type="button" onClick={() => removeItem(index)} className="ml-2 text-red-500">x</button>
//                     </Badge>
//                 ))}
//             </div>
//             <FormMessage />
//         </FormItem>
//     );
// }

function ProduktForm({ produkt, onSubmit }: { produkt?: Produkt, onSubmit: (values: z.infer<typeof formSchema>) => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: produkt
            ? {
                // **Text/ID fields** always controlled with ""
                id: produkt.$id ?? "",
                name: produkt.name ?? "",
                sorte: produkt.sorte ?? "",
                // **Selects** must be either one of the allowed strings or undefined
                hauptkategorie: hauptkategorieValues.includes(
                    produkt.hauptkategorie as typeof hauptkategorieValues[number],
                )
                    ? (produkt.hauptkategorie as typeof hauptkategorieValues[number])
                    : undefined,
                unterkategorie: unterkategorieValues.includes(
                    produkt.unterkategorie as typeof unterkategorieValues[number],
                )
                    ? (produkt.unterkategorie as typeof unterkategorieValues[number])
                    : undefined,
                lebensdauer: lebensdauerValues.includes(
                    produkt.lebensdauer as typeof lebensdauerValues[number],
                )
                    ? (produkt.lebensdauer as typeof lebensdauerValues[number])
                    : undefined,
                // **Arrays** stay as `[]` if missing
                fruchtfolge_vor: produkt.fruchtfolge_vor ?? [],
                fruchtfolge_nach: produkt.fruchtfolge_nach ?? [],
                bodenansprueche: Array.isArray(produkt.bodenansprueche)
                    ? produkt.bodenansprueche
                    : [],
                begleitpflanzen: produkt.begleitpflanzen ?? [],
            }
            : {
                // **New** → text/ID = ""; selects = undefined; arrays = []
                id: "",
                name: "",
                sorte: "",
                hauptkategorie: undefined,
                unterkategorie: undefined,
                lebensdauer: undefined,
                fruchtfolge_vor: [],
                fruchtfolge_nach: [],
                bodenansprueche: [],
                begleitpflanzen: [],
            },
    });



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sorte" render={({ field }) => (<FormItem><FormLabel>Sorte</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="id" render={({ field }) => (<FormItem><FormLabel>ID (name-sorte)</FormLabel><FormControl><Input {...field} placeholder="zB. name-sorte" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="hauptkategorie" render={({ field }) => (<FormItem><FormLabel>Hauptkategorie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-black">
                    <SelectValue placeholder="Wähle eine Kategorie" /></SelectTrigger></FormControl>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white">
                        <SelectItem value="Obst">Obst</SelectItem>
                        <SelectItem value="Gemüse">Gemüse</SelectItem>
                        <SelectItem value="Kräuter">Kräuter</SelectItem>
                        <SelectItem value="Blumen">Blumen</SelectItem>
                        <SelectItem value="Maschine">Maschine</SelectItem>
                        <SelectItem value="Dienstleistung">Dienstleistung</SelectItem>
                        <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="unterkategorie" render={({ field }) => (<FormItem><FormLabel>Unterkategorie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="text-black"><SelectValue placeholder="Wähle eine Unterkategorie" /></SelectTrigger></FormControl>
                    <SelectContent className="max-h-60 overflow-y-auto bg-white">
                        <SelectItem value="Hülsenfrüchte">Hülsenfrüchte</SelectItem>
                        <SelectItem value="Kohlgemüse">Kohlgemüse</SelectItem>
                        <SelectItem value="Wurzel-/Knollengemüse">Wurzel-/Knollengemüse</SelectItem>
                        <SelectItem value="Blattgemüse/Salat">Blattgemüse/Salat</SelectItem>
                        <SelectItem value="Fruchtgemüse">Fruchtgemüse</SelectItem>
                        <SelectItem value="Zwiebelgemüse">Zwiebelgemüse</SelectItem>
                        <SelectItem value="Kernobst">Kernobst</SelectItem>
                        <SelectItem value="Steinobst">Steinobst</SelectItem>
                        <SelectItem value="Beeren">Beeren</SelectItem>
                        <SelectItem value="Zitrusfrüchte">Zitrusfrüchte</SelectItem>
                        <SelectItem value="Schalenfrüchte">Schalenfrüchte</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>)} />
                {/* <FormField control={form.control} name="lebensdauer" render={({ field }) => (<FormItem><FormLabel>Lebensdauer</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="text-black"><SelectValue placeholder="Wähle Dauer" /></SelectTrigger></FormControl><SelectContent>
                    <SelectItem value="einjährig">einjährig</SelectItem>
                    <SelectItem value="zweijährig">zweijährig</SelectItem>
                    <SelectItem value="mehrjährig">mehrjährig</SelectItem></SelectContent></Select><FormMessage />
                </FormItem>)} />
                <FormField control={form.control} name="fruchtfolge_vor" render={({ field }) => <ArrayInput field={field} label="Fruchtfolge Vor" />} />
                <FormField control={form.control} name="fruchtfolge_nach" render={({ field }) => <ArrayInput field={field} label="Fruchtfolge Nach" />} />
                <FormField control={form.control} name="bodenansprueche" render={({ field }) => <ArrayInput field={field} label="Bodenansprüche" />} />
                <FormField control={form.control} name="begleitpflanzen" render={({ field }) => <ArrayInput field={field} label="Begleitpflanzen" />} /> */}
                <DialogClose asChild>
                    <Button type="submit" className="bg-green-800 text-white">Abschicken</Button>
                </DialogClose>
            </form>
        </Form>
    )
}

export default function ZentraleAdmin({ initialStaffeln, initialProdukte }: { initialStaffeln: Staffel[], initialProdukte: Produkt[] }) {
    const [, setStaffeln] = useState<Staffel[]>(initialStaffeln);
    const [produkte, setProdukte] = useState<Produkt[]>(initialProdukte);
    const db = env.appwrite.db;
    const staffelCollection = env.appwrite.angebote_collection_id;
    const produktCollection = env.appwrite.produce_collection_id;
    const staffelChannel = `databases.${db}.collections.${staffelCollection}.documents`;
    const produktChannel = `databases.${db}.collections.${produktCollection}.documents`;

    async function createProdukt(values: z.infer<typeof formSchema>) {
        try {
            const { id, ...data } = values;
            await databases.createDocument(
                db,
                produktCollection,
                id || 'unique()',
                data
            );
        } catch (error) {
            console.error("Error creating document:", error);
        }
    }

    async function updateProdukt(id: string, values: z.infer<typeof formSchema>) {
        try {
            const { id, ...data } = values;
            if (!id) throw new Error("Produkt ID is required for update.");
            await databases.updateDocument(
                db,
                produktCollection,
                id,
                data
            );
        } catch (error) {
            console.error("Error updating document:", error);
        }
    }

    useEffect(() => {
        const staffelUnsubscribe = client.subscribe(staffelChannel, (response) => {
            const eventType = response.events[0];
            const changedStaffel = response.payload as Staffel

            if (eventType.includes('create')) {
                setStaffeln((prevStaffeln) => [...prevStaffeln, changedStaffel])
            } else if (eventType.includes('delete')) {
                setStaffeln((prevStaffeln) => prevStaffeln.filter((staffel) => staffel.$id !== changedStaffel.$id))
            } else if (eventType.includes('update')) {
                setStaffeln((prevStaffeln) => prevStaffeln.map((staffel) => staffel.$id === changedStaffel.$id ? changedStaffel : staffel))
            }
        });

        const produktUnsubscribe = client.subscribe(produktChannel, (response) => {
            const eventType = response.events[0];
            const changedProdukt = response.payload as Produkt

            if (eventType.includes('create')) {
                setProdukte((prevProdukte) => [...prevProdukte, changedProdukt])
            } else if (eventType.includes('delete')) {
                setProdukte((prevProdukte) => prevProdukte.filter((produkt) => produkt.$id !== changedProdukt.$id))
            } else if (eventType.includes('update')) {
                setProdukte((prevProdukte) => prevProdukte.map((produkt) => produkt.$id === changedProdukt.$id ? changedProdukt : produkt))
            }
        });

        return () => {
            staffelUnsubscribe();
            produktUnsubscribe();
        }
    }, [staffelChannel, produktChannel])

    return (
        <div className="flex gap-8 justify-center pt-8">
            <div>
                <h2 className="text-2xl font-bold text-center mb-4">Produkte</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-green-800 text-white hover:bg-green-700">
                            Produkt zum Katalog hinzufügen
                        </Button>
                    </DialogTrigger>

                    <DialogContent
                        className="
                        bg-white            /* make the panel white */
                        p-6                 /* add some padding */
                        rounded-lg          /* soften the corners */
                        shadow-lg           /* lift it off the page */
                        max-h-[90vh]
                        overflow-y-auto
                        "
                    >
                        <DialogHeader>
                            <DialogTitle>Neues Produkt erstellen</DialogTitle>
                        </DialogHeader>
                        <ProduktForm onSubmit={createProdukt} />
                    </DialogContent>
                </Dialog>

                <Table className="w-full table-fixed">
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            <TableCell className="font-bold">ProduktID</TableCell>
                            <TableCell className="font-bold">Name</TableCell>
                            <TableCell className="font-bold">Sorte</TableCell>
                            <TableCell className="font-bold">Hauptkategorie</TableCell>
                            <TableCell className="font-bold">Unterkategorie</TableCell>
                            <TableCell className="font-bold">Aktionen</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {produkte.map((produkt) => (
                            <TableRow key={produkt.$id} className="hover:bg-gray-100 cursor-pointer">
                                <TableCell>{produkt.$id}</TableCell>
                                <TableCell>{produkt.name}</TableCell>
                                <TableCell>{produkt.sorte}</TableCell>
                                <TableCell>{produkt.hauptkategorie}</TableCell>
                                <TableCell>{produkt.unterkategorie}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>Bearbeiten</Button>
                                        </DialogTrigger>
                                        <DialogContent
                                            className="
                                            bg-white            /* make the panel white */
                                            p-6                 /* add some padding */
                                            rounded-lg          /* soften the corners */
                                            shadow-lg           /* lift it off the page */
                                            max-h-[90vh]
                                            overflow-y-auto
                                            "
                                        >
                                            <DialogHeader>
                                                <DialogTitle>Produkt Bearbeiten</DialogTitle>
                                            </DialogHeader>
                                            <ProduktForm produkt={produkt} onSubmit={(values) => updateProdukt(produkt.$id, values)} />
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* <div>
                <h2 className="text-2xl font-bold text-center mb-4">Staffeln</h2>
                <Table className="w-full max-w-4xl">
                    <TableHeader className="bg-gray-200">
                        <TableRow>
                            <TableCell className="font-bold">Staffel ID</TableCell>
                            <TableCell className="font-bold">Produkt ID</TableCell>
                            <TableCell className="font-bold">Saat Datum</TableCell>
                            <TableCell className="font-bold">Ernte Projektion</TableCell>
                            <TableCell className="font-bold">Menge</TableCell>
                            <TableCell className="font-bold">Einheit</TableCell>
                            <TableCell className="font-bold">Preis (Euro)</TableCell>
                            <TableCell className="font-bold">Menge Verfügbar</TableCell>
                            <TableCell className="font-bold">Menge Abgeholt</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffeln.map((staffel) => (
                            <TableRow key={staffel.$id}>
                                <TableCell>{staffel.$id}</TableCell>
                                <TableCell>{staffel.produktID}</TableCell>
                                <TableCell>{new Date(staffel.saatPflanzDatum).toDateString()}</TableCell>
                                <TableCell>{new Date(staffel.ernteProjektion[0]).toDateString()} - {new Date(staffel.ernteProjektion[staffel.ernteProjektion.length - 1]).toDateString()}</TableCell>
                                <TableCell>{staffel.menge}</TableCell>
                                <TableCell>{staffel.einheit}</TableCell>
                                <TableCell>{staffel.euroPreis}€</TableCell>
                                <TableCell>{staffel.mengeVerfuegbar}</TableCell>
                                <TableCell>{staffel.mengeAbgeholt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div> */}
        </div>
    );
};