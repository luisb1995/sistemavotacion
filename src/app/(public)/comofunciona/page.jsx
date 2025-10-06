import React from 'react'

export default function comofunciona() {
  return (
    <section id="como-funciona" className="w-full py-20 bg-gray-100/50 backdrop-blur-md text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">
        Cómo funciona nuestro sistema
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
        Nuestro sistema utiliza la tecnología blockchain para garantizar elecciones
        seguras, transparentes y confiables. Cada voto se registra de forma
        inmutable y puede ser verificado por todos.
      </p>

      <section className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <section className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">📝 Registro</h3>
          <p className="text-gray-600">Los votantes se autentican de forma segura antes de participar.</p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">✅ Votación</h3>
          <p className="text-gray-600">Cada usuario emite su voto de manera privada y segura.</p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">🔗 Blockchain</h3>
          <p className="text-gray-600">El voto se registra en la blockchain, garantizando su integridad.</p>
        </section>

        <section className="p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">📊 Resultados</h3>
          <p className="text-gray-600">El conteo es transparente y verificable en tiempo real.</p>
        </section>
      </section>
    </section>
  )
}
