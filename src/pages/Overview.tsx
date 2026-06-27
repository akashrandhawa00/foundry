import UnderConstructionGIF from "../components/ui/UnderConstrucion";
import { useAuth } from "../context/AuthContext";

export const Overview = () => {
    const { sessionUser } = useAuth();

    return (
        <div>
            <h1 className="text-white font-bold text-lg">Overview</h1>
            <h3>Hi, {sessionUser?.name}</h3>

            <UnderConstructionGIF />
        </div>
    );
};
