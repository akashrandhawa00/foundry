import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase-client";

export interface Parts {
    partNumber: string;
    description: string;
}

export function useParts() {
    const [parts, setParts] = useState<Parts[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchParts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from("parts")
                .select("*")
                .order("part_number");

            if (error) {
                setError(error.message);
                return;
            }

            setParts(
                (data ?? []).map((part) => ({
                    partNumber: part.part_number,
                    description: part.part_description,
                })),
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return { parts, loading, error, fetchParts };
}
