import React, { useState } from 'react'
import { supabase } from "@/lib/supabaseCliente";


export default async function signupSupabase(email, password) {

    try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        })

        if (error) {
            return { success: false, error: error.message, user: null };
        }
        const user = data.user;

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError) {
            return { success: false, error: profileError.message };
        }

        return { success: true, error: null, user: data.user , role: profile.role };

    } catch (error) {
        return { success: false, error: err.message, user: null };
    }

}
