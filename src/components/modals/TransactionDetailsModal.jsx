import { useState } from "react";
import { FaReceipt } from "react-icons/fa";
import jsPDF from "jspdf";
import { getTransactionReceipt } from "../../features/transactions/transactionService";

function TransactionDetailsModal({
    open,
    onClose,
    transaction,
}) {
    const [receipt, setReceipt] = useState(null);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [receiptError, setReceiptError] = useState("");


    // const handleViewReceipt = async () => {

    //     try {

    //         setReceiptLoading(true);
    //         setReceiptError("");

    //         const response = await getTransactionReceipt(
    //             transaction._id
    //         );

    //         console.log(
    //             "Receipt response:",
    //             response
    //         );

    //         // For now, let's see exactly what
    //         // your backend returns.

    //     } catch (error) {

    //         console.error(
    //             "Receipt error:",
    //             error.response?.data ||
    //             error.message
    //         );

    //         setReceiptError(
    //             error.response?.data?.message ||
    //             "Unable to retrieve receipt"
    //         );

    //     } finally {

    //         setReceiptLoading(false);

    //     }

    // };

    console.log("FULL RECEIPT:", receipt);
    const handleViewReceipt = async () => {
        try {
            setReceiptLoading(true);
            setReceiptError("");

            const response = await getTransactionReceipt(
                transaction._id
            );

            // console.log("Receipt response:", response);
            console.log(
                "Receipt response:",
                JSON.stringify(response, null, 2)
            );

            console.log(
                "Receipt object:",
                JSON.stringify(response.receipt, null, 2)
            );

            setReceipt(response.receipt);

        } catch (error) {
            console.error(
                "Receipt error:",
                error.response?.data || error.message
            );

            setReceiptError(
                error.response?.data?.message ||
                "Unable to retrieve receipt"
            );
        } finally {
            setReceiptLoading(false);
        }
    };


    // const handleDownloadReceipt = () => {
    //     if (!receipt) return;

    //     const doc = new jsPDF();

    //     const formatAmount = Number(
    //         receipt.amount || 0
    //     ).toLocaleString();

    //     const formatCharges = Number(
    //         receipt.charges || 0
    //     ).toLocaleString();

    //     const formatBalance = Number(
    //         receipt.walletBalance || 0
    //     ).toLocaleString();

    //     const paymentType = receipt.paymentType
    //         ?.replace(/_/g, " ")
    //         ?.replace(/\b\w/g, (letter) =>
    //             letter.toUpperCase()
    //         );

    //     // Header
    //     doc.setFontSize(22);
    //     doc.setFont("helvetica", "bold");
    //     doc.text("FINTECH", 105, 25, {
    //         align: "center",
    //     });

    //     doc.setFontSize(16);
    //     doc.text("Payment Receipt", 105, 36, {
    //         align: "center",
    //     });

    //     // Divider
    //     doc.setLineWidth(0.5);
    //     doc.line(20, 45, 190, 45);

    //     // Amount
    //     doc.setFontSize(12);
    //     doc.setFont("helvetica", "normal");
    //     doc.text("Amount", 20, 60);

    //     doc.setFontSize(24);
    //     doc.setFont("helvetica", "bold");
    //     doc.text(
    //         `NGN ${formatAmount}`,
    //         20,
    //         72
    //     );

    //     // Status
    //     doc.setFontSize(12);
    //     doc.setFont("helvetica", "normal");
    //     doc.text(
    //         `Status: ${receipt.status}`,
    //         20,
    //         85
    //     );

    //     // Details
    //     let y = 105;

    //     const addRow = (label, value) => {
    //         doc.setFont("helvetica", "normal");
    //         doc.setFontSize(10);
    //         doc.text(label, 20, y);

    //         doc.setFont("helvetica", "bold");
    //         doc.text(
    //             String(value ?? "-"),
    //             80,
    //             y
    //         );

    //         y += 12;
    //     };

    //     addRow(
    //         "Receipt Number",
    //         receipt.receiptNumber
    //     );

    //     addRow(
    //         "Transaction Reference",
    //         receipt.reference
    //     );

    //     addRow(
    //         "Account Number",
    //         receipt.accountNumber
    //     );

    //     addRow(
    //         "Payment Type",
    //         paymentType
    //     );

    //     addRow(
    //         "Provider",
    //         receipt.provider
    //     );

    //     addRow(
    //         "Charges",
    //         `NGN ${formatCharges}`
    //     );

    //     addRow(
    //         "Wallet Balance",
    //         `NGN ${formatBalance}`
    //     );

    //     addRow(
    //         "Date",
    //         new Date(
    //             receipt.date
    //         ).toLocaleString()
    //     );

    //     // Footer
    //     doc.setLineWidth(0.5);
    //     doc.line(20, y + 5, 190, y + 5);

    //     doc.setFont("helvetica", "normal");
    //     doc.setFontSize(9);

    //     doc.text(
    //         "Thank you for using our platform.",
    //         105,
    //         y + 20,
    //         {
    //             align: "center",
    //         }
    //     );

    //     doc.text(
    //         "This is a computer-generated receipt.",
    //         105,
    //         y + 28,
    //         {
    //             align: "center",
    //         }
    //     );

    //     // Download
    //     doc.save(
    //         `receipt-${receipt.receiptNumber}.pdf`
    //     );
    // };
    const handleDownloadReceipt = () => {
        if (!receipt) return;

        const doc = new jsPDF();

        const formatAmount = (value) =>
            Number(value || 0).toLocaleString();

        const paymentType = receipt.paymentType
            ?.replace(/_/g, " ")
            ?.replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );

        // =========================
        // HEADER
        // =========================

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);

        doc.text("FINTECH", 105, 25, {
            align: "center",
        });

        doc.setFontSize(16);

        doc.text("Transaction Receipt", 105, 36, {
            align: "center",
        });

        doc.setLineWidth(0.5);

        doc.line(20, 45, 190, 45);


        // =========================
        // AMOUNT
        // =========================

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text("Amount", 20, 60);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);

        doc.text(
            `NGN ${formatAmount(receipt.amount)}`,
            20,
            72
        );


        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text(
            `Status: ${receipt.status}`,
            20,
            84
        );


        // =========================
        // DETAILS
        // =========================

        let y = 102;

        const addRow = (label, value) => {

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            doc.text(label, 20, y);

            doc.setFont("helvetica", "bold");

            // splitTextToSize prevents long
            // references/names from overflowing

            const text = doc.splitTextToSize(
                String(value ?? "-"),
                100
            );

            doc.text(text, 80, y);

            y += text.length > 1
                ? 12 * text.length
                : 12;
        };


        // =========================
        // TRANSFER DETAILS
        // =========================

        if (receipt.paymentType === "transfer") {

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "Sender Details",
                20,
                y
            );

            y += 10;

            addRow(
                "Sender Name",
                receipt.senderName
            );

            addRow(
                "Sender Account",
                receipt.senderAccount
            );


            y += 5;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);

            doc.text(
                "Receiver Details",
                20,
                y
            );

            y += 10;

            addRow(
                "Receiver Name",
                receipt.receiverName
            );

            addRow(
                "Receiver Account",
                receipt.receiverAccount
            );

        }


        // =========================
        // COMMON DETAILS
        // =========================

        addRow(
            "Payment Type",
            paymentType
        );

        addRow(
            "Provider",
            receipt.provider
        );

        addRow(
            "Reference",
            receipt.reference
        );

        addRow(
            "Receipt Number",
            receipt.receiptNumber
        );

        addRow(
            "Charges",
            `NGN ${formatAmount(receipt.charges)}`
        );

        addRow(
            "Wallet Balance",
            `NGN ${formatAmount(receipt.walletBalance)}`
        );

        addRow(
            "Date",
            new Date(receipt.date).toLocaleString()
        );


        // =========================
        // NARRATION
        // =========================

        if (receipt.narration) {

            addRow(
                "Narration",
                receipt.narration
            );

        }


        // =========================
        // FOOTER
        // =========================

        y += 10;

        doc.setLineWidth(0.5);

        doc.line(
            20,
            y,
            190,
            y
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        doc.text(
            "Thank you for using our platform.",
            105,
            y + 15,
            {
                align: "center",
            }
        );

        doc.text(
            "This is a computer-generated receipt.",
            105,
            y + 23,
            {
                align: "center",
            }
        );


        // =========================
        // DOWNLOAD
        // =========================

        doc.save(
            `receipt-${receipt.receiptNumber}.pdf`
        );
    };

    if (!open || !transaction) {
        return null;
    }

    const metadata = transaction.metadata || {};

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-lg
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-3xl
                    bg-white
                    p-6
                    shadow-2xl
                "
            >

                {/* Header */}

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Transaction Details
                        </h2>

                        <p className="text-sm text-slate-500">
                            {transaction.category}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            text-2xl
                            text-slate-400
                            hover:text-slate-700
                        "
                    >
                        ×
                    </button>

                </div>


                {/* Amount */}

                <div className="text-center mb-6">

                    <p className="text-sm text-slate-500">
                        Amount
                    </p>

                    <h1
                        className={`text-4xl font-bold mt-2 ${transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >

                        {transaction.type === "credit"
                            ? "+"
                            : "-"
                        }

                        ₦{Number(transaction.amount).toLocaleString()}

                    </h1>

                    <span
                        className={`
                            inline-block
                            mt-3
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            ${transaction.status === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                        `}
                    >
                        {transaction.status}
                    </span>

                </div>


                {/* Details */}

                <div className="space-y-4">

                    <div className="flex justify-between border-b pb-3">

                        <span className="text-slate-500">
                            Type
                        </span>

                        <span className="font-semibold capitalize">
                            {transaction.type}
                        </span>

                    </div>


                    <div className="flex justify-between border-b pb-3">

                        <span className="text-slate-500">
                            Category
                        </span>

                        <span className="font-semibold capitalize">
                            {transaction.category}
                        </span>

                    </div>


                    <div className="border-b pb-3">

                        <p className="text-slate-500 text-sm">
                            Reference
                        </p>

                        <p className="font-semibold break-all mt-1">
                            {transaction.reference}
                        </p>

                    </div>


                    {metadata.senderName && (

                        <div className="flex justify-between border-b pb-3">

                            <span className="text-slate-500">
                                Sender
                            </span>

                            <span className="font-semibold text-right">
                                {metadata.senderName}
                                <br />
                                <span className="text-sm text-slate-500">
                                    {metadata.senderAccount}
                                </span>
                            </span>

                        </div>

                    )}


                    {metadata.receiverName && (

                        <div className="flex justify-between border-b pb-3">

                            <span className="text-slate-500">
                                Receiver
                            </span>

                            <span className="font-semibold text-right">
                                {metadata.receiverName}
                                <br />
                                <span className="text-sm text-slate-500">
                                    {metadata.receiverAccount}
                                </span>
                            </span>

                        </div>

                    )}


                    {metadata.narration && (

                        <div className="border-b pb-3">

                            <p className="text-slate-500 text-sm">
                                Narration
                            </p>

                            <p className="font-semibold mt-1">
                                {metadata.narration}
                            </p>

                        </div>

                    )}


                    <div className="flex justify-between border-b pb-3">

                        <span className="text-slate-500">
                            Charges
                        </span>

                        <span className="font-semibold">
                            ₦{Number(
                                metadata.charges || 0
                            ).toLocaleString()}
                        </span>

                    </div>


                    <div className="border-b pb-3">

                        <p className="text-slate-500 text-sm">
                            Date
                        </p>

                        <p className="font-semibold mt-1">
                            {new Date(
                                transaction.createdAt
                            ).toLocaleString()}
                        </p>

                    </div>

                </div>

                {/* buttons */}
                {transaction.status === "success" && (

                    <button
                        onClick={handleViewReceipt}
                        disabled={receiptLoading}
                        className="
                            w-full
                            mt-6
                            rounded-xl
                            bg-blue-700
                            hover:bg-blue-800
                            text-white
                            py-3
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <FaReceipt />

                        {receiptLoading
                            ? "Loading Receipt..."
                            : "View Receipt"
                        }

                    </button>

                )}

                {/* Receipt */}
                {receipt && (
                    <div className="
                        fixed
                        inset-0
                        z-[60]
                        flex
                        items-center
                        justify-center
                        bg-black/60
                        p-4
                    ">

                        <div className="
                            w-full
                            max-w-md
                            max-h-[90vh]
                            overflow-y-auto
                            bg-white
                            rounded-3xl
                            shadow-2xl
                            p-6
                        ">

                            {/* Receipt Header */}

                            <div className="text-center">

                                <FaReceipt
                                    className="
                                        text-blue-700
                                        text-4xl
                                        mx-auto
                                    "
                                />

                                <h2 className="
                                    text-2xl
                                    font-bold
                                    mt-3
                                ">
                                    Payment Receipt
                                </h2>

                                <p className="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                ">
                                    Transaction completed successfully
                                </p>

                            </div>


                            {/* Amount */}

                            <div className="
                                text-center
                                bg-slate-50
                                rounded-2xl
                                p-5
                                mt-6
                            ">

                                <p className="text-sm text-slate-500">
                                    Amount
                                </p>

                                <h1 className="
                                    text-4xl
                                    font-bold
                                    text-green-600
                                    mt-1
                                ">
                                    ₦{Number(
                                        receipt.amount
                                    ).toLocaleString()}
                                </h1>

                                <span className="
                                    inline-block
                                    mt-2
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-green-100
                                    text-green-700
                                    text-sm
                                    capitalize
                                ">
                                    {receipt.status}
                                </span>

                            </div>


                            {/* Receipt Details Modals */}

                            <div className="
                                mt-6
                                space-y-4
                            ">

                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    <span className="text-slate-500">
                                        Receipt Number
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-right
                                        break-all
                                        max-w-[200px]
                                    ">
                                        {receipt.receiptNumber}
                                    </span>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    <span className="text-slate-500">
                                        Reference
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-right
                                        break-all
                                        max-w-[200px]
                                    ">
                                        {receipt.reference}
                                    </span>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    <span className="text-slate-500">
                                        Account Number
                                    </span>

                                    <span className="font-semibold">
                                        {receipt.accountNumber}
                                    </span>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    <span className="text-slate-500">
                                        Payment Type
                                    </span>

                                    <span className="
                                        font-semibold
                                        capitalize
                                    ">
                                        {receipt.paymentType.replace(
                                            "_",
                                            " "
                                        )}
                                    </span>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    <span className="text-slate-500">
                                        Provider
                                    </span>

                                    <span className="font-semibold">
                                        {receipt.provider}
                                    </span>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    <span className="text-slate-500">
                                        Charge
                                    </span>

                                    <span className="font-semibold">
                                        ₦{Number(
                                            receipt.charges
                                        ).toLocaleString()}
                                    </span>
                                </div>


                                <div className="
                                    flex
                                    justify-between
                                    border-b
                                    pb-3
                                ">
                                    {/* <span className="text-slate-500">
                                        Wallet Balance
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-green-600
                                    ">
                                        ₦{Number(
                                            receipt.walletBalance
                                        ).toLocaleString()}
                                    </span> */}
                                </div>


                                <div className="
                                    border-b
                                    pb-3
                                ">
                                    <p className="text-slate-500 text-sm">
                                        Date
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {new Date(
                                            receipt.date
                                        ).toLocaleString()}
                                    </p>
                                </div>

                            </div>


                            {/* Close Receipt */}

                            {/* <button
                                onClick={() => setReceipt(null)}
                                className="
                                    w-full
                                    mt-6
                                    bg-slate-900
                                    text-white
                                    rounded-xl
                                    py-3
                                    font-semibold
                                "
                            >
                                Close Receipt
                            </button> */}

                            <div className="flex gap-3 mt-6">

                                <button
                                    onClick={handleDownloadReceipt}
                                    className="
                                        flex-1
                                        bg-blue-700
                                        hover:bg-blue-800
                                        text-white
                                        rounded-xl
                                        py-3
                                        font-semibold
                                    "
                                >
                                    Download PDF
                                </button>

                                <button
                                    onClick={() => setReceipt(null)}
                                    className="
                                        flex-1
                                        bg-slate-900
                                        hover:bg-slate-800
                                        text-white
                                        rounded-xl
                                        py-3
                                        font-semibold
                                    "
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {receiptError && (

                    <p className="text-center text-sm text-red-600 mt-3">
                        {receiptError}
                    </p>

                )}

                <button
                    onClick={onClose}
                    className="
                        w-full
                        mt-3
                        rounded-xl
                        bg-slate-900
                        text-white
                        py-3
                        font-semibold
                    "
                >
                    Close
                </button>


                {/* <button
                    onClick={onClose}
                    className="
                        w-full
                        mt-6
                        rounded-xl
                        bg-slate-900
                        text-white
                        py-3
                        font-semibold
                    "
                >
                    Close
                </button> */}

                {/* receipt button */}

                {/* {transaction.status === "success" && (

                    <button
                        onClick={handleViewReceipt}
                        disabled={receiptLoading}
                        className="
                            w-full
                            mt-6
                            rounded-xl
                            bg-blue-700
                            hover:bg-blue-800
                            text-white
                            py-3
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                            disabled:bg-slate-300
                            disabled:cursor-not-allowed
                        "
                    >

                        <FaReceipt />

                        {receiptLoading
                            ? "Loading Receipt..."
                            : "View Receipt"
                        }

                    </button>

                )} */}

                {receiptError && (

                    <p className="
                        text-center
                        text-sm
                        text-red-600
                        mt-3
                    ">
                        {receiptError}
                    </p>

                )}

            </div>

        </div>

    );
}

export default TransactionDetailsModal;