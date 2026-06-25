import type { User } from "@supabase/supabase-js";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { supabase } from "../lib/supabase-client";

interface AuthContextType {
    user: User | null;
    session: {
        id: string | null;
        email: string | null;
        name: string | null;
        avatar: string | null;
    } | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

interface Profile {
    id: string;
    full_name: string | null;
    username: string;
    avatar_url?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<string>("");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async (userId: string) => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        setProfile(data ?? null);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) await fetchProfile(session?.user.id);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                setUser(session?.user ?? null);
                if (session?.user) await fetchProfile(session?.user.id);
            },
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signInWithEmail = async (email: string, password: string) => {
        const { data, error: signInError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        console.log("data:", data);
        console.log("error:", signInError);

        if (signInError) throw new Error(signInError.message);

        setUser(data.user ?? null);
        console.log("user id: " + data.user.id);
    };

    const signOut = () => {
        supabase.auth.signOut();
    };

    const session = user
        ? {
              id: user?.id,
              email: user?.email,
              name: profile?.full_name,
              avatar: profile?.avatar_url,
          }
        : null;

    const value = { user, session, loading, signInWithEmail, signOut };

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
