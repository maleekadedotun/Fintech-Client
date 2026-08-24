import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaFilter } from "react-icons/fa";
import {
    FaWallet,
    FaExchangeAlt,
    FaMobileAlt,
    FaWifi,
    FaBolt,
    FaTv,
    FaGraduationCap,
    FaCreditCard,
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import TransactionDetailsModal from "../../components/modals/TransactionDetailsModal";
import { fetchTransactions } from "../../features/transactions/transactionSlice";
import { getTransactionsPagination } from "../../features/transactions/transactionService";

function Transactions() {

    const dispatch = useDispatch();

    const {
        transactions,
        loading,
    } = useSelector(
        (state) => state.transactions
    );

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const transactionsPerPage = 10;


    // Helpers
    const getTransactionIcon = (transaction) => {
        const category =
            transaction.category?.toLowerCase();

        switch (category) {
            case "wallet_fund":
                return <FaWallet />;

            case "transfer":
                return <FaExchangeAlt />;

            case "airtime":
                return <FaMobileAlt />;

            case "data":
                return <FaWifi />;

            case "electricity":
                return <FaBolt />;

            case "cable":
                return <FaTv />;

            case "education":
                return <FaGraduationCap />;

            default:
                return <FaCreditCard />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "success":
                return "bg-green-100 text-green-700";

            case "failed":
                return "bg-red-100 text-red-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getTransactionDescription = (transaction) => {
        const metadata = transaction.metadata || {};

        switch (transaction.category) {
            case "transfer":
                if (transaction.type === "debit") {
                    return `Sent to ${metadata.receiverName || "recipient"}`;
                }

                if (transaction.type === "credit") {
                    return `Received from ${metadata.senderName || "sender"}`;
                }

                break;

            case "wallet_fund":
                return "Wallet funding";

            case "airtime":
                return "Airtime purchase";

            case "data":
                return "Data subscription";

            case "electricity":
                return "Electricity payment";

            case "cable":
                return "Cable TV payment";

            case "education":
                return "Education payment";

            default:
                return metadata.narration || "Transaction";
        }
    };

    // Helpers end here

    useEffect(() => {

        dispatch(fetchTransactions());

    }, [dispatch]);


    const filteredTransactions = transactions.filter((transaction) => {

        const searchValue = search.toLowerCase();

        // Marches Search
        // const matchesSearch =
        //     transaction.reference
        //         ?.toLowerCase()
        //         .includes(searchValue) ||

        const matchesSearch =
            transaction.reference
                ?.toLowerCase()
                .includes(searchValue) ||

            transaction.metadata?.narration
                ?.toLowerCase()
                .includes(searchValue) ||

            transaction.category
                ?.toLowerCase()
                .includes(searchValue) ||

            transaction.metadata?.senderName
                ?.toLowerCase()
                .includes(searchValue) ||

            transaction.metadata?.receiverName
                ?.toLowerCase()
                .includes(searchValue) ||

            transaction.metadata?.senderAccountNumber
                ?.toLowerCase()
                .includes(searchValue) ||

            transaction.metadata?.receiverAccountNumber
                ?.toLowerCase()
                .includes(searchValue);



        transaction.metadata?.narration
            ?.toLowerCase()
            .includes(searchValue) ||

            transaction.category
                ?.toLowerCase()
                .includes(searchValue);


        const matchesType =
            typeFilter === "all" ||
            transaction.type === typeFilter;


        const matchesStatus =
            statusFilter === "all" ||
            transaction.status === statusFilter;


        const matchesCategory =
            categoryFilter === "all" ||
            transaction.category === categoryFilter;

        const transactionDate =
            new Date(transaction.createdAt);

        const matchesStartDate =
            !startDate ||
            transactionDate >= new Date(startDate);

        const matchesEndDate =
            !endDate ||
            transactionDate <= new Date(
                `${endDate}T23:59:59`
            );

        // const matchesStartDate = !startDate || transactionDate >= new Date(`${startDate}T00:00:00`);

        // const matchesEndDate = !endDate || transactionDate <= new Date(`${endDate}T23:59:59.999`);

        return (
            matchesSearch &&
            matchesType &&
            matchesStatus &&
            matchesCategory &&
            matchesStartDate &&
            matchesEndDate
        );

    });

    const totalTransactions = filteredTransactions.length;

    const totalCredits = filteredTransactions
        .filter((transaction) => transaction.type === "credit")
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount || 0),
            0
        );

    const totalDebits = filteredTransactions
        .filter((transaction) => transaction.type === "debit")
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount || 0),
            0
        );


    const openTransaction = (transaction) => {

        setSelectedTransaction(transaction);

        setShowDetails(true);

    };

    const indexOfLastTransaction =
        currentPage * transactionsPerPage;

    const indexOfFirstTransaction =
        indexOfLastTransaction - transactionsPerPage;

    const currentTransactions =
        filteredTransactions.slice(
            indexOfFirstTransaction,
            indexOfLastTransaction
        );

    const totalPages = Math.ceil(
        filteredTransactions.length /
        transactionsPerPage
    );



    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        typeFilter,
        statusFilter,
        categoryFilter,
        startDate,
        endDate,

    ]);


    return (

        <DashboardLayout>

            <div className="space-y-6">

                {/* Header */}

                <div>

                    <h1 className="text-3xl font-bold">
                        Transactions
                    </h1>

                    <p className="text-slate-500 mt-2">
                        View and manage your transaction history.
                    </p>

                </div>


                {/* Filters */}

                <div className="bg-white rounded-3xl shadow-sm p-6 bg-blue-900">

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                    ">

                        {/* Search */}

                        <div className="relative">

                            <FaSearch
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search transactions..."
                                className="
                                    w-full
                                    border
                                    border-slate-200
                                    rounded-xl
                                    py-3
                                    pl-11
                                    pr-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>


                        {/* Type */}

                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="
                                border
                                border-slate-200
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                            "
                        >

                            <option value="all">
                                All Types
                            </option>

                            <option value="credit">
                                Credit
                            </option>

                            <option value="debit">
                                Debit
                            </option>

                        </select>


                        {/* Status */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="
                                border
                                border-slate-200
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                            "
                        >

                            <option value="all">
                                All Status
                            </option>

                            <option value="success">
                                Success
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                        </select>


                        {/* Category */}

                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                            className="
                                border
                                border-slate-200
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                            "
                        >

                            <option value="all">
                                All Categories
                            </option>

                            <option value="transfer">
                                Transfer
                            </option>

                            <option value="airtime">
                                Airtime
                            </option>

                            <option value="data">
                                Data
                            </option>

                            <option value="electricity">
                                Electricity
                            </option>

                            <option value="cable">
                                Cable
                            </option>

                        </select>

                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Start Date
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="
                                w-full
                                border
                                border-slate-200
                                rounded-xl
                                py-3
                                px-4
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        />
                    </div> */}

                    {/* <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            End Date
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="
                                w-full
                                border
                                border-slate-200
                                rounded-xl
                                py-3
                                px-4
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        />
                    </div> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="
                                    w-full
                                    border
                                    border-slate-200
                                    rounded-xl
                                    py-3
                                    px-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />
                        </div>


                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="
                                    w-full
                                    border
                                    border-slate-200
                                    rounded-xl
                                    py-3
                                    px-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />
                        </div>

                    </div>
                    {/* clear button */}
                    <button
                        onClick={() => {
                            setSearch("");
                            setTypeFilter("all");
                            setStatusFilter("all");
                            setCategoryFilter("all");
                            setStartDate("");
                            setEndDate("");
                            setCurrentPage(1);
                        }}
                        className="
                            px-5
                            py-3
                            mt-5
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-700
                            font-medium
                            hover:bg-slate-50
                            transition
                        "
                    >
                        Clear Filters
                    </button>

                </div>


                {/* Transactions */}

                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                        {/* Transactions */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500">
                                Transactions
                            </p>

                            <h3 className="text-2xl font-bold mt-1">
                                {totalTransactions}
                            </h3>
                        </div>


                        {/* Credits */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500">
                                Total Credits
                            </p>

                            <h3 className="text-2xl font-bold text-green-600 mt-1">
                                +₦{totalCredits.toLocaleString()}
                            </h3>
                        </div>


                        {/* Debits */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-500">
                                Total Debits
                            </p>

                            <h3 className="text-2xl font-bold text-red-600 mt-1">
                                -₦{totalDebits.toLocaleString()}
                            </h3>
                        </div>

                    </div>

                    <div className="flex items-center gap-2 mb-6">

                        <FaFilter className="text-blue-600" />

                        <h2 className="text-xl font-bold">
                            Transaction History
                        </h2>

                    </div>


                    {loading ? (

                        <div className="py-10 text-center text-slate-500">
                            Loading transactions...
                        </div>

                    ) : filteredTransactions.length === 0 ? (

                        <div className="py-10 text-center">

                            <p className="text-slate-500">
                                No transactions found.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-3">

                            {currentTransactions.map(
                                (transaction) => (

                                    <div
                                        key={transaction._id}
                                        onClick={() =>
                                            openTransaction(
                                                transaction
                                            )
                                        }
                                        className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            gap-4
                                            border
                                            border-slate-100
                                            rounded-2xl
                                            p-4
                                            cursor-pointer
                                            hover:bg-slate-50
                                            hover:shadow-sm
                                            transition
                                            bg-gradient-to-r
                                            from-slate-700
                                            via-blue-700
                                            to-white-600
                                            text-white
                                        "
                                    >

                                        {/* <div>

                                            <h3 className="
                                                font-semibold
                                                capitalize
                                            ">
                                                {transaction.category}
                                            </h3>

                                            <p className="
                                                text-sm
                                                text-slate-500
                                                mt-1
                                            ">
                                                {transaction.metadata?.narration ||
                                                    "Transaction"}
                                            </p>

                                            <p className="
                                                text-xs
                                                text-slate-400
                                                mt-1
                                            ">
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div> */}

                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`
                                                w-11
                                                h-11
                                                rounded-full
                                                flex
                                                items-center
                                                justify-center
                                                text-lg
                                                ${transaction.type === "credit"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }
                                            `}
                                            >
                                                {getTransactionIcon(transaction)}
                                            </div>

                                            <div>

                                                <h3 className="font-semibold capitalize">
                                                    {transaction.category?.replace(/_/g, " ")}
                                                </h3>

                                                {/* <p className="text-sm text-slate-500 mt-1">
                                                    {transaction.metadata?.narration ||
                                                        "Transaction"}
                                                </p> */}
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {getTransactionDescription(transaction)}
                                                </p>

                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleString()}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="sm:text-right">

                                            <h3
                                                className={`
                                                    font-bold
                                                    text-lg
                                                    ${transaction.type ===
                                                        "credit"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                    }
                                                `}
                                            >

                                                {transaction.type ===
                                                    "credit"
                                                    ? "+"
                                                    : "-"
                                                }

                                                ₦
                                                {Number(
                                                    transaction.amount
                                                ).toLocaleString()}

                                            </h3>


                                            {/* <span
                                                className={`
                                                    inline-block
                                                    mt-1
                                                    text-sm
                                                    capitalize
                                                    ${transaction.status ===
                                                        "success"
                                                        ? "text-green-600"
                                                        : transaction.status ===
                                                            "failed"
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                    }
                                                `}
                                            >
                                                {transaction.status}
                                            </span> */}

                                            <span
                                                className={`
                                                    inline-block
                                                    mt-1
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-semibold
                                                    capitalize
                                                    ${getStatusStyle(transaction.status)}
                                                `}
                                            >
                                                {transaction.status}
                                            </span>
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}
                    {totalPages > 1 && (

                        <div className="
                            flex
                            items-center
                            justify-between
                            mt-6
                            pt-6
                            border-t
                            border-slate-100
                        ">

                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        (page) => page - 1
                                    )
                                }
                                disabled={currentPage === 1}
                                className="
                                    px-4
                                    py-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                            >
                                Previous
                            </button>


                            <span className="
                                text-sm
                                text-slate-500
                            ">
                                Page {currentPage} of {totalPages}
                            </span>


                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        (page) => page + 1
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="
                                    px-4
                                    py-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                            >
                                Next
                            </button>

                        </div>

                    )}

                </div>


                {/* Details Modal */}

                <TransactionDetailsModal

                    open={showDetails}

                    onClose={() => {

                        setShowDetails(false);

                        setSelectedTransaction(null);

                    }}

                    transaction={selectedTransaction}

                />

            </div>

        </DashboardLayout>

    );

}

export default Transactions;