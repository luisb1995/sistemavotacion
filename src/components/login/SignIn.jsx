"use client";
import { useForm } from "react-hook-form";
import signinSupabase from "@/helpers/signinSupabase";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, } = useForm()

  const onSubmit = async (data) => {
    console.log(data);

    const { email, password } = data;
    const { success, error, user, role } = await signinSupabase(email, password);
    if (!success) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      return;
    }

    Swal.fire({
      title: "Buen trabajo!",
      text: "Sesión iniciada con éxito",
      icon: "success"
    });

    redirect('/dashboard');

  };

  return (
    <section className="flex w-full items-center justify-center min-h-screen">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>
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
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
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
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>

        {/* Enlaces extras */}
        <p className="mt-6 text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/registrarse" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
