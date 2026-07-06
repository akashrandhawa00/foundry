import { supabase } from "../lib/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        rackName: part.rack_name,
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
    const queryClient = useQueryClient();
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["parts"] });
    };
    const query = useQuery({
        queryKey: partsQueryKey(),
        queryFn: () => fetchParts(),
    });

    const addPart = useMutation({
        mutationFn: async (input: Part) => {
            const { error: addPartError } = await supabase
                .from("parts")
                .insert([
                    {
                        part_number: input.partNumber,
                        part_description: input.description,
                        client: input.client,
                        incoming_bin_quantity: input.incomingQtyPerBin,
                        total_parts_per_packaging_bin: input.outgoingQtyPerBin,
                        rack_name: input.rackName,
                        estimated_parts_per_rack: input.partsPerRack,
                        required_rack_per_bin: input.reqRacksPerBin,
                        substrate: input.substrate,
                        repack_bin: input.repackBinType,
                        annual_volume: input.annualVolume,
                        oem: input.oem,
                        oem_part_number: input.oemPartNumber,
                        program_name: input.programName,
                    },
                ]);

            if (addPartError) throw addPartError;
        },

        onSuccess: invalidate,
    });

    const deletePart = useMutation({
        mutationFn: async (partNumber: string) => {
            const { data, error: deletePartError } = await supabase
                .from("parts")
                .delete()
                .eq("part_number", partNumber)
                .select();

            if (deletePartError) throw deletePartError;

            if (!data || data.length === 0) {
                throw new Error(
                    "No matching part was deleted - check permissions or part number.",
                );
            }
        },

        onSuccess: invalidate,
    });

    return {
        parts: query.data ?? [],
        deletePart,
        addPart,
        loading: query.isLoading,
        error: query.error instanceof Error,
    };
}
