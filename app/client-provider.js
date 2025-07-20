"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "@/components/ui/provider";

export default function ClientProvider({ children }) {
  return <SessionProvider>
    <Provider>{children}</Provider>
  </SessionProvider>;
}
