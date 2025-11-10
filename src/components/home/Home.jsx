"use client"
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <section className="relative flex items-center justify-center w-full min-h-screen bg-cover bg-center text-center p-4">
      <section className="flex flex-col bg-black/60 p-6 sm:p-10 rounded-2xl 
        items-center backdrop-blur-lg max-w-3xl w-full">
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
          Bienvenido al Sistema de Votación
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-100 max-w-2xl">
          Una plataforma segura y transparente basada en tecnología blockchain 
          para garantizar la confianza en cada voto.
        </p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-white text-base sm:text-lg">
          <li>🔒 Seguridad</li>
          <li>🌍 Transparencia</li>
          <li>⚡ Rapidez</li>
        </ul>

        <Link
          href="/comofunciona"
          className="mt-8 px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 
            text-white rounded-xl shadow-lg transition w-full sm:w-auto text-center"
        >
          Cómo funciona
        </Link>
      </section>
    </section>
  )
}
