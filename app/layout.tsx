import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog UI - Clean & Modern",
  description:
    "A minimal and responsive blog UI built with Next.js and Tailwind CSS",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "Blog",
    "Next.js",
    "Tailwind CSS",
    "React",
    "TypeScript",
    "UI",
    "UX",
    "Coding",
    "Development",
    "Programming",
    "Tech",
    "Technology",
    "Web",
    "Design",
    "UI/UX",
    "Frontend",
    "Backend",
    "Fullstack",
    "Mobile",
    "App",
    "Software",
    "Engineering",
    "Tutorials",
    "Guides",
    "Tips",
    "Tricks",
    "Best Practices",
    "Code",
    "Code Snippets",
    "Code Examples",
    "Code Reviews",
    "Code Sharing",
    "Code Collaboration",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
