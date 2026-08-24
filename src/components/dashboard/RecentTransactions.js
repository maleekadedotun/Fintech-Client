import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { getTransactions } from "../../features/transaction/transactionService";
import { getTransactions } from "../../features/transactions/transactionService";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/transactions/transactionSlice";
import TransactionDetailsModal from "../modals/TransactionDetailsModal";


function RecentTransactions() {

    // const [transactions, setTransactions] = useState([]);

    // useEffect(() => {
    //     loadTransactions();
    // }, []);

    // const loadTransactions = async () => {
    //     try {
    //         const response = await getTransactions();
    //         console.log("Transactions API Response:", response);
    //         // Adjust based on your API response shape
    //         setTransactions(response.transactions || response.data || []);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { transactions, loading } = useSelector(
        state => state.transactions
    );

    const { token } = useSelector((state) => state.auth);

    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

    // useEffect(() => {
    //     dispatch(fetchTransactions());
    // }, [dispatch]);

    useEffect(() => {
        if (token) {
            dispatch(fetchTransactions());
        }
    }, [token, dispatch]);

    // const transactionsAmount = [
    //     {
    //         id: 1,
    //         type: "Transfer",
    //         amount: "-₦5,000",
    //         date: "Today",
    //         status: "Success",
    //     },
    //     {
    //         id: 2,
    //         type: "Airtime",
    //         amount: "-₦1,000",
    //         date: "Yesterday",
    //         status: "Success",
    //     },
    //     {
    //         id: 3,
    //         type: "Data",
    //         amount: "-₦2,500",
    //         date: "2 Jul",
    //         status: "Pending",
    //     },
    // ];

    return (

        <div className="bg-white rounded-3xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-2xl font-bold">

                        Recent Transactions

                    </h2>

                    <p className="text-slate-500">

                        Your latest activities

                    </p>

                </div>

                {/* <button
                    className="
                        flex
                        items-center
                        gap-2

                        text-cyan-600
                        font-semibold
                    "
                >

                    View All

                    <FaArrowRight />

                </button> */}

                <button
                    onClick={() =>
                        navigate("/transactions")
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        text-cyan-600
                        font-semibold
                    "
                >
                    View All

                    <FaArrowRight />
                </button>

            </div>

            <div className="space-y-4">

                {/* {transactions.map((transaction) => (

                    <div
                        key={transaction.id}
                        className="
                            flex

                            justify-between

                            items-center

                            border-b

                            pb-4
                        "
                    >

                        <div>

                            <h4 className="font-semibold">

                                {transaction.type}

                            </h4>

                            <p className="text-sm text-slate-500">

                                {transaction.date}

                            </p>

                        </div>

                        <div className="text-right">

                            <h4 className="font-bold">

                                {transaction.amount}

                            </h4>

                            <span
                                className={`
                                    text-sm

                                    ${
                                        transaction.status === "Success"
                                            ? "text-green-600"
                                            : "text-yellow-500"
                                    }
                                `}
                            >

                                {transaction.status}

                            </span>

                        </div>

                    </div>

                ))} */}

                {transactions.slice(0, 5).map((transaction) => (

                    // <div
                    //     key={transaction._id}
                    //     className="
                    //         flex
                    //         justify-between
                    //         items-center

                    //         border-b

                    //         border-slate-100

                    //         pb-4"
                    // >
                    <div
                        key={transaction._id}

                        onClick={() => {

                            setSelectedTransaction(transaction);

                            setShowDetails(true);

                        }}

                        className="
                            flex
                            justify-between
                            items-center
                            border-b
                            border-slate-100
                            pb-4
                            cursor-pointer
                            hover:bg-slate-50
                            rounded-xl
                            px-2
                            py-3
                            transition
                        "
                    >

                        <div>

                            <h4 className="font-semibold capitalize">

                                {transaction.category}

                            </h4>

                            <p className="text-sm text-slate-500">

                                {transaction.metadata?.narration}

                            </p>

                            <p className="text-xs text-red-500 text-slate-400">

                                {new Date(
                                    transaction.createdAt
                                ).toLocaleString()}

                            </p>

                        </div>

                        <div className="text-right">

                            <h4
                                className={`font-bold ${transaction.type === "credit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >

                                {transaction.type === "credit"
                                    ? "+"
                                    : "-"}

                                ₦{transaction.amount.toLocaleString()}

                            </h4>

                            <span
                                className={`text-sm ${transaction.status === "success"
                                    ? "text-green-600"
                                    : "text-yellow-500"
                                    }`}
                            >

                                {transaction.status}

                            </span>

                        </div>

                    </div>

                ))}

            </div>

            <TransactionDetailsModal

                open={showDetails}

                onClose={() => {

                    setShowDetails(false);

                    setSelectedTransaction(null);

                }}

                transaction={selectedTransaction}

            />
        </div>

    );

}

export default RecentTransactions;