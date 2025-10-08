"use client";

import Link from "next/link";
import { useState } from "react";
import signupSupabase from "@/helpers/signupSupabase";
import Swal from "sweetalert2";

export default function SignupPage() {

  const [data, setData] = useState({name: "", email: "", password: "", confirmPassword: "", role: "user"}); 
  const {name, email, password, confirmPassword, role} = data; 
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
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

    const {loading , message , err } = await signupSupabase(name, email, password, role);
    setIsLoading(loading);    
    
  }

  return (
    <section className="flex w-full items-center justify-center min-h-screen">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Crear cuenta
        </h2>
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
              onChange={(e) => setData({...data, name: e.target.value})}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setData({...data, email: e.target.value})}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setData({...data, password: e.target.value})}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirmar Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setData({...data, confirmPassword: e.target.value})}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Selector de rol */}

          <p className="text-gray-700 font-semibold">Seleccione el rol que desea: </p>
          <select
          value={role}
          onChange={(e) => setData({...data, role: e.target.value})}
          className=" border border-gray-300 p-3 rounded-md w-full mb-4"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

          {/* Botón */}
          <button
            type="submit"
            className={`w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition
               ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Registrando..." : "Registrarse "}
          </button>
        </form>

        {/* Enlaces extras */}
        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/iniciarsesion" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
} 
