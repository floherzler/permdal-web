'use client'

import env from "@/app/env";
import { client } from '@/models/client/config';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';

export default function StaffelList({ initialStaffeln }: { initialStaffeln: Staffel[] }) {
  const [staffeln, setStaffeln] = useState<Staffel[]>(initialStaffeln);
  const db = env.appwrite.db;
  const staffelCollection = env.appwrite.angebote_collection_id;
  const channel = `databases.${db}.collections.${staffelCollection}.documents`;
  // const { user } = useAuthStore();
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
  }, [channel])

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
            <TableCell className="font-bold">Menge Abgeholt</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffeln.map((staffel) => (
            <TableRow key={staffel.$id}>
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
    </div>
  );
};
