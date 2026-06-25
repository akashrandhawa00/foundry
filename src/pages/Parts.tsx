import { useAuth } from "../context/AuthContext";

export const Parts = () => {
    const { session } = useAuth();

    return (
        <div>
            <h1 className="text-white">Parts</h1>
            <h2>se</h2>
        </div>
    );
};
