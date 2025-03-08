export const dynamic = "force-dynamic";

import React from "react";
import { getStaffeln } from "../actions/getStaffeln";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StaffelAdmin from "@/components/StaffelAdmin";

export default async function Page() {
  const staffeln: Staffel[] = await getStaffeln();
  return (
    <main className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Zentrale</h1>
        <StaffelAdmin initialStaffeln={staffeln} />

        <div className="grid grid-rows-2 gap-4">
            <div className="flex flex-row gap-4">
                <Card className="flex flex-col justify-between">
                    <CardHeader className="flex-row gap-4 items-center">
                    {/* <Avatar>
                        <AvatarImage src={productURLs[index]} alt={productNames[index]} className="rounded-md" />
                        <AvatarFallback>
                        {productNames[index].charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar> */}
                        <CardTitle>Produkt Hinzufügen</CardTitle>
                    </CardHeader>
                    <CardContent>
    
                    <CardDescription>TODO: Funktionalität</CardDescription>
                    {/* <CardDescription>Verfügbar: 10kg</CardDescription> */}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button>Hinzufügen</Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col justify-between">
                    <CardHeader className="flex-row gap-4 items-center">
                    {/* <Avatar>
                        <AvatarImage src={productURLs[index]} alt={productNames[index]} className="rounded-md" />
                        <AvatarFallback>
                        {productNames[index].charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar> */}
                        <CardTitle>Staffel Hinzufügen</CardTitle>
                    </CardHeader>
                    <CardContent>
    
                    <CardDescription>TODO: Funktionalität</CardDescription>
                    {/* <CardDescription>Verfügbar: 10kg</CardDescription> */}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button>Hinzufügen</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="flex flex-row gap-4">
                <Card>Card 3</Card>
                <Card>Card 4</Card>
            </div>
        </div>
    </main>
  );
};
