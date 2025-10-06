"use client"
import React, {useState} from 'react'
import Link from 'next/link'
import { useGetUser } from '@/hooks/useGetUser';
import { supabase } from '@/lib/supabaseCliente';
import { redirect } from 'next/navigation';


export default function layout({ children }) {
    const [openMenu, setOpenMenu] = useState(false);
    const { role, loading, user } = useGetUser();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        redirect('/iniciarsesion');
    };

    return (
         <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block hover:text-gray-300">
            Inicio
          </Link>
          <Link
            href="/dashboard/votaciones"
            className="block hover:text-gray-300"
          >
            Votaciones
          </Link>
          {role === "admin" && (
            <Link
              href="/dashboard/crear-votacion"
              className="block hover:text-gray-300"
            >
              Crear Votación
            </Link>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4 relative">
          <h1 className="text-xl font-semibold text-gray-700">
            Bienvenido {user?.email}
          </h1>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold"
            >
              {user?.email?.charAt(0).toUpperCase()}
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <Link
                  href="/dashboard/perfil"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpenMenu(false)}
                >
                  Perfil
                </Link>
                <Link
                  href="/dashboard/configuracion"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpenMenu(false)}
                >
                  Configuración
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
    )
}
