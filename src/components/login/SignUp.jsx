"use client";

import Link from "next/link";
import { useState } from "react";
import signupSupabase from "@/helpers/signupSupabase";
import Swal from "sweetalert2";

export default function SignupPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const { name, email, password, confirmPassword, role } = data;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    setIsLoading(true);
    const { loading, message, err } = await signupSupabase(
      name,
      email,
      password,
      role
    );

    if (err) {
      Swal.fire({
        icon: "error",
        title: "Error al registrarse",
        text: err,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Cuenta creada con éxito",
        text: "Por favor, revisa tu correo para verificar tu cuenta.",
      });
    }

    setIsLoading(false);
  };

  return (
    <section className="flex w-full items-center justify-center min-h-screen  backdrop-blur-md px-4 py-20">
      <div className="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-lg p-6 sm:p-10 rounded-2xl shadow-2xl">
        {/* Título */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Crear cuenta
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Selector de rol */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Selecciona tu rol
            </label>
            <select
              value={role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold rounded-lg transition duration-300 ${
              isLoading
                ? "bg-green-400 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-700 text-white shadow-md"
            }`}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {/* Enlace de inicio de sesión */}
        <p className="mt-6 text-center text-gray-700 text-sm sm:text-base">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/iniciarsesion"
            className="text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
