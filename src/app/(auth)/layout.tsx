"use client";

// import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation";
import React from "react";


const Layout = ({children}: {children: React.ReactNode}) => {
  const {session, user} = useAuthStore();
  const router = useRouter()

  React.useEffect(() => {
    if (session && user) {
      const slugifiedName = user.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/users/${user.$id}/${slugifiedName}`);
    }
  }, [session, router])

  if (session) {
    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      {/* <BackgroundBeams /> */}
      <div className="relative">{children}</div>
    </div>
  )
}


export default Layout