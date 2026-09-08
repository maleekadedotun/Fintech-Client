import { useState, useRef, useEffect } from "react";
import {
    FaBars,
    FaBell,
    FaChevronDown,
    FaSearch,
    FaShieldAlt,
    FaSignOutAlt,
    FaUserShield,
} from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Navbar({
    sidebarOpen,
    setSidebarOpen
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const user = useSelector(
        state => state.auth.user
    );

    const initials = user?.name?.split(" ").map(word => word[0]).join("").toUpperCase() || "U";

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        dispatch(logout());
        navigate("/");
    };

    return (
        <header
            className="
                h-20
                bg-white
                border-b
                border-slate-200
                px-6
                flex
                justify-between
                items-center
                sticky
                top-0
                z-30
            "
        >
            {/* Left */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() =>
                        setSidebarOpen(!sidebarOpen)
                    }
                    className="
                        lg:hidden
                        text-2xl
                        hover:text-cyan-600
                    "
                >
                    <FaBars />
                </button>

                <div>
                    <h2 className="text-2xl font-bold">
                        Dashboard
                    </h2>
                    <p className="text-sm text-slate-500">
                        Welcome back 👋
                    </p>
                </div>
            </div>

            {/* Search */}
            <div
                className="
                    hidden
                    lg:flex
                    items-center
                    bg-slate-100
                    rounded-xl
                    px-4
                    py-2
                    w-96
                "
            >
                <FaSearch className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="
                        bg-transparent
                        outline-none
                        w-full
                        ml-3
                    "
                />
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                {/* Notification */}
                <button
                    onClick={() => navigate("/notifications")}
                    className="
                        relative
                        text-xl
                        hover:text-cyan-600
                    "
                >
                    <FaBell />
                    <span
                        className="
                            absolute
                            -top-2
                            -right-2
                            w-5
                            h-5
                            rounded-full
                            bg-red-500
                            text-white
                            text-[10px]
                            flex
                            items-center
                            justify-center
                        "
                    >
                        1
                    </span>
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="
                            flex
                            items-center
                            gap-3
                            cursor-pointer
                            p-1.5
                            rounded-2xl
                            hover:bg-slate-100/80
                            transition
                            duration-150
                            focus:outline-none
                        "
                    >
                        <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-gradient-to-tr
                                from-cyan-600
                                to-blue-600
                                text-white
                                font-bold
                                text-sm
                                flex
                                items-center
                                justify-center
                                uppercase
                                shadow-sm
                            "
                        >
                            {initials}
                        </div>

                        <div className="hidden md:block text-left">
                            <h4 className="font-semibold text-sm text-slate-800 leading-tight">
                                {user?.name || "Customer"}
                            </h4>
                            <p className="text-xs text-slate-500 capitalize">
                                {user?.role || "user"}
                            </p>
                        </div>

                        <FaChevronDown
                            className={`text-slate-400 text-xs transition-transform duration-200 ${
                                dropdownOpen ? "rotate-180 text-cyan-600" : ""
                            }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2.5 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-fadeIn">
                            {/* Profile Header */}
                            <div className="px-3.5 py-3 border-b border-slate-100 mb-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Signed in as
                                </p>
                                <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
                                    {user?.name || "Customer"}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {user?.email}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
                                        {user?.role || "User"}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        Tier {user?.tier || 1}
                                    </span>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        navigate("/security");
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition duration-150"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm">
                                        <FaShieldAlt />
                                    </div>
                                    <div className="text-left">
                                        <p className="leading-tight">Security & PIN</p>
                                        <span className="text-[10px] text-slate-400 font-normal">Change password & PIN</span>
                                    </div>
                                </button>

                                {(user?.role === "admin" || user?.isAdmin) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            navigate("/admin/dashboard");
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition duration-150"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                                            <FaUserShield />
                                        </div>
                                        <div className="text-left">
                                            <p className="leading-tight">Admin Portal</p>
                                            <span className="text-[10px] text-slate-400 font-normal">Platform management</span>
                                        </div>
                                    </button>
                                )}

                                <div className="pt-1 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition duration-150"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-sm">
                                            <FaSignOutAlt />
                                        </div>
                                        <div className="text-left">
                                            <p className="leading-tight">Logout</p>
                                            <span className="text-[10px] text-red-400 font-normal">End your session</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;