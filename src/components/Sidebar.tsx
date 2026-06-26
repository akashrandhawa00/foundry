import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./ui/Modal";
import { useState } from "react";

export const Sidebar = () => {
    const { signOut, currentUser } = useAuth();

    const NAV_LINKS = [
        { to: "/", label: "Overview" },
        { to: "/logs", label: "Log" },
        { to: "/quality", label: "Quality" },
        { to: "/parts", label: "Parts" },
        { to: "/users", label: "Users" },
    ];
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <aside className="text-white w-64 min-h-screen  border-r  border-r-white/20 flex flex-col  gap-1, px-4, py-7 bg-neutral-950 pl-3.5">
            <div>
                <div className="font-medium text-xl uppercase font-mono">
                    EcoTrack
                </div>

                <div className="text-neutral-400">Select Finishing</div>
            </div>

            {NAV_LINKS.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                        `w-full text-left px-3.5 py-2 rounded-md text-[13px] transition-colors duration-150 cursor-pointer block
            ${
                isActive
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`
                    }
                >
                    {link.label}
                </NavLink>
            ))}

            <div>
                <button onClick={() => setShowModal((prev) => !prev)}>
                    Open Modal
                </button>
            </div>

            {showModal && (
                <Modal title="test-modal" open={showModal}>
                    "Hi!"
                </Modal>
            )}

            {/* <div> */}
            {/*     <NavLink to="/" className="w-full"> */}
            {/*         Overview */}
            {/*     </NavLink> */}
            {/*     <NavLink to="/logs">Logs</NavLink> */}
            {/*     <NavLink to="/">Quality</NavLink> */}
            {/*     <NavLink to="/">Users</NavLink> */}
            {/* </div> */}

            <div className="flex-1"></div>
            <div> -- {currentUser?.name} -- </div>
            <button
                onClick={() => {
                    signOut();
                }}
            >
                Sign Out
            </button>
        </aside>
    );
};
