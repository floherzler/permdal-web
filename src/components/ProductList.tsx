'use client'

import { useEffect, useState } from 'react';
import env from "@/app/env";
import { client } from '@/models/client/config';
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { databases } from '@/models/client/config';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { useAuthStore } from '@/store/Auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    produktID: z.string().min(2, {
        message: "produktID must be at least 2 characters.",
    }),
    saatDatum: z.date(),
    euroPreis: z.preprocess((val) => parseFloat(String(val).replace(',', '.')), z.number().min(0.01, {
        message: "euroPreis muss mindestens 0.01 betragen und mit Punkt getrennt sein.",
    })),
    einheit: z.enum(["Gramm", "Stück", "Bund", "Strauß"]),
})

export default function ProduktListe({ initialProdukte }: { initialProdukte: Produkt[] }) {
    const [produkte, setProdukte] = useState<Produkt[]>(initialProdukte);
    const db = env.appwrite.db;
    const produktCollection = env.appwrite.produce_collection_id;
    const channel = `databases.${db}.collections.${produktCollection}.documents`;
    useEffect(() => {
        const unsubscribe = client.subscribe(channel, (response) => {
            const eventType = response.events[0];
            console.log(response.events)
            const changedProdukt = response.payload as Produkt

            if (eventType.includes('create')) {
                setProdukte((prevProdukte) => [...prevProdukte, changedProdukt])
            } else if (eventType.includes('delete')) {
                setProdukte((prevProdukte) => prevProdukte.filter((produkt) => produkt.$id !== changedProdukt.$id))
            } else if (eventType.includes('update')) {
                setProdukte((prevProdukte) => prevProdukte.map((produkt) => produkt.$id === changedProdukt.$id ? changedProdukt : produkt))
            }
        });
        return () => unsubscribe()
    }, [])

    return (
        <div className="flex flex-wrap gap-4 justify-center pt-8">
            {/* {user && <h1 className="text-2xl font-bold text-center">Willkommen {user.name}</h1>} */}
            <Table className="w-full max-w-4xl">
                <TableHeader className="bg-gray-200">
                    <TableRow>
                        <TableCell className="font-bold">ProduktID</TableCell>
                        <TableCell className="font-bold">Name</TableCell>
                        <TableCell className="font-bold">Sorte</TableCell>
                        <TableCell className="font-bold">Hauptkategorie</TableCell>
                        <TableCell className="font-bold">Unterkategorie</TableCell>
                        <TableCell className="font-bold">Lebensdauer</TableCell>
                        <TableCell className="font-bold">Fruchtfolge Vor</TableCell>
                        <TableCell className="font-bold">Fruchtfolge Nach</TableCell>
                        <TableCell className="font-bold">Bodenansprüche</TableCell>
                        <TableCell className="font-bold">Begleitpflanzen</TableCell>
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
                            <TableCell>{produkt.lebensdauer}</TableCell>
                            <TableCell>{produkt.fruchtfolge_vor}</TableCell>
                            <TableCell>{produkt.fruchtfolge_nach}</TableCell>
                            <TableCell>{produkt.bodenansprueche}</TableCell>
                            <TableCell>{produkt.begleitpflanzen}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
