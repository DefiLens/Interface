import { iTrading, useTradingStore } from "../../store/TradingStore";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { optimism } from "../../assets/images";
// import { useGlobalStore } from "../../store/GlobalStore";
import { decreasePowerByDecimals } from "../../utils/helper";
import axiosInstance from "../../axiosInstance/axiosInstance";
import { nativeTokenFetcher, nativeTokenNum } from "../../utils/data/protocols";

interface PropTypes {
    network: any;
    isErc20?: boolean;
    token: any;
    onItemClick: (tokenName: string) => void;
    tokenAddresses?: { [key: string]: string };
    handleSelectedTokenAddress?: (tokenAddress: string) => void;
    protocolName: string;
}

const Token: React.FC<PropTypes> = ({
    network,
    isErc20,
    token,
    onItemClick,
    tokenAddresses,
    handleSelectedTokenAddress,
    protocolName,
}) => {
    console.log(network);
    // const { smartAccountAddress } = useGlobalStore((state) => state);
    const { balances, apy, setBalances, setApy, simulationSmartAddress}: iTrading = useTradingStore((state) => state); // Use Zustand store
    const smartAccountAddress = simulationSmartAddress;
    const tokenAddress = isErc20 ? token.address : tokenAddresses?.[token.name];
    const tokenName = isErc20 ? token.symbol : token.name;
    const chainId = network.chainId.toString();
    const nativeToken = nativeTokenFetcher[network.chainId][nativeTokenNum[network.chainId][tokenName]];

    const [tokenBalance, setTokenBalance] = useState("");
    const [fetchingBalance, setFetchingBalance] = useState(false);
    const [nativeTokenBalances, setNativeTokenBalances] = useState("");
    const [fetchingNativeBalance, setFetchingNativeBalance] = useState(false);

    useEffect(() => {
        const getTokenApy = async () => {
            if (!apy[tokenName]?.[protocolName]?.[chainId]) {
                try {
                    const response = await axiosInstance.post("/token/apy", { chainId, tokenName });
                    setApy(tokenName, protocolName, chainId, response.data);
                } catch (error) {
                    console.error("Error fetching token APY:", error);
                }
            }
        };
        // if (chainId === "137" && protocolName === "aaveV2" || protocolName === "aaveV3" || protocolName === "compoundV3") {
        if (!isErc20) {
            getTokenApy();
        }
        // }
    }, []);

    useEffect(() => {
        const fetchBalances = async () => {
            setFetchingBalance(true);
            if (!balances[tokenName]?.[protocolName]?.[chainId]) {
                try {
                    const response = await axiosInstance.get(
                        `/token/getBalance?userAddress=${smartAccountAddress}&tokenAddress=${tokenAddress}&chainId=${chainId}`
                    );

                    const balance = await decreasePowerByDecimals(response.data.balance, response.data.decimals);
                    setBalances(tokenName, protocolName, chainId, balance);
                    setTokenBalance(balance);
                } catch (error) {
                    console.error("Error fetching token balances:", error);
                } finally {
                    setFetchingBalance(false);
                }
            } else {
                setTokenBalance(balances[tokenName][protocolName][chainId]);
                setFetchingBalance(false);
            }
        };
        if (!isErc20) {
            fetchBalances();
        }
    }, []);

    useEffect(() => {
        const fetchNativeBalances = async () => {
            setFetchingNativeBalance(true);
            if (!balances[isErc20 ? token.address : nativeToken.nativeToken]?.[protocolName]?.[chainId]) {
                try {
                    const response = await axiosInstance.get(
                        `/token/getBalance?userAddress=${smartAccountAddress}&tokenAddress=${isErc20 ? token.address : nativeToken.nativeToken}&chainId=${chainId}`
                    );

                    const balance = await decreasePowerByDecimals(response.data.balance, response.data.decimals);
                    setBalances(isErc20 ? token.address : nativeToken.nativeToken, protocolName, chainId, balance);
                    setNativeTokenBalances(balance);
                } catch (error) {
                    console.error("Error fetching token balances:", error);
                } finally {
                    setFetchingNativeBalance(false);
                }
            } else {
                setNativeTokenBalances(balances[isErc20 ? token.address : nativeToken.nativeToken][protocolName][chainId]);
                setFetchingNativeBalance(false);
            }
        };
        fetchNativeBalances();
    }, []);

    return (
        <li className="">
            <div
                onClick={() => {
                    onItemClick(isErc20 ? token.symbol : token.name);
                    handleSelectedTokenAddress && handleSelectedTokenAddress(tokenAddress);
                }}
                className="cursor-pointer rounded-lg hover:bg-W200 flex items-center p-4 min-w-[30rem] transition-all duration-200"
            >
                <div className="mr-4">
                    {isErc20 &&
                        (token.logoURI ? (
                            <Image
                                src={token.logoURI.includes("s2.coinmarketcap.com") ? optimism : token.logoURI}
                                alt={`${tokenName}-logo`}
                                width={10}
                                height={10}
                                className="w-12 h-12 mr-2 rounded-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-B50 text-B100 font-bold text:xs lg:text-sm mr-2">
                                {token.name.slice(0, 2)}
                            </div>
                        ))}
                    {!isErc20 &&
                        (nativeToken?.image ? (
                            <Image
                                src={nativeToken.image}
                                alt={`${tokenName}-logo`}
                                width={10}
                                height={10}
                                className="w-14 h-14 rounded-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-B50 text-B100 font-bold text:xs lg:text-sm mr-2">
                                {token.name.slice(0, 2)}
                            </div>
                        ))}
                </div>
                <div className="flex-grow mr-10">
                    <div className="font-semibold text-lg text-B200">
                        {isErc20 ? tokenName : nativeToken?.symbol}
                        {!isErc20 && parseFloat(apy[tokenName]?.[protocolName]?.[chainId]) > 0 && (
                            <span className="ml-1 text-sm">
                                (
                                {Number(apy[tokenName][protocolName][chainId]) > 0.0001
                                    ? Number(apy[tokenName][protocolName][chainId]).toFixed(4)
                                    : Number(apy[tokenName][protocolName][chainId]).toFixed(7)}
                                %)
                            </span>
                        )}
                    </div>
                    {!fetchingBalance ? (
                        <div className="text-B200 text-sm">
                            {parseFloat(tokenBalance) > 0 ? <span>{Number(tokenBalance).toFixed(5)}</span> : null}
                            <span className="text-B200 ml-1">{token.name}</span>
                            {parseFloat(tokenBalance) > 0 && (
                                <span className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ml-2">
                                    deposited
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-200 h-4 w-16 animate-pulse rounded-md"></div>
                    )}
                </div>
                <div className="flex flex-col justify-end items-end">
                    {!fetchingNativeBalance ? (
                        parseFloat(nativeTokenBalances) > 0 ? (
                            <>
                                <div className="font-semibold">
                                    <span className="mr-1">{Number(nativeTokenBalances) > 0.001 ? Number(nativeTokenBalances).toFixed(5) : Number(nativeTokenBalances)}</span>
                                </div>
                                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    available
                                </div>
                            </>
                        ) : null
                    ) : (
                        <div className="bg-gray-200 h-4 w-16 animate-pulse rounded-md"></div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default Token;
