import React from 'react'

export default function page() {
  return (
    <section id="contacto" className="w-full py-20 bg-gray-100/60 backdrop-blur-sm ">
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Contáctanos</h2>
        <p className="text-lg text-gray-900 mb-12">
          Si tienes dudas, sugerencias o deseas más información sobre nuestro sistema de votación,
          no dudes en escribirnos. Estamos aquí para ayudarte.
        </p>

        <form className="grid grid-cols-1 gap-6 bg-white p-8 
                         rounded-2xl shadow-lg text-left">
          <section>
            <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section>
            <label className="block text-gray-700 font-semibold mb-2">Correo</label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              className="w-full border border-gray-300 p-3 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section>
            <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
            <textarea
              rows="5"
              placeholder="Escribe tu mensaje..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </section>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Enviar mensaje
          </button>
        </form>
      </section>
    </section>
  )
}
