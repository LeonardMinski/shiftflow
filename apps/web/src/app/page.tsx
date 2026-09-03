"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/lib/auth/useCurrentUser";

export default function Home() {
  const router = useRouter();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser.status !== "authenticated") {
      return;
    }

    router.replace(
      currentUser.user.role === "MANAGER" ? "/rota" : "/my-schedule",
    );
  }, [currentUser, router]);

  return null;
}
