import { useAuth } from "../context/AuthContext";

export const Overview = () => {
    const { currentUser } = useAuth();

    return (
        <div>
            <h2 className="text-white">Overview</h2>
            <h3>Hi, {currentUser?.name}</h3>
            <h2></h2>
        </div>
    );
};
