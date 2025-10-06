"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LayoutNav() {
    
        const pathname = usePathname()
    
        const links = [
            { href: "/", label: "Inicio" },
            { href: "/comofunciona", label: "Como funciona" },
            { href: "/contactanos", label: "Contactanos" },
            { href: "/iniciarsesion", label: "Iniciar Sesion" }
        ];
  return (
    <header className='border-b-2 border-gray-500/40 shadow-md backdrop-blur-sm '>
         <nav className='flex items-center justify-between mx-5'>
                <h1 className='text-2xl font-bold text-center py-4'>Voting System</h1>
                <ul className='flex justify-center space-x-4'>
                    {links.map(({href,label}) => (
                            
                        <Link href={href} key={label} className={`text-lg ${pathname === href 
                             ? "text-blue-900 font-extrabold border-b-2 border-blue-500" 
                             : "text-gray-700 font-bold hover:text-blue-900 hover:font-extrabold"}`}>
                           
                           {label}        
                        </Link>
                    ))}
                </ul>
        </nav>
     </header>
  )
}
