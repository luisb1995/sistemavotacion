"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGetUser } from "@/hooks/useGetUser";
import { supabase } from "@/lib/supabaseCliente";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { role, user, loading } = useGetUser();
  const router = useRouter();

  // 🚨 Protección de ruta: si no hay usuario, redirige al login
  useEffect(() => {
    if (!loading && !user) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Debes iniciar sesión para acceder al panel.",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/iniciarsesion");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      timer: 1500,
      showConfirmButton: false,
    });
    router.push("/iniciarsesion");
  };

  // Mientras se verifica la sesión
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-bold text-cyan-700">
        Verificando sesión...
      </div>
    );
  }

  // Si no hay usuario, no renderiza el contenido
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-6 text-lg">
          <Link
            href="/dashboard"
            className="block hover:text-gray-300 border-b-2 border-cyan-700 pb-2"
          >
            Inicio
          </Link>
          <Link
            href="/dashboard/votaciones"
            className="block hover:text-gray-300 border-b-2 border-cyan-700 pb-2"
          >
            Votaciones
          </Link>
          {role === "admin" && (
            <Link
              href="/dashboard/crearvotacion"
              className="block hover:text-gray-300 border-b-2 border-cyan-700 pb-2"
            >
              Crear Votación
            </Link>
          )}
        </nav>
      </aside>

      {/* Sidebar (mobile) */}
      {openMenu && (
        <div className="fixed inset-0 bg-gray-900 text-white p-6 z-50 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <button onClick={() => setOpenMenu(false)} aria-label="Cerrar menú">
              <X size={28} className="text-white hover:text-gray-300 transition" />
            </button>
          </div>
          <nav className="flex flex-col space-y-6 text-lg items-center justify-center flex-grow">
            <Link
              href="/dashboard"
              onClick={() => setOpenMenu(false)}
              className="hover:text-gray-300 border-b-2 border-cyan-700 pb-2"
            >
              Inicio
            </Link>
            <Link
              href="/dashboard/votaciones"
              onClick={() => setOpenMenu(false)}
              className="hover:text-gray-300 border-b-2 border-cyan-700 pb-2"
            >
              Votaciones
            </Link>
            {role === "admin" && (
              <Link
                href="/dashboard/crearvotacion"
                onClick={() => setOpenMenu(false)}
                className="hover:text-gray-300 border-b-2 border-cyan-700 pb-2"
              >
                Crear Votación
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold shadow-md transition"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4 relative">
          {/* Botón menú móvil */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setOpenMenu(true)}
            aria-label="Abrir menú"
          >
            <Menu size={28} />
          </button>

          <h1 className="text-lg sm:text-xl font-semibold text-gray-700 truncate">
            Bienvenido {user?.email}
          </h1>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold"
            >
              {user?.email?.charAt(0).toUpperCase()}
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  🔒 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
