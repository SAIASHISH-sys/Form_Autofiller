import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}