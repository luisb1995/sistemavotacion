"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseCliente";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function ActualizarPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Restablecer contraseña",
            html: `
        <input id="swal-password" type="password" class="swal2-input" placeholder="Nueva contraseña">
        <input id="swal-password2" type="password" class="swal2-input" placeholder="Repetir contraseña">
      `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            customClass: {
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded",
                cancelButton: "bg-gray-400 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded ml-2",
            },
            preConfirm: () => {
                const pass1 = document.getElementById("swal-password").value;
                const pass2 = document.getElementById("swal-password2").value;

                if (!pass1 || !pass2) {
                    Swal.showValidationMessage("Por favor completa ambos campos");
                    return false;
                }
                if (pass1 !== pass2) {
                    Swal.showValidationMessage("Las contraseñas no coinciden");
                    return false;
                }

                return pass1;
            },
        });

        if (formValues) {
            
            setLoading(true);

            const { error } = await supabase.auth.updateUser({ password: formValues });

            setLoading(false);

            if (error) {
                // 🧩 Aquí manejamos el caso del token expirado o inválido
                if (
                    error.message.includes("Auth session missing") ||
                    error.message.includes("invalid") ||
                    error.message.includes("expired")
                ) {
                    Swal.fire({
                        icon: "warning",
                        title: "Enlace inválido o expirado",
                        text: "Tu enlace de recuperación ha expirado o ya fue usado. Solicita uno nuevo.",
                        confirmButtonText: "Solicitar nuevo enlace",
                    }).then(() => {
                        router.push("/iniciarsesion");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: error.message,
                    });
                }
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Contraseña actualizada",
                    text: "Tu contraseña se cambió correctamente. Inicia sesión nuevamente.",
                    confirmButtonText: "Ir al login",
                }).then(() => {
                    router.push("/iniciarsesion");
                });
            }
        }
    };

    return (
        <section className="flex w-full items-center justify-center  ">
            <div className="flex flex-col bg-slate-200 justify-center align-middle  p-8 min-h-[60%] rounded-2xl shadow-lg w-full max-w-md text-center ">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                    Restablecer contraseña
                </h2>
                <p className="text-gray-600 mb-6">
                    Haz clic en el botón para establecer una nueva contraseña.
                </p>

                <button
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white ${loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        } transition`}
                >
                    {loading ? "Actualizando..." : "Cambiar contraseña"}
                </button>
            </div>
        </section>
    );
}
