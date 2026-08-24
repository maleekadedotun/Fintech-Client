import { useEffect, useState } from "react"

import DashboardLayout from "../../layouts/DashboardLayout";
// import DashboardStats from "../../components/dashboard/DashboardStats";
import DashboardCard from "../../components/cards/DashboardCard";
import { dashboardStats } from "../../features/admin/adminService";

import { FaUsers, FaWallet, FaMoneyBill, FaExchangeAlt } from "react-icons/fa";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalWalletBalance: 0,
        totalRevenue: 0,
        todayTransfers: 0,
    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await dashboardStats();

            setStats(response);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <DashboardLayout>

            <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                <DashboardCard

                    title="Users"

                    value={stats.totalUsers}

                    icon={<FaUsers />}

                    color="bg-blue-600"

                />

                <DashboardCard

                    title="Wallet Balance"

                    value={`₦${stats.totalWalletBalance}`}

                    icon={<FaWallet />}

                    color="bg-green-600"

                />

                <DashboardCard

                    title="Revenue"

                    value={`₦${stats.totalRevenue}`}

                    icon={<FaMoneyBill />}

                    color="bg-purple-600"

                />

                <DashboardCard

                    title="Transfers"

                    value={`₦${stats.todayTransfers}`}

                    icon={<FaExchangeAlt />}

                    color="bg-cyan-600"

                />

            </div>

        </DashboardLayout>

    );

}

export default AdminDashboard;