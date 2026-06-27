import type { User } from "@supabase/supabase-js";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { supabase } from "../lib/supabase-client";

interface AuthContextType {
    user: User | null;
    sessionUser: {
        id: string | null;
        email: string | null;
        name: string | null;
        avatar: string | null;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error: fetchError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();
            setProfile(data ?? null);

            if (fetchError) {
                console.error("Profile fetch error: ", fetchError.message);
                setProfile(null);
            } else {
                setProfile(data ?? null);
            }
        } catch (error) {
            console.error("Unexpected profile error: ", error);
            setProfile(null);
        }
    }, []);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                const sessionUser = session?.user ?? null;
                setUser(sessionUser);

                if (sessionUser) {
                    await fetchProfile(sessionUser.id);
                } else {
                    setProfile(null);
                }

                setLoading(false);
            },
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signInWithEmail = async (email: string, password: string) => {
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) throw new Error(signInError.message);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const sessionUser = useMemo(
        () =>
            user
                ? {
                      id: user.id,
                      email: user.email ?? null,
                      name: profile?.full_name ?? null,
                      avatar: profile?.avatar_url ?? null,
                  }
                : null,
        [user, profile],
    );

    const value = useMemo(
        () => ({ user, sessionUser, loading, signInWithEmail, signOut }),
        [user, sessionUser, loading],
    );

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
