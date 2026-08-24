import {
    FaExchangeAlt,
    FaMobileAlt,
    FaWifi,
    FaBolt,
    FaTv,
    FaUniversity,
    FaCreditCard,
    FaShieldAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export function QuickActions() {

    const navigate = useNavigate();

    const actions = [

        {
            title: "Transfer",
            icon: <FaExchangeAlt />,
            color: "bg-blue-600",
            path: "/transfer",
        },

        {
            title: "Airtime",
            icon: <FaMobileAlt />,
            color: "bg-green-600",
            path: "/airtime",
        },

        {
            title: "Data",
            icon: <FaWifi />,
            color: "bg-cyan-600",
            path: "/data",
        },

        {
            title: "Electricity",
            icon: <FaBolt />,
            color: "bg-yellow-500",
            path: "/electricity",
        },

        {
            title: "Cable TV",
            icon: <FaTv />,
            color: "bg-purple-600",
            path: "/cable",
        },

        {
            title: "Bank",
            icon: <FaUniversity />,
            color: "bg-indigo-600",
            path: "/banks",
        },

        {
            title: "Cards",
            icon: <FaCreditCard />,
            color: "bg-pink-600",
            path: "/cards",
        },

        {
            title: "Security",
            icon: <FaShieldAlt />,
            color: "bg-slate-700",
            path: "/security",
        },

    ];

    return (

        <div className="bg-white rounded-3xl shadow-sm p-6">

            <div className="mb-6">

                <h2 className="text-2xl font-bold">

                    Quick Actions

                </h2>

                <p className="text-slate-500">

                    Frequently used services

                </p>

            </div>

            <div
                className="
                    grid
                    grid-cols-2
                    sm:grid-cols-4
                    lg:grid-cols-4
                    xl:grid-cols-8

                    gap-5
                "
            >

                {actions.map((action) => (

                    <button

                        key={action.title}

                        onClick={() =>
                            navigate(action.path)
                        }

                        className="
                            group

                            rounded-2xl

                            border

                            border-slate-200

                            p-5

                            hover:shadow-lg

                            hover:-translate-y-1

                            transition-all
                        "
                    >

                        <div
                            className={`
                                w-14
                                h-14

                                mx-auto

                                rounded-2xl

                                flex
                                items-center
                                justify-center

                                text-white
                                text-2xl

                                ${action.color}
                            `}
                        >

                            {action.icon}

                        </div>

                        <h4
                            className="
                                mt-4

                                font-semibold

                                text-slate-700

                                group-hover:text-cyan-600
                            "
                        >

                            {action.title}

                        </h4>

                    </button>

                ))}

            </div>

        </div>

    );

}

// export default QuickActions;