import {
  FaTimes,
  FaTachometerAlt,
  FaWallet,
  FaExchangeAlt,
  FaReceipt,
  FaMoneyCheckAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaUniversity,
  FaShieldAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      name: "Wallet",
      icon: <FaWallet />,
      path: "/wallet",
    },
    {
      name: "Transfer",
      icon: <FaExchangeAlt />,
      path: "/transfer",
    },
    {
      name: "Transactions",
      icon: <FaReceipt />,
      path: "/transactions",
    },
    {
      name: "Bills & Utilities",
      icon: <FaMoneyCheckAlt />,
      path: "/bills",
    },
    {
      name: "Autopay & Schedules",
      icon: <FaCalendarAlt />,
      path: "/schedule",
    },
    {
      name: "Beneficiaries",
      icon: <FaUserFriends />,
      path: "/beneficiaries",
    },
    {
      name: "Statement",
      icon: <FaFileAlt />,
      path: "/statement",
    },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
    },
    {
      name: "Security",
      icon: <FaShieldAlt />,
      path: "/security",
    },
  ];

  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        z-50

        w-72
        h-screen

        bg-slate-950
        text-white

        transition-transform
        duration-300
        ease-in-out

        ${sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
        }

        lg:translate-x-0
        lg:fixed
      `}
    >
      {/* Header */}

      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-cyan-500 flex items-center justify-center text-xl">

            <FaUniversity />

          </div>

          <div>

            <h2 className="font-bold text-xl">
              Fintech
            </h2>

            <p className="text-xs text-slate-400">
              Digital Banking
            </p>

          </div>

        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-xl"
        >
          <FaTimes />
        </button>

      </div>

      {/* Navigation */}

      <nav className="px-4 py-6 space-y-2">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-4

                px-4
                py-3

                rounded-xl

                transition-all
                duration-200

                ${isActive
                ? "bg-cyan-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
              `
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>

          </NavLink>
        ))}

      </nav>

      {/* Bottom Section */}

      <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">

        <button
          className="
            w-full

            flex
            items-center
            gap-4

            px-4
            py-3

            rounded-xl

            text-red-400

            hover:bg-red-500/10
            transition
          "
        >
          <FaSignOutAlt />

          Logout

        </button>

      </div>
    </aside>
  );
}

export default Sidebar;