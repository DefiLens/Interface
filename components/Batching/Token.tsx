import React, { useEffect, useState } from "react";
import Image from "next/image";
import IERC20 from "../../abis/IERC20.json";
import { optimism } from "../../assets/images";
import { BigNumber, Contract, ethers } from "ethers";
import { iSelectedNetwork, iTrading, useTradingStore } from "../../store/TradingStore";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";
import { decreasePowerByDecimals } from "../../utils/helper";
import axiosInstance from "../../axiosInstance/axiosInstance";

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
    handleSelectedTokenAddress?: (_tokenAddress: string) => void;
}

const Token: React.FC<PropTypes> = ({
    network,
    isErc20,
    token,
    onItemClick,
    tokenAddresses,
    handleSelectedTokenAddress,
}) => {
    const [tokenBal, setTokenBal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { smartAccountAddress }: iGlobal = useGlobalStore((state) => state);

    const tokenAddress = isErc20 ? token.address : tokenAddresses?.[token.name];
    const tokenName = isErc20 ? token.symbol : token.name;

    const getBalance = async () => {
        // console.log("----------------Calling getBalance----------------");
        if (!smartAccountAddress || !tokenAddress) return;

        setIsLoading(true);

        try {
            const provider = await getProvider(network.chainId);

            const erc20 = await getContractInstance(
                isErc20 ? token.address : tokenAddresses?.[token.name],
                IERC20,
                provider
            );

            let balance = "";

            if (isErc20) {
                // ERC20 Tokens
                const tokendecimal = (await getErc20Decimals(erc20)) ?? 0;
                const balBigNum = (await getErc20Balanceof(erc20 as Contract, smartAccountAddress)) ?? BigNumber.from(0);

                balance = await decreasePowerByDecimals(balBigNum?.toString(), tokendecimal);
            } else {
                // Non ERC20 Tokens
                const tokendecimal = (await getErc20Decimals(erc20)) ?? 0;
                const balBigNum: ethers.BigNumber =
                    (await getErc20Balanceof(erc20 as ethers.Contract, smartAccountAddress)) ?? BigNumber.from(0);
                balance = await decreasePowerByDecimals(balBigNum?.toString(), tokendecimal);
            }

            if (balance !== tokenBal && parseFloat(balance) > 0) {
                setTokenBal(balance);
            }

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const [oraclePrice, setOraclePrice] = useState<number>(0);
    const [oraclePriceLoading, setOraclePriceLoading] = useState<boolean>(false);
    // useEffect(() => {
    //     const fetchTokenData = async (_tokenAddress: string) => {
    //         try {
    //             setOraclePriceLoading(true);
    //             const response = await axiosInstance.get(`/general/ze/token-data/${_tokenAddress}`);

    //             setOraclePrice(response?.data?.market_data?.price);
    //             console.log(response?.data);
    //             setOraclePriceLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching token data:", error);
    //             setOraclePriceLoading(false);
    //         }
    //     };

    //     if (tokenAddress) {
    //         fetchTokenData(tokenAddress);
    //     }
    // }, [tokenAddress, smartAccountAddress]);

    // useEffect(() => {
    //     getBalance();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []); // Run only when the token prop changes

    return (
        <li className="py-2">
            <button
                onClick={() => {
                    onItemClick(isErc20 ? token.symbol : token.name);
                    {
                        handleSelectedTokenAddress && handleSelectedTokenAddress(tokenAddress);
                    }
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
            >
                <div className="flex items-center w-full justify-between">
                    <div className="inline-flex items-center">
                        {isErc20 && (
                            <Image
                                src={token.logoURI.includes("s2.coinmarketcap.com") ? optimism : token.logoURI}
                                alt={`${tokenName}-logo`}
                                width={10}
                                height={10}
                                className="w-8 h-8 mr-2"
                            />
                        )}
                        <span>{tokenName}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-gray-500">
                        {/* {!isLoading ? (
                            parseFloat(oraclePrice) > 0 ? (
                                <span>
                                    {tokenBal} {tokenName}
                                </span>
                            ) : null
                        ) : (
                            <span>Loading...</span>
                        )} */}
                        {oraclePriceLoading ? (
                            <div className="bg-gray-200 h-4 w-16 animate-pulse rounded-md"></div>
                        ) : (
                            <p>{oraclePrice > 0 && oraclePrice?.toFixed(5)}</p>
                        )}
                    </div>
                </div>
            </button>
        </li>
    );
};

export default Token;
