"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

const AUTH_ROUTES = ["/login", "/register"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
