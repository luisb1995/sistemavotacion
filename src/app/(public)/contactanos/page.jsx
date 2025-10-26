"use client"
import React from 'react'
import emailjs from '@emailjs/browser'
import Swal from 'sweetalert2';
import { useRef, useState } from 'react';

export default function page() {
  const form = useRef();
  const [status, setStatus] = useState(false);

  const sendEmail = (e) => {

    e.preventDefault();
    setStatus(true);

    emailjs
      .sendForm(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, form.current, {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje enviado',
            text: 'Gracias por contactarnos. Te responderemos pronto.',
          });
          form.current.reset();
          setStatus(false);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar el mensaje',
            text: 'Por favor, intenta nuevamente más tarde.',
          });
          setStatus(false);
        },
      );
  };
  return (
    <section id="contacto" className="w-full py-20 bg-gray-100/60 backdrop-blur-sm">
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Contáctanos</h2>
        <p className="text-lg text-gray-900 mb-12">
          Si tienes dudas, sugerencias o deseas más información sobre nuestro sistema de votación,
          no dudes en escribirnos. Estamos aquí para ayudarte.
        </p>

        <form ref={form} onSubmit={sendEmail} className="grid grid-cols-1 gap-6 bg-white p-8 rounded-2xl shadow-lg text-left">
          <section>
            <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              name="user_name"
              placeholder="Tu nombre completo"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section>
            <label className="block text-gray-700 font-semibold mb-2">Correo</label>
            <input
              type="email"
              name="user_email"
              placeholder="tuemail@ejemplo.com"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section>
            <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Escribe tu mensaje..."
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </section>

          <button
            type="submit"
            disabled={status}
            className={`w-full py-3 rounded-lg font-bold transition ${status
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {status ? "Enviando..." : "Enviar mensaje"}
          </button>


        </form>
      </section>
    </section>
  )
}
