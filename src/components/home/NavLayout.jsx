"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function LayoutNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/comofunciona", label: "Como funciona" },
    { href: "/contactanos", label: "Contactanos" },
    { href: "/iniciarsesion", label: "Iniciar Sesion" },
  ]

  return (
    <header className="border-b-2 border-gray-500/40 shadow-md backdrop-blur-sm fixed w-full top-0 z-50">
      <nav className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-black text-center">
          Voting System
        </h1>

        {/* Botón menú móvil (visible hasta 768px) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-black hover:text-blue-400 transition z-50"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X size={30} className='text-white '/> : <Menu size={30} />}
        </button>

        {/* Menú Desktop (visible a partir de 768px) */}
        <ul className="hidden md:flex justify-center space-x-6">
          {links.map(({ href, label }) => (
            <Link
              href={href}
              key={label}
              className={`text-lg transition-all ${
                pathname === href
                  ? "text-blue-700 font-extrabold border-b-2 border-blue-600 pb-1"
                  : "text-gray-800 font-semibold hover:text-blue-700 hover:font-bold"
              }`}
            >
              {label}
            </Link>
          ))}
        </ul>
      </nav>

      {/* Menú móvil tipo overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center 
          space-y-10 text-center z-40 h-screen transition-all duration-300"
        >
          {links.map(({ href, label }) => (
            <Link
              href={href}
              key={label}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl ${
                pathname === href
                  ? "text-blue-400 font-extrabold border-b-2 border-blue-400 pb-1"
                  : "text-gray-200 font-semibold hover:text-blue-400 hover:font-bold"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
