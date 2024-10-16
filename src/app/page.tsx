"use client";
 
import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.3] dark:bg-black dark:border-white/[0.2] border-black/[0.3] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Permdal - Bio Obst & Gemüse
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Mit ❤️ aus Brandenburg
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="/img/permdal-logo-black-bg.png"
            height="500"
            width="1000"
            className="h-60  object-cover rounded-xl group-hover/card:shadow-xl"
            alt="Permdal Logo"
          />
        </CardItem>
        <div className="flex justify-center items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href="/signup"
            target="__blank"
            className="px-8 py-2 rounded-xl text-xl font-normal dark:text-white"
          >
            Registrieren →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>

    </main>
  );
}
