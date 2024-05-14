import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { IHybridPaymaster, SponsorUserOperationDto, PaymasterMode, PaymasterFeeQuote } from "@biconomy/paymaster";
import { ChainIdDetails } from "../../utils/data/network";
import { tokensByNetworkForCC } from "../../utils/data/protocols";

export function useBiconomyERC20Provider() {
    const { smartAccount, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const { setHasExecutionError }: iTrading = useTradingStore((state) => state);
    async function sendToERC20Biconomy(txs) {
        try {
            const partialUserOp = await smartAccount.buildUserOp(txs, {
                paymasterServiceData: {
                    mode: PaymasterMode.ERC20,
                },
            });

            const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
            const feeQuotesResponse = await biconomyPaymaster.getPaymasterFeeQuotesOrData(partialUserOp, {
                // here we are explicitly telling by mode ERC20 that we want to pay in ERC20 tokens and expect fee quotes
                mode: PaymasterMode.ERC20,
                // one can pass tokenList empty array. and it would return fee quotes for all tokens supported by the Biconomy paymaster
                tokenList: [tokensByNetworkForCC[selectedNetwork.chainId].usdc],
                // preferredToken is optional. If you want to pay in a specific token, you can pass its address here and get fee quotes for that token only
                // preferredToken: config.preferredToken,
            });
            const feeQuotes = feeQuotesResponse.feeQuotes as PaymasterFeeQuote[];
            const usdcFeeQuotes = feeQuotes[0];
            // console.log('usdcFeeQuotes', usdcFeeQuotes)

            const finalUserOp = await smartAccount.buildTokenPaymasterUserOp(partialUserOp, {
                feeQuote: usdcFeeQuotes,
                spender: feeQuotesResponse.tokenPaymasterAddress || "",
                maxApproval: false,
            });

            const paymasterAndDataWithLimits = await biconomyPaymaster.getPaymasterAndData(finalUserOp, {
                mode: PaymasterMode.ERC20, // - mandatory // now we know chosen fee token and requesting paymaster and data for it
                feeTokenAddress: usdcFeeQuotes?.tokenAddress,
                // - optional by default false
                // This flag tells the paymaster service to calculate gas limits for the userOp
                // since at this point callData is updated callGasLimit may change and based on paymaster to be used verification gas limit may change
                calculateGasLimits: true,
            });

            // below code is only needed if you sent the glaf calculateGasLimits = true
            if (
                paymasterAndDataWithLimits?.callGasLimit &&
                paymasterAndDataWithLimits?.verificationGasLimit &&
                paymasterAndDataWithLimits?.preVerificationGas
            ) {
                // Returned gas limits must be replaced in your op as you update paymasterAndData.
                // Because these are the limits paymaster service signed on to generate paymasterAndData
                // If you receive AA34 error check here..

                finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
                finalUserOp.verificationGasLimit = paymasterAndDataWithLimits.verificationGasLimit;
                finalUserOp.preVerificationGas = paymasterAndDataWithLimits.preVerificationGas;
            }
            // update finalUserOp with paymasterAndData and send it to smart account
            finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;

            const userOpResponse = await smartAccount.sendUserOp(finalUserOp);
            const txReciept = await userOpResponse.wait();
            return txReciept?.receipt.transactionHash;
        } catch (error: unknown) {
            // console.log("sendToERC20Biconomy-error: ", error);
            if (error instanceof Error && error.message) {
                // Type guard to check if error is an instance of Error
                setHasExecutionError(error.message);
            } else {
                setHasExecutionError(String(error));
            }
            return;
        }
    }
    return useMutation(sendToERC20Biconomy);
}
