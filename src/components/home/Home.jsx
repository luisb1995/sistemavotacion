"use client"
import Link  from 'next/link'
import Image from 'next/image'
export default function Home() {

    return (
        <section className='relative flex items-center  justify-center w-full min-h-full- text-center'>

            <section className="flex flex-col bg-black/50 p-6 rounded-2xl  
              items-center backdrop-blur-lg max-w-3xl">
                <h1 className="text-6xl font-bold text-white">
                    Bienvenido al Sistema de Votación
                </h1>
                <p className="flex mt-4 text-lg  text-gray-100 max-w-2xl">
                    Una plataforma segura y transparente basada en tecnología blockchain 
                    para garantizar la confianza en cada voto.
                </p>
                <ul className="mt-6 grid grid-cols-3 gap-4 text-white">
                    <li>🔒 Seguridad</li>
                    <li>🌍 Transparencia</li>
                    <li>⚡ Rapidez</li>
                </ul>
                <Link href="/comofunciona" className="mt-8 px-8 py-3 bg-blue-600
                 hover:bg-blue-700 text-white rounded-xl shadow-lg transition">
                    Como funciona
                </Link>
            </section>


        </section>
    )
}
