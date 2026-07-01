import { NavLink } from "react-router-dom";
import logo from "../assets/Foundry_light.svg";
import { useAuth } from "../context/AuthContext";
import { Modal } from "./ui/Modal";
import { useState } from "react";
import { ProductionRunForm } from "./forms/ProductionRunForm";
import { Button } from "./Button";
import { PiSignOut } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { LuLogs } from "react-icons/lu";
import { FaSprayCan, FaUser } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import { HiOutlineMenu } from "react-icons/hi";

export const Sidebar = () => {
    const { signOut, sessionUser } = useAuth();

    const NAV_LINKS = [
        { to: "/", label: "Overview", logo: RxDashboard },
        { to: "/production-runs", label: "Production Runs", logo: LuLogs },
        { to: "/quality", label: "Quality", logo: FaSprayCan },
        { to: "/parts", label: "Parts", logo: BiSolidComponent },
        { to: "/users", label: "Users", logo: FaUser },
    ];
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMobileSideBar, setShowMobileSideBar] = useState(false);

    const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => {
        return (
            <div>
                {NAV_LINKS.map((link) => {
                    const Icon = link.logo;

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            onClick={onLinkClick}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-2 text-left px-3.5 py-2 font-medium rounded text-sm transition-colors duration-200 cursor-pointer my-1 
${
    isActive
        ? "bg-neutral-300 dark:bg-surface-active text-neutral-800 dark:text-primary"
        : "text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200"
}`
                            }
                        >
                            <Icon size={18} />
                            <span>{link.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        );
    };

    const SideBarFooter = () => {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="text-center pb-2">
                    <p className="text-text-secondary">{sessionUser?.name}</p>{" "}
                    <div className="text-text-label uppercase text-xs">
                        {sessionUser?.role}
                    </div>
                </div>{" "}
                <Button
                    variant="default"
                    onClick={() => {
                        signOut();
                    }}
                    className="border-none text-text-muted hover:text-white hover:bg-red-500 flex items-center gap-2"
                >
                    Sign Out
                    <PiSignOut size={18} />
                </Button>
            </div>
        );
    };

    return (
        <>
            {/* mobile topbar */}
            <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 text-primary">
                <button
                    className="p-1"
                    onClick={() => setShowMobileSideBar((prev) => !prev)}
                >
                    <HiOutlineMenu size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className=" w-full max-w-sm mx-auto my-auto min-w-min text-primary">
                        {/* <div className="pt-2 text-primary font-mono tracking-wider text-2xl"> */}
                        {/*     FOUNDRY */}
                        {/* </div> */}
                        {/* <div className="text-xs tracking-wider text-text-secondary/90"> */}
                        {/*     Production Tracker */}
                        {/* </div> */}
                        <div className="pt-2 ">
                            <img src={logo} className="w-28 text-red-300" />
                        </div>
                        {/* <div className="text-xs flex justify-between w-28 pb-4 text-text-secondary/90"> */}
                        {/*     <span>P</span> */}
                        {/*     <span>r</span> */}
                        {/*     <span>o</span> */}
                        {/*     <span>d</span> */}
                        {/*     <span>u</span> */}
                        {/*     <span>c</span> */}
                        {/*     <span>t</span> */}
                        {/*     <span>i</span> */}
                        {/*     <span>o</span> */}
                        {/*     <span>n</span> */}
                        {/*     <span> </span> */}
                        {/*     <span> </span> */}
                        {/*     <span> </span> */}
                        {/*     <span>T</span> */}
                        {/*     <span>r</span> */}
                        {/*     <span>a</span> */}
                        {/*     <span>c</span> */}
                        {/*     <span>k</span> */}
                        {/*     <span>e</span> */}
                        {/*     <span>r</span> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>

            {/* Desktop navbar */}
            <aside className="w-64 min-w-64 sticky top-0 h-dvh hidden md:flex border-r  border-r-white/20 flex-col gap-1 px-3 py-6 bg-gray-900">
                <div className="mb-6 pl-3 flex items-center gap-3">
                    <div className=" w-full max-w-sm mx-auto my-auto min-w-min text-primary">
                        {/* <div className="pt-2 text-primary font-mono tracking-wider text-2xl"> */}
                        {/*     FOUNDRY */}
                        {/* </div> */}
                        {/* <div className="text-xs tracking-wider pb-4 text-text-secondary/90"> */}
                        {/*     Production Tracker */}
                        {/* </div> */}
                        <div className="pt-2 ">
                            <img src={logo} className="w-28 text-red-300" />
                        </div>
                        <div className="text-xs flex justify-between w-28 pb-4 text-text-secondary/90">
                            <span>P</span>
                            <span>r</span>
                            <span>o</span>
                            <span>d</span>
                            <span>u</span>
                            <span>c</span>
                            <span>t</span>
                            <span>i</span>
                            <span>o</span>
                            <span>n</span>
                            <span> </span>
                            <span> </span>
                            <span> </span>
                            <span>T</span>
                            <span>r</span>
                            <span>a</span>
                            <span>c</span>
                            <span>k</span>
                            <span>e</span>
                            <span>r</span>
                        </div>
                    </div>
                </div>

                <NavLinks />

                <div className="mr-3">
                    <Button
                        variant="primary"
                        onClick={() => setShowModal((prev) => !prev)}
                        className="w-full"
                    >
                        Add Run +
                    </Button>
                </div>

                <div className="flex-1"></div>
                <SideBarFooter />
            </aside>

            {/* mobile overlay */}
            <div
                onClick={() => setShowMobileSideBar(false)}
                className={`md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-md ${showMobileSideBar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />
            <aside
                className={`w-64 min-w-64 fixed top-0 left-0 z-50 h-dvh md:hidden border-r flex border-r-white/20 transition-transform duration-300 flex-col gap-1 px-3 py-6 bg-gray-900 ${showMobileSideBar ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="mb-6 pl-3 flex items-center gap-3">
                    <div className=" w-full max-w-sm mx-auto my-auto min-w-min text-primary">
                        {/* <div className="pt-2 text-primary font-mono tracking-wider text-2xl"> */}
                        {/*     FOUNDRY */}
                        {/* </div> */}
                        {/* <div className="text-xs tracking-wider pb-4 text-text-secondary/90"> */}
                        {/*     Production Tracke */}
                        {/* </div> */}
                        <div className="pt-2 ">
                            <img src={logo} className="w-28 text-red-300" />
                        </div>
                        <div className="text-xs flex justify-between w-28 pb-4 text-text-secondary/90">
                            <span>P</span>
                            <span>r</span>
                            <span>o</span>
                            <span>d</span>
                            <span>u</span>
                            <span>c</span>
                            <span>t</span>
                            <span>i</span>
                            <span>o</span>
                            <span>n</span>
                            <span> </span>
                            <span> </span>
                            <span> </span>
                            <span>T</span>
                            <span>r</span>
                            <span>a</span>
                            <span>c</span>
                            <span>k</span>
                            <span>e</span>
                            <span>r</span>
                        </div>
                    </div>
                </div>

                <NavLinks
                    onLinkClick={() => setShowMobileSideBar((prev) => !prev)}
                />

                <div className="mr-3">
                    <Button
                        variant="primary"
                        onClick={() => setShowModal((prev) => !prev)}
                        className="w-full"
                    >
                        Add Run +
                    </Button>
                </div>

                <div className="flex-1"></div>
                <SideBarFooter />
            </aside>

            {showModal && (
                <Modal title="test-modal" onClose={() => setShowModal(false)}>
                    <ProductionRunForm />
                </Modal>
            )}
        </>
    );
};
