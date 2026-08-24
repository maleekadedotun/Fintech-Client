import DashboardLayout from "../../layouts/DashboardLayout";

// import WalletCard from "../../components/dashboard/WalletCard";
// import QuickActions from "../../components/dashboard/QuickActions";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
// import QuickActions from "../../components/dashboard/QuickActions";
import { WalletCard } from "../../components/dashboard/WalletCard";
import { QuickActions } from "../../components/dashboard/QuickActions";
import SpendingChart from "../../components/dashboard/SpendingChart";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { getWalletBalance } from "../../features/transactions/transactionService";
import { WalletInformation } from "../../components/dashboard/WalletInformation";


function UserDashboard() {

    const [wallet, setWallet] = useState(null);
    const [walletLoading, setWalletLoading] = useState(true);

    // UseEffect
    useEffect(() => {

        const fetchWallet = async () => {

            try {

                setWalletLoading(true);

                const response =
                    await getWalletBalance();

                console.log(
                    "Dashboard wallet:",
                    response
                );

                setWallet(response);

            } catch (error) {

                console.error(
                    "Wallet error:",
                    error.response?.data ||
                    error.message
                );

            } finally {

                setWalletLoading(false);

            }

        };

        fetchWallet();

    }, []);

    // get selector
    const user = useSelector(
        state => state.auth.user
    );

    const { transactions, loading } = useSelector(
        state => state.transactions
    );

    const credit = transactions
        .filter(t => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);

    const debit = transactions
        .filter(t => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);

    return (

        <DashboardLayout>

            <div className="space-y-8">

                {/* Wallet Balance */}

                <WalletCard
                    wallet={wallet}
                    loading={walletLoading}
                />


                {/* Quick Actions */}

                <QuickActions />

                {/* Wallet Information */}
                <WalletInformation
                    wallet={wallet}
                    user={user}
                />

                {/* Recent Transactions */}


                <div className="grid lg:grid-cols-2 gap-6">

                    <SpendingChart
                        credit={credit}

                        debit={debit}
                    />

                    <RecentTransactions />

                </div>
                {/* <RecentTransactions /> */}

            </div>

        </DashboardLayout>

    );

}

export default UserDashboard;