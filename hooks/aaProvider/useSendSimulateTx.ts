import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { TENDERLY_ACCESS_KEY, TENDERLY_PROJECT, TENDERLY_USER } from "../../utils/keys";

function getTxSequence(userAddress: string, to: string, txData: string) {
    return [
        {
            from: userAddress,
            to: to,
            input: txData,
        },
    ];
}

interface ConvertedObject {
    from: string;
    to: string;
    input: string;
    value: BigNumber;
}

interface OriginalObject {
    to: string;
    data?: string;
    value?: BigNumber;
}

function convertArray(array: OriginalObject[]): ConvertedObject[] {
    return array.map(obj => ({
        from: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // Entrypoint
        to: obj.to,
        input: obj.data || "", // If 'data' is undefined, set input to an empty string
        value: obj.value || BigNumber.from("0")
    }));
}

function separateArrays(convertedArray: ConvertedObject[]): { fromArray: string[], toArray: string[], inputArray: string[], valueArray: BigNumber[] } {
    const fromArray = convertedArray.map(obj => obj.from);
    const toArray = convertedArray.map(obj => obj.to);
    const inputArray = convertedArray.map(obj => obj.input);
    const valueArray = convertedArray.map(obj => obj.value);
    return { fromArray, toArray, inputArray, valueArray };
}

export function useSendSimulateTx() {
    const { smartAccount, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const { setHasExecutionError, individualBatch }: iTrading = useTradingStore((state) => state);
    async function sendSimulateTx(txs) {
        try {

            const txsNew = convertArray(txs)
            console.log("txsNew", txsNew, smartAccount.accountAddress)

            const { fromArray, toArray, inputArray, valueArray } = separateArrays(txsNew);
            const bigNumberArray: BigNumber[] = [];
            for (let i = 0; i < toArray.length; i++) {
                bigNumberArray.push(BigNumber.from("0".repeat(toArray.length)));
            }
            console.log("bigNumberArray", bigNumberArray)
            const abiInterface = new ethers.utils.Interface(["function executeBatch(address[],uint256[],bytes[])"]);
            const txData = abiInterface.encodeFunctionData("executeBatch", [toArray, valueArray, inputArray]);

            const simulate = (
                await axios.post(
                    `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate-bundle`,
                    {
                        simulations: getTxSequence("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", "0x9Ce935D780424FB795bef7E72697f263A8258fAA", txData).map(
                            (transaction) => ({
                                network_id: selectedNetwork.chainId, // network to simulate on
                                save: true,
                                save_if_fails: true,
                                simulation_type: "full",
                                ...transaction,
                            })
                        ),
                    },
                    {
                        headers: { "X-Access-Key": TENDERLY_ACCESS_KEY as string },
                    }
                )
            ).data;
            console.log("simulate", simulate)
            console.log("simulate", simulate.simulation_results[0].transaction.hash)

            // https://dashboard.tenderly.co/sunnyRK/project/simulator/1115b85a-73c7-44dc-abfa-3338d6ed03b5
            return simulate.simulation_results[0].simulation.id // simulation reciept
        } catch (error: unknown) {
            console.log("sendSimulateTx-error: ", error);
            if (error instanceof Error && error.message) { // Type guard to check if error is an instance of Error
                setHasExecutionError(error.message);
            } else {
                setHasExecutionError(String(error));
            }
            return;
        }
    }
    return useMutation(sendSimulateTx);
}
