import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase-client";

export interface Part {
    partNumber: string;
    description: string;
    client: string;
    qtyPerBin: string;
    rackType: string;
    repackBinType: string;
}

export function useParts() {
    const [parts, setParts] = useState<Part[]>([]);
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
                setLoading(false);
                return;
            }

            setParts(
                (data ?? []).map((part) => ({
                    partNumber: part.part_number,
                    description: part.part_description,
                    client: part.client,
                    qtyPerBin: part.quantity_per_bin,
                    rackType: part.rack_type,
                    repackBinType: part.repack_bin,
                })),
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown Error");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { parts, loading, error, fetchParts };
}
