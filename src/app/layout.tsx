import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import localFont from "next/font/local";
import { ConvexClientProvider } from "./convex-client-provider";

export const metadata: Metadata = {
  title: "Personal Finance App",
  description:
    "Prototype de suivi de budget personnel réalisé pour Frontend Mentor.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const publicSans = localFont({
  src: "../../public/fonts/PublicSans-VariableFont_wght.ttf",
  variable: "--font-public-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${publicSans.variable}`}>
      <body className="bg-orange-100">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
