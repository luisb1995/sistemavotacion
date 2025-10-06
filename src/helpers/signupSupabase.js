import React, { useState } from 'react'
import { supabase } from "@/lib/supabaseCliente";


export default async function signupSupabase(name, email, password, role) {

    try {

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
        })

        if (error) {
            return { loading: false, err: error.message, message: "" };
        }

        const { id } = data.user;
        const { error: profileError } = await supabase.from("profiles").insert([{
            id,
            name,
            role,
        },
        ]);

        if (profileError) {
            return { loading: false, err: profileError.message, message: "" };
        } 
        // ✅ Éxito
        return {
            loading: false,
            err: "",
            message: "Usuario creado correctamente, verifica tu correo.",
        };

    } catch (error) {
        return { loading: false, err: error.message, message: "" };
    }

}
