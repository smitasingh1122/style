"use client";

import { AuthProvider } from "@/components/AuthProvider";
import { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
