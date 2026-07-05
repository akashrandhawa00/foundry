import { supabase } from "../lib/supabase-client";
import { useQuery } from "@tanstack/react-query";

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
    repackBinType: string;
    annualVolume: number;
    oem: string;
    oemPartNumber: string;
    programName: string;
}

function partsQueryKey() {
    return ["parts"] as const;
}

async function fetchParts() {
    let query = supabase
        .from("parts")
        .select("*")
        .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return (data ?? []).map((part) => ({
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
    }));
}

export function useParts() {
    const query = useQuery({
        queryKey: partsQueryKey(),
        queryFn: () => fetchParts(),
    });

    return {
        parts: query.data ?? [],
        loading: query.isLoading,
        error: query.error instanceof Error,
    };
}
