import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className="relative flex flex-col min-h-screen" >      
           {children}        
      </body>
    </html>
  );
}
