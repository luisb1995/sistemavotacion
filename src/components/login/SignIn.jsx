"use client";
import { useForm } from "react-hook-form";
import signinSupabase from "@/helpers/signinSupabase";
import { supabase } from "@/lib/supabaseCliente";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    const { success, error } = await signinSupabase(email, password);

    if (!success) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      return;
    }

    Swal.fire({
      title: "¡Buen trabajo!",
      text: "Sesión iniciada con éxito",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    router.push("/dashboard");
  };

  const handleResetPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Restablecer contraseña",
      input: "email",
      inputLabel: "Introduce tu correo electrónico",
      inputPlaceholder: "tuemail@ejemplo.com",
      showCancelButton: true,
      confirmButtonText: "Enviar enlace",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) return "Por favor ingresa un correo válido";
      },
    });

    if (email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-password`,
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Correo enviado",
          text: "Revisa tu bandeja para restablecer tu contraseña.",
        });
      }
    }
  };

  return (
    <section className="flex w-full items-center justify-center min-h-screen  backdrop-blur-md px-4 py-10">
      <div className="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-lg p-6 sm:p-10 rounded-2xl shadow-2xl">
        {/* Título */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              {...register("email", { required: "El correo es obligatorio" })}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "La contraseña es obligatoria" })}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Recuperar contraseña */}
          <p className="text-right">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300"
          >
            Ingresar
          </button>
        </form>

        {/* Enlace registro */}
        <p className="mt-6 text-center text-gray-700 text-sm sm:text-base">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registrarse"
            className="text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
