import { useAuth } from "../context/AuthContext";

export const Logs = () => {
    const { session } = useAuth();

    return (
        <div>
            <h1 className="text-white">Logs</h1>
            <h3>Hi, {session?.id}</h3>
            <h2></h2>
        </div>
    );
};
