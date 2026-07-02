import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase-client";

export interface Part {
    partNumber: string;
    description: string;
    client: string;
    incomingQtyPerBin: number;
    outgoingQtyPerBin: number;
    rackName: string;
    partsPerRack: number;
    reqRacksPerBin: number;
    substrate: string;
    repackBinType: number;
    annualVolume: number;
    oem: string;
    oemPartNumber: string;
    programName: string;
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
                .order("created_at", { ascending: false });

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
                    incomingQtyPerBin: part.incoming_bin_quantity,
                    outgoingQtyPerBin: part.total_parts_per_packaging_bin,
                    rackName: part.rack_type,
                    partsPerRack: part.estimated_parts_per_rack,
                    reqRacksPerBin: part.required_rack_per_bin,
                    substrate: part.substrate,
                    repackBinType: part.repack_bin,
                    annualVolume: part.annual_volume,
                    oem: part.oem,
                    oemPartNumber: part.oem_part_number,
                    programName: part.program_name,
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
