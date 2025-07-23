"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};

export default function SignUp() {
    const { login, createAccount } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!name || !email || !password) {
            setError(() => "Please fill out all fields");
            return;
        }

        setIsLoading(() => true);
        setError(() => "");

        const response = await createAccount(
            `${name}`,
            email.toString(),
            password.toString()
        );

        if (response.error) {
            setError(() => response.error!.message);
        } else {
            const loginResponse = await login(email.toString(), password.toString());
            if (loginResponse.error) {
                setError(() => loginResponse.error!.message);
            }
        }

        setIsLoading(() => false);
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Willkommen bei Permdal!
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                <br /> Hast du schon ein Profil? Zum{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                    Login
                </Link>{" "}
            </p>

            {error && (
                <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                    <LabelInputContainer>
                        <Label htmlFor="name">Name</Label>
                        <Input className="text-black" id="name" name="name" placeholder="Name" type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email-Adresse</Label>
                    <Input
                    className="text-black" 
                        id="email"
                        name="email"
                        placeholder="email@beispiel.de"
                        type="email"
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Passwort</Label>
                    <Input className="text-black"  id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <Button
                    className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    disabled={isLoading}
                >
                    Registrieren &rarr;
                </Button>
            </form>
        </div>
    );
}