'use client'

import { useEffect, useState } from 'react';
import env from "@/app/env";
import { client } from '@/models/client/config';
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { databases } from '@/models/server/config';
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

export function StaffelEditForm({ staffel }: { staffel: Staffel }) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            produktID: staffel.produktID, // Assuming you want to edit the produktID as username
            saatDatum: typeof staffel.saatDatum === 'string' ? new Date(staffel.saatDatum) : staffel.saatDatum,
            euroPreis: staffel.euroPreis,
            einheit: staffel.einheit as "Gramm" | "Stück" | "Bund" | "Strauß",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Parse the date string back into a date object
        // if (values.saatDatum) {
        //     values.saatDatum = values.saatDatum
        // }
        
        // Now you can log the values or perform further actions
        console.log(format(values.saatDatum, "PPP"));
    }

    console.log(form.formState.errors)
   
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="produktID"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Produkt-ID</FormLabel>
                    <FormControl>
                    <Input placeholder="apfel-boskop" {...field} />
                    </FormControl>
                    <FormDescription>
                    ProduktID aus Sortiment.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            {/* add date Picker for saatDatum */}
            <FormField
                control={form.control}
                name="saatDatum"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Saatdatum</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"default"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) =>
                        // date > new Date() || date < new Date("1900-01-01")
                        // }
                        // initialFocus={field.value}
                    />
                    </PopoverContent>
                </Popover>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="euroPreis"
                render={({ field }) => (
                <FormItem className='w-1/2'>
                    <FormLabel>Preis in €</FormLabel>
                    <FormControl>
                    <Input placeholder="4.99" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                    ProduktID aus Sortiment.
                    </FormDescription> */}
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
            control={form.control}
            name="einheit"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Einheit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="w-1/2 text-black">
                        <SelectValue placeholder="Einheit auswählen..."/>
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Gramm">Gramm</SelectItem>
                    <SelectItem value="Stück">Stück</SelectItem>
                    <SelectItem value="Bund">Bund</SelectItem>
                    <SelectItem value="Strauß">Strauß</SelectItem>
                    </SelectContent>
                </Select>
                {/* <FormDescription>
                    test
                </FormDescription> */}
                <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit">Submit</Button>
        </form>
      </Form>
    )
}

export default function StaffelAdmin({ initialStaffeln }: { initialStaffeln: Staffel[] }) {
  const [staffeln, setStaffeln] = useState<Staffel[]>(initialStaffeln);
  const db = env.appwrite.db;
  const staffelCollection = env.appwrite.staffel_collection_id;
  const channel = `databases.${db}.collections.${staffelCollection}.documents`;
  const { user } = useAuthStore();
  useEffect(() => {
    const unsubscribe = client.subscribe(channel, (response) => {
        const eventType = response.events[0];
        console.log(response.events)
        const changedStaffel = response.payload as Staffel

        if (eventType.includes('create')) {
            setStaffeln((prevStaffeln) => [...prevStaffeln, changedStaffel])
        } else if (eventType.includes('delete')) {
            setStaffeln((prevStaffeln) => prevStaffeln.filter((staffel) => staffel.$id !== changedStaffel.$id))
        } else if (eventType.includes('update')) {
            setStaffeln((prevStaffeln) => prevStaffeln.map((staffel) => staffel.$id === changedStaffel.$id ? changedStaffel : staffel))
        }
    });
    return () => unsubscribe()
  }, [])

    // function handleEdit($id: string): void {
    //     const [isDialogOpen, setIsDialogOpen] = useState(false);
    //     const [selectedStaffel, setSelectedStaffel] = useState<Staffel | null>(null);

    //     setSelectedStaffel(staffeln.find((staffel) => staffel.$id === $id) || null);
    //     setIsDialogOpen(true);
    // }

  return (
    <div className="flex flex-wrap gap-4 justify-center pt-8">
    {/* {user && <h1 className="text-2xl font-bold text-center">Willkommen {user.name}</h1>} */}
    <Table className="w-full max-w-4xl">
    <TableHeader className="bg-gray-200">
      <TableRow>
        <TableCell className="font-bold">Produkt ID</TableCell>
        <TableCell className="font-bold">Saat Datum</TableCell>
        <TableCell className="font-bold">Ernte Projektion</TableCell>
        <TableCell className="font-bold">Menge</TableCell>
        <TableCell className="font-bold">Einheit</TableCell>
        <TableCell className="font-bold">Preis (Euro)</TableCell>
        <TableCell className="font-bold">Menge Verfügbar</TableCell>
        <TableCell className="font-bold">Bearbeiten</TableCell>
        <TableCell className="font-bold">Löschen</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {staffeln.map((staffel) => (
        <TableRow key={staffel.$id}>
            <TableCell>{staffel.produktID}</TableCell>
            <TableCell>{new Date(staffel.saatDatum).toDateString()}</TableCell>
            <TableCell>{new Date(staffel.ernteProjektion[0]).toDateString()} - {new Date(staffel.ernteProjektion[staffel.ernteProjektion.length - 1]).toDateString()}</TableCell>
            <TableCell>{staffel.menge}</TableCell>
            <TableCell>{staffel.einheit}</TableCell>
            <TableCell>{staffel.euroPreis}€</TableCell>
            <TableCell>{staffel.mengeVerfuegbar}</TableCell>
            <TableCell>
                <Dialog>
                    <DialogTrigger>Bearbeiten</DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Staffel Bearbeiten</DialogTitle>
                        <DialogDescription>
                            Hier können Sie die Staffel bearbeiten.
                        </DialogDescription>
                    </DialogHeader>
                    <StaffelEditForm staffel={staffel} />
                    </DialogContent>
                </Dialog>
            </TableCell>
            <TableCell>
                <button className="bg-red-100 hover:bg-red-200 text-white font-bold py-2 px-4 rounded">❌</button>
            </TableCell>
        </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
};
