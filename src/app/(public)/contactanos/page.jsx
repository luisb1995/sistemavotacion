"use client"
import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import Swal from 'sweetalert2'

export default function ContactoPage() {
  const form = useRef()
  const [status, setStatus] = useState(false)

  const sendEmail = () => {
    e.preventDefault()
    setStatus(true)

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        form.current,
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
      )
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje enviado',
            text: 'Gracias por contactarnos. Te responderemos pronto.',
          })
          form.current.reset()
          setStatus(false)
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar el mensaje',
            text: 'Por favor, intenta nuevamente más tarde.',
          })
          setStatus(false)
        }
      )
  }

  return (
    <section
      id="contacto"
      className="w-full md:py-24  py-24 px-4  backdrop-blur-md flex justify-center items-center "
    >
      <section className="w-full max-w-3xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-10 ">
        {/* Título */}
        <h2 className="text-3xl sm:text-4xl  font-bold text-gray-800 text-center mb-4">
          Contáctanos
        </h2>
        <p className="text-gray-700 text-base sm:text-lg text-center mb-10">
          Si tienes dudas, sugerencias o deseas más información sobre nuestro sistema de votación,
          no dudes en escribirnos. Estamos aquí para ayudarte.
        </p>

        {/* Formulario */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col gap-6 text-left"
        >
          <section>
            <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              name="user_name"
              placeholder="Tu nombre completo"
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section>
            <label className="block text-gray-700 font-semibold mb-2">Correo</label>
            <input
              type="email"
              name="user_email"
              placeholder="tuemail@ejemplo.com"
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section>
            <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
            <textarea
              name="message"
              rows={5}
              placeholder="Escribe tu mensaje..."
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </section>

          <button
            type="submit"
            disabled={status}
            className={`w-full py-3 rounded-lg font-bold transition-colors duration-300 ${
              status
                ? "bg-blue-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            }`}
          >
            {status ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </section>
    </section>
  )
}
