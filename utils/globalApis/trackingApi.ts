import axiosInstance from "../../axiosInstance/axiosInstance";

export interface iTransactionData {
    smartAccount: string;
    eoaAccount: string | undefined;
    token: string;
    network: string | undefined;
    amount: string | number;
    txHash: string;
    type: "EOA_TO_SCW" | "SCW_TO_EOA";
    fromPage: "TRANSFER_FUND" | "PORTFOLIO" | "ONBOARDING"; 
}

// Save migration transaction history
export const saveMigrateTxnHistory = async (
    smartAccount: string,
    eoaAccount: string | undefined,
    token: string,
    network: string | undefined,
    amount: string | number,
    txHash: string,
    type: "EOA_TO_SCW" | "SCW_TO_EOA",
    fromPage: "TRANSFER_FUND" | "PORTFOLIO" | "ONBOARDING"
): Promise<iTransactionData> => {
    try {
        const response = await axiosInstance.post('/transactions/migrate', {
            smartAccount,
            eoaAccount,
            token,
            network,
            amount,
            txHash,
            type,
            fromPage,
        });

        if (response.status === 201) {
            console.log('Migrate transaction created:', response.data);
        }

        return response.data as iTransactionData;
    } catch (error) {
        console.error('Error creating migrate transaction:', error);
        throw error;
    }
};

//Login API
export const handleLogin = async (smartAccountAddress: string, eoaAccount: string | undefined, wallet: string | undefined) => {
    try {
        const requestBody = {
            smartAccount: smartAccountAddress,
            eoaAccount: eoaAccount,
            walletProvider: wallet
        };

        const response = await axiosInstance.post('/auth/login', requestBody);

        // Check if the login was successful
        if (response.status === 200) {
            console.log('Login successful');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
