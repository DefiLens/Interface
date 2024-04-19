import React, { useEffect, useState } from "react";
import Image from "next/image";
import IERC20 from "../../abis/IERC20.json";
import { optimism } from "../../assets/images";
import { BigNumber, Contract, ethers } from "ethers";
import { iSelectedNetwork } from "../../store/TradingStore";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";
import { decreasePowerByDecimals } from "../../utils/helper";

interface PropTypes {
    network: iSelectedNetwork;
    isErc20: boolean;
    token: any;
    onItemClick: (tokenName: string) => void;
    tokenAddresses:
        | {
              [key: string]: string;
          }
        | undefined;
}

const Token: React.FC<PropTypes> = ({ network, isErc20, token, onItemClick, tokenAddresses }) => {
    // const { tokenBalances, setTokenBalances } = useBalanceStore((state) => state);
    const [tokenBal, setTokenBal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    const tokenAddress = isErc20 ? token.address : tokenAddresses?.[token.name];
    const tokenName = isErc20 ? token.symbol : token.name;

    const getBalance = async () => {
        if (!smartAccountAddress || !tokenAddress) return;

        setIsLoading(true);

        try {
            const provider = await getProvider(network.chainId);

            const erc20 = await getContractInstance(
                isErc20 ? token.address : tokenAddresses?.[token.name],
                IERC20,
                provider
            );

            if (isErc20) {
                // ERC20 Tokens
                const tokendecimal = (await getErc20Decimals(erc20)) ?? 0;
                const balBigNum =
                    (await getErc20Balanceof(erc20 as Contract, smartAccountAddress)) ?? BigNumber.from(0);
                const balance = await decreasePowerByDecimals(balBigNum?.toString(), tokendecimal);

                // if (tokenBalances[tokenName] !== balance && parseFloat(balance) > 0) {
                if (tokenBal !== balance && parseFloat(balance) > 0) {
                    console.log("Balance updated!");
                    setTokenBal(balance);
                    // setTokenBalances({ [tokenName]: balance });
                } else {
                    console.log("Balance same as before!");
                }

                if (balance) {
                    setIsLoading(false);
                }

                console.log({
                    token: tokenName,
                    tokenAddress,
                    balance,
                    tokendecimal,
                    isErc20,
                });
            } else {
                // Non ERC20 Tokens
                // const erc20Instance = await getContractInstance(tokenAddress, IERC20, provider);
                const tokendecimal = (await getErc20Decimals(erc20)) ?? 0;
                const balBigNum: ethers.BigNumber =
                    (await getErc20Balanceof(erc20 as ethers.Contract, smartAccountAddress)) ?? BigNumber.from(0);
                const balance = await decreasePowerByDecimals(balBigNum?.toString(), tokendecimal);

                if (balance) {
                    setIsLoading(false);
                }

                // if (tokenBalances[tokenName] !== balance && parseFloat(balance) > 0) {
                if (tokenBal !== balance && parseFloat(balance) > 0) {
                    console.log("Balance updated!");
                    setTokenBal(balance);
                    // setTokenBalances({ [tokenName]: balance });
                }

                console.log({
                    token: tokenName,
                    tokenAddress,
                    balance,
                    tokendecimal,
                    isErc20,
                });
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // useEffect(() => console.log("tokenBalances", tokenBalances), []);

    useEffect(() => {
        if (Boolean(token)) {
            getBalance();
        }
    }, [smartAccountAddress, token]);

    return (
        <li className="py-2">
            <button
                onClick={() => onItemClick(isErc20 ? token.symbol : token.name)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            >
                <div className="flex items-center w-full justify-between">
                    <div className="inline-flex items-center">
                        {isErc20 && (
                            <Image
                                src={token.logoURI.includes("s2.coinmarketcap.com") ? optimism : token.logoURI}
                                alt=""
                                width={10}
                                height={10}
                                className="w-8 h-8 mr-2"
                            />
                        )}
                        <span>{tokenName}</span>
                    </div>
                    {/* <span className="ml-2 text-gray-500">{!isLoading ? tokenBal : "Loading..."}</span> */}
                    <div className="inline-flex items-center gap-1 text-gray-500">
                        {!isLoading ? (
                            parseFloat(tokenBal) > 0 ? (
                                <span>
                                    {tokenBal} {tokenName}
                                </span>
                            ) : null
                        ) : (
                            <span>Loading...</span>
                        )}
                    </div>
                </div>
            </button>
        </li>
    );
};

export default Token;
