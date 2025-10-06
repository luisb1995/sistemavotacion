"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseCliente";
import { useRouter } from "next/navigation";

export function useGetUser() {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
     const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/iniciarsesion");
                return;
            }
            setUser(user);


            const { data: profile, error } = await supabase
                .from("profiles")
                .select("role, name")
                .eq("id", user.id)
                .single();

            if (!error) {
                setRole(profile.role);
            }
            setLoading(false);
        };

        getProfile();
    }, []);

    return { role, loading , user};
}
