import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase-client";
import { Navigate } from "react-router-dom";

interface AuthContextType {
    user: User | null;
    sessionUser: {
        id: string | null;
        email: string | null;
        name: string | null;
        avatar: string | null;
        role: string | null;
    } | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

interface Profile {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url?: string | null;
    role: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);

                if (sessionUser) {
                    const { data } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", sessionUser.id)
                        .single();

                    setProfile(data ?? null);
                } else {
                    setProfile(null);
                }

                setLoading(false);
            },
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) throw new Error(signInError.message);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        <Navigate to="/login" replace />;
    };

    const sessionUser = useMemo(
        () =>
            user
                ? {
                      id: user.id,
                      email: user.email ?? null,
                      name: profile?.full_name ?? null,
                      avatar: profile?.avatar_url ?? null,
                      role: profile?.role ?? null,
                  }
                : null,
        [user, profile],
    );

    const value = { user, sessionUser, loading, signInWithEmail, signOut };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return context;
};
