import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import NavLayout from "@/components/home/NavLayout";
import FooterLayout from "@/components/home/FooterLayout";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistema de Votación",
  description: "Sistema de votacion basado en blockchain",
};

export default function RootLayout({ children }) {

  return (
    <>
      <Image
        src="/fondo2.png"
        fill
        alt="Background Image"
        className="object-cover -z-10 fixed"
      />
      <NavLayout />
      <main className="flex flex-grow">
        {children}
      </main>
      <FooterLayout />
    </>

  );
}
