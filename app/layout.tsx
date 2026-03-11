import type { Metadata } from "next";
import "./globals.css";
import { getCourseData } from "@/lib/course";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MP26 · Molecular Phylogenetics",
  description:
    "Teaching material for the Molecular Phylogenetics MSc course at the University of Bologna, 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = getCourseData();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar github={data.course.github} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
