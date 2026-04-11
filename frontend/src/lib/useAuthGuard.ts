"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, getMe, hasPermission } from "@/lib/auth";

type UseAuthGuardResult = {
  user: AuthUser | null;
  loading: boolean;
  forbidden: boolean;
};

export function useAuthGuard(permission?: string): UseAuthGuardResult {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const currentUser = await getMe();
        setUser(currentUser);

        if (permission && !hasPermission(currentUser, permission)) {
          setForbidden(true);
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    void checkAccess();
  }, [permission, router]);

  return { user, loading, forbidden };
}
