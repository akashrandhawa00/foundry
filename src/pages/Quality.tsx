import { useAuth } from "../context/AuthContext";

export const Quality = () => {
    const { session } = useAuth();

    return (
        <div>
            <h1 className="text-white">Quality</h1>
            <h2>se</h2>
        </div>
    );
};
