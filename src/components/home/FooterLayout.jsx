"use client"
import React from 'react'

export default function FooterLayout() {
  return (
    <footer
      className="flex flex-col sm:flex-row flex-wrap items-center justify-center 
      gap-2 sm:gap-4 text-center min-h-14 w-full py-4 px-4
      backdrop-blur-sm border-t-2 border-gray-500/40 shadow-inner 
      text-gray-800 text-sm sm:text-base font-semibold"
    >
      <p className="whitespace-normal">
        &copy; 2025 <span className="font-extrabold text-blue-800">Voting System</span>. Todos los derechos reservados.
      </p>

      <p className="text-gray-800 text-xs sm:text-sm">
        Desarrollado con ❤️ y tecnología segura.
      </p>
    </footer>
  )
}
