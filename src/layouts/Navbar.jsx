import {
    FaBars,
    FaBell,
    FaChevronDown,
    FaSearch
} from "react-icons/fa";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Navbar({
    sidebarOpen,
    setSidebarOpen
}) {
    const navigate = useNavigate();

    const user = useSelector(
        state => state.auth.user
    );

    const initials = user?.name?.split(" ").map(word => word[0]).join("").toUpperCase() || "U";

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

                {/* User */}

                <div
                    className="
                        flex
                        items-center

                        gap-3

                        cursor-pointer
                    "
                >

                    {/* <img
                        src="https://i.pravatar.cc/150"
                        alt="Profile"
                        className="
                            w-11
                            h-11

                            rounded-full
                            object-cover
                        "
                    /> */}

                    <div
                        className="
                        w-11
                        h-11

                        rounded-full

                        bg-cyan-600

                        text-white

                        font-bold

                        flex
                        items-center
                        justify-center

                        uppercase
                    "
                    >

                        {initials}

                    </div>

                    <div className="hidden md:block">

                        <h4 className="font-semibold">

                            {user?.name}

                        </h4>

                        <p className="text-xs text-slate-500">

                            {user?.role}

                        </p>

                    </div>

                    <FaChevronDown className="text-slate-500" />

                </div>

            </div>

        </header>

    );

}

export default Navbar