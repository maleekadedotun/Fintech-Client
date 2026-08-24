import api from "../../api/axios";

export const getTransactions = async () => {
    const response = await api.get("/wallet/all-transactions");
    return response.data;
};

export const lookupAccount = async (accountNumber) => {

    const response = await api.get(
        `/wallet/lookup/${accountNumber}`
    );

    return response.data;
};

export const getWalletBalance = async () => {
    const response = await api.get("/wallet/balance");

    return response.data;
};

export const getTransactionReceipt = async (transactionId) => {
    const response = await api.get(
        `/wallet/transactions/${transactionId}/receipt`
    );

    return response.data;
};
// pagination
export const getTransactionsPagination = async (
    page = 1,
    limit = 10,
    startDate = "",
    endDate = ""
) => {
    const response = await api.get("/wallet/transactions", {
        params: {
            page,
            limit,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        },
    });

    return response.data;
};

// export const transferMoney = async (data) => {

//     const response = await api.post(

//         "/wallet/transfer",

//         data

//     );
//     console.log(response);

//     return response.data;

// };