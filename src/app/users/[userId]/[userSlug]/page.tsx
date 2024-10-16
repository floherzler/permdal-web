import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { Query } from "node-appwrite";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { storage } from "@/models/client/config";
import env from "@/app/env";

const Page = async ({ params }: { params: { userId: string; userSlug: string } }) => {
    const user = await  users.get<UserPrefs>(params.userId)
    const productIds = ['67101ee80002ac89b9f9', '67101ef300253ca391c2', '67101efe003dd6525840', '67101f08000502784a8d'];
    const productNames = ['Karotten', 'Lavendel', 'Kartoffeln', 'Kürbis'];
    const productURLs = [
      'https://cloud.appwrite.io/v1/storage/buckets/productStorage/files/67101ee80002ac89b9f9/view?project=670b925800275a11d5c1&project=670b925800275a11d5c1&mode=admin',
      'https://cloud.appwrite.io/v1/storage/buckets/productStorage/files/67101ef300253ca391c2/view?project=670b925800275a11d5c1&project=670b925800275a11d5c1&mode=admin',
      'https://cloud.appwrite.io/v1/storage/buckets/productStorage/files/67101efe003dd6525840/view?project=670b925800275a11d5c1&project=670b925800275a11d5c1&mode=admin',
      'https://cloud.appwrite.io/v1/storage/buckets/productStorage/files/67101f08000502784a8d/view?project=670b925800275a11d5c1&project=670b925800275a11d5c1&mode=admin',
    ];
    const images = await Promise.all(productIds.map(id => storage.getFilePreview(env.appwrite.storage, id)));
    return (
      <main>
        <h1 className="text-2xl font-bold text-center">Willkommen, {user.name}! 👋🏼</h1>
        <div className="p-8 grid grid-cols-2 gap-8 max-w-screen-lg mx-auto px-4">
          {// show card for each image and corresponding label
            images.map((image, index) => (
              <Card key={productIds[index]} className="flex flex-col justify-between">
                <CardHeader className="flex-row gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={productURLs[index]} alt={productNames[index]} className="rounded-md" />
                    <AvatarFallback>
                      {productNames[index].charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{productNames[index]}</CardTitle>
                </CardHeader>
                <CardContent>
  
                  <CardDescription>Preis: 2€/kg</CardDescription>
                  <CardDescription>Verfügbar: 10kg</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge variant={index % 2 === 0 ? "available" : "destructive"}>
                    {index % 2 === 0 ? "Verfügbar" : "Nicht verfügbar"}
                  </Badge>
                  <Button variant={"ghost"} disabled={index % 2 !== 0}>Bestellen</Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>
    );
};

export default Page;