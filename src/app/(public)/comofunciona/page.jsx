"use client"
import React from 'react'

export default function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="w-full py-24 sm:py-20 px-4  backdrop-blur-md text-center"
    >
      {/* Título */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 pt-8 leading-tight">
        Cómo funciona nuestro sistema
      </h2>

      {/* Descripción */}
      <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-12">
        Nuestro sistema utiliza la tecnología blockchain para garantizar elecciones
        seguras, transparentes y confiables. Cada voto se registra de forma
        inmutable y puede ser verificado por todos.
      </p>

      {/* Grid de pasos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
        <section className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold mb-2">📝 Registro</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Los votantes se autentican de forma segura antes de participar.
          </p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold mb-2">✅ Votación</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Cada usuario emite su voto de manera privada y segura.
          </p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold mb-2">🔗 Blockchain</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            El voto se registra en la blockchain, garantizando su integridad.
          </p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold mb-2">📊 Resultados</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            El conteo es transparente y verificable en tiempo real.
          </p>
        </section>
      </section>
    </section>
  )
}
