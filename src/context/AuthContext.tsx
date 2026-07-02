import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase-client";

interface Profile {
    id: string;
    full_name: string | null;
    avatar_url?: string | null;
    role: string | null;
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    signInWithEmail: (
        email: string,
        password: string,
    ) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    const [sessionLoading, setSessionLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);

    const isLoading = sessionLoading && profileLoading;

    const user = session?.user ?? null;
    const currentUserId = useRef<string | null>(null);

    async function fetchProfile(userId: string) {
        setProfileLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Failed to fetch profile:", error.message);
            setProfile(null);
        } else {
            setProfile({
                id: data.id,
                full_name: data.full_name,
                avatar_url: data.avatar_url,
                role: data.role,
            });
        }

        setProfileLoading(false);
    }

    useEffect(() => {
        //fetch existing session if it existing
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('tried to fetch existing session')
            setSession(session);
            setSessionLoading(false);

            const userId = session?.user.id ?? null;
            currentUserId.current = userId;

            if (userId) fetchProfile(userId);
        });

        //listen to auth changes
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            console.log('fired up onauthstatechange')

            const newUserId = session?.user.id ?? null;

            if (newUserId != currentUserId.current) {
                currentUserId.current = newUserId;
                if (newUserId) {
                    fetchProfile(newUserId);
                } else {
                    setProfile(null);
                }
            }
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error: signInError?.message ?? null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value: AuthContextType = {
        user,
        session,
        profile,
        isLoading,
        signInWithEmail,
        signOut,
    };
    console.log("Profiel", profile);
    console.log("User", user);
    console.log("Session", session);

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
