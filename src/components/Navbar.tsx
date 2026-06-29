import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./ui/Modal";
import { useState } from "react";
import { ProductionRunForm } from "./forms/ProductionRunForm";
import { Button } from "./Button";
import { PiSignOut } from "react-icons/pi";

import logo from "../assets/foundry-mark-dark.svg";

export const Sidebar = () => {
    const { signOut, sessionUser } = useAuth();

    const NAV_LINKS = [
        { to: "/", label: "Overview" },
        { to: "/logs", label: "Log" },
        { to: "/quality", label: "Quality" },
        { to: "/parts", label: "Parts" },
        { to: "/users", label: "Users" },
    ];
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        // Desktop navbar
        <aside className="w-64 sticky top-0 h-screen border-r  border-r-white/20 flex flex-col gap-1 px-3 py-6 bg-neutral-950">
            <div className="mb-6 pl-3 flex items-center gap-3">
                <div>
                    <img src={logo} className="h-10 w-10" />
                </div>
                <div>
                    <div className="font-medium text-lg uppercase font-mono text-text">
                        Foundry
                    </div>

                    <div className="text-neutral-400">Company Name</div>
                </div>
            </div>
            <div>
                {NAV_LINKS.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/"}
                        className={({ isActive }) =>
                            `w-full text-left px-3.5 py-2 rounded-md text-base transition-colors duration-200 cursor-pointer block
${
    isActive
        ? "bg-neutral-300 dark:bg-surface-active text-neutral-800 dark:text-text"
        : "text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200"
}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <div className="mr-3">
                <Button
                    variant="primary"
                    onClick={() => setShowModal((prev) => !prev)}
                    className="w-full"
                >
                    Add Run +
                </Button>
            </div>

            {showModal && (
                <Modal title="test-modal" onClose={() => setShowModal(false)}>
                    <ProductionRunForm />
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
            <div className="flex flex-col items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary">
                        -- {sessionUser?.name} --
                    </p>{" "}
                    <div className="text-text-label uppercase text-sm">
                        {sessionUser?.role}
                    </div>
                </div>{" "}
                <Button
                    variant="default"
                    onClick={() => {
                        signOut();
                    }}
                    className="border-none text-text-muted hover:text-white hover:bg-danger flex  items-center gap-2"
                >
                    Sign Out
                    <PiSignOut size={20} />
                </Button>
            </div>
        </aside>
    );
};
