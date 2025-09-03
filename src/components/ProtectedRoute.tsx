"use client";

import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireEmailVerification = false,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { session, user, hydrated } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!hydrated) return; // Wait for auth store to hydrate

    // Check authentication requirements
    if (requireAuth && !session) {
      router.push(redirectTo);
      return;
    }

    // Check admin requirements
    if (requireAdmin && !user?.labels?.includes("admin")) {
      router.push(redirectTo);
      return;
    }

    // Check email verification requirements
    if (requireEmailVerification && !user?.emailVerification) {
      router.push(redirectTo);
      return;
    }

    setIsChecking(false);
  }, [session, user, hydrated, requireAuth, requireAdmin, requireEmailVerification, redirectTo, router]);

  // If not hydrated yet, show loading
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Überprüfe Berechtigung...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
