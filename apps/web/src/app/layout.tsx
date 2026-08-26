import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/app/providers";

import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShiftFlow",
  description: "Employee scheduling without spreadsheet chaos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="flex min-h-20 items-center justify-between bg-black p-4 text-white">
            <strong>SHIFTFLOW AUTH</strong>

            <Show when="signed-out">
              <div className="flex gap-4">
                <SignInButton mode="modal">
                  <button className="border border-white px-4 py-2">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button className="border border-white px-4 py-2">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <span>Signed in</span>
                <UserButton />
              </div>
            </Show>
          </header>

          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
