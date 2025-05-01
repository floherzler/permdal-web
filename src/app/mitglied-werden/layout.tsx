"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { session, user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (session === null || user === null) {
      // Set a timeout to redirect if no user is detected after 3 seconds
      timeout = setTimeout(() => {
        router.push("/"); // Redirect to home page
      }, 100);
      return () => clearTimeout(timeout); // Clear the timeout if user data updates
    }

    // TODO(@floherzler): use online version
    if (!user?.emailVerification) {
      router.push("/"); // Redirect if not an admin
    } else {
      setLoading(false); // Stop loading when valid user is detected
    }

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, [session, user, router]);

  if (loading) {
    // Show a loading spinner or message while waiting for session/user
    return <p>Loading...</p>;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <div className="relative">{children}</div>
    </div>
  );
};

export default AdminLayout;
