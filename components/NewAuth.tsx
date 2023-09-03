import { useContext } from "react";
import { useState, useRef, useEffect } from "react";

import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { FiCopy } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { FaChevronDown } from "react-icons/fa";
import { IBundler, Bundler } from "@biconomy/bundler";
import { TbSquareRoundedChevronDownFilled } from "react-icons/tb";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { DEFAULT_ENTRYPOINT_ADDRESS, BiconomySmartAccountConfig, BiconomySmartAccount } from "@biconomy/account";
import {
    useSwitchChain,
    useSigner,
    useNetworkMismatch,
    useConnect,
    useChain,
    useAddress,
    metamaskWallet,
} from "@thirdweb-dev/react";

import { useAppStore } from "../store/appStore";
import ChainContext from "../Context/ChainContext";
import { useCalculatebalance } from "../hooks/useCalculateBalance";
import { rpscURLS, paymasterURLs, gasFeesNames, buttonStyle, bundlerURLs } from "../utils/constants";

bg.config({ DECIMAL_PLACES: 5 });

export default function Home() {
    const {
        setSmartAccount,
        smartAccount,
        setCurrentProvider,
        scwBalance,
        eoaBalance,
        loading,
        setLoading,
        connected,
        setConnected,
        showWalletAddress,
        setShowWalletAddress,
    }: any = useAppStore((state) => state);
    const { selectedChain, setSelectedChain, selectedChainId, setSelectedChainId } = useContext(ChainContext);
    const { mutateAsync: fetchNativeBalance } = useCalculatebalance();
    const [interval, enableInterval] = useState(false);
    const sdkRef = useRef<SocialLogin | null>(null);
    const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
    const switchChain = useSwitchChain();
    const metamaskConfig = metamaskWallet();
    const connect = useConnect();
    const address: any = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const chain = useChain();
    const [isWrongNetwork, setisWrongNetwork] = useState(false);
    const chainIds = [137, 42161, 43114, 1, 10, 8453];

    useEffect(() => {
        // alert("Hello")
        async function changeWallet() {
            if (address && smartAccount && chain) {
                if (smartAccount.owner == address) return;
                console.log("address1", selectedChainId, selectedChain, chain);
                const _smartAccount = await login(chain?.chainId);
                console.log("_smartAccount_", _smartAccount);
                // @ts-ignore
                await isNetworkCorrect(chain?.chainId, _smartAccount.address);
                setSelectedChain?.(chain.slug);
                setSelectedChainId?.(chain?.chainId.toString());
            } else {
                console.log("address2");
            }
        }
        changeWallet();
    }, [address]);

    async function createAccount(chainId) {
        const bundler: IBundler = new Bundler({
            bundlerUrl: bundlerURLs[chainId],
            chainId: chainId,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        });
        const paymaster: IPaymaster = new BiconomyPaymaster({
            paymasterUrl: paymasterURLs[chainId],
        });
        const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
            signer: signer,
            chainId: chainId,
            bundler: bundler,
            paymaster: paymaster,
        };
        let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
        biconomySmartAccount = await biconomySmartAccount.init();
        return biconomySmartAccount;
    }

    useEffect(() => {
        if (smartAccount) isNetworkCorrect(chain?.chainId, smartAccount.address);
    }, []);

    const isNetworkCorrect = async (chainId: any, smartAccountAddress) => {
        try {
            const chainIds = [137, 42161, 10, 1, 43114, 8453];
            console.log("1");
            if (chainIds.includes(chainId)) {
                console.log("2", smartAccount?.address);
                setisWrongNetwork(false);
                await fetchNativeBalance({ chainId: chainId, eoaAddress: address, scwAddress: smartAccountAddress });
                console.log("2.1");
            } else {
                console.log("3");
                setisWrongNetwork(true);
            }
        } catch (error) {
            console.log("isNetworkCorrect-error: ", error);
        }
    };

    async function login(chainId) {
        if (!chainId) throw "No ChainId";
        // if (!sdkRef.current) {
        //     const socialLoginSDK = new SocialLogin();
        //     // const signature1 = await socialLoginSDK.whitelistUrl(
        //     //   "http://localhost:3000/"
        //     // );
        //     await socialLoginSDK.init({
        //         chainId: ethers.utils.hexValue(chainId),
        //         // whitelistUrls: {
        //         //   "http://localhost:3000/": signature1,
        //         // },
        //     });
        //     sdkRef.current = socialLoginSDK;
        // }
        // if (!sdkRef.current.provider) {
        //     // sdkRef.current.showConnectModal()
        //     sdkRef.current.showWallet();
        //     enableInterval(true);
        // } else {
        console.log("Hello");
        return setupSmartAccount(chainId);
        // }
    }

    async function setupSmartAccount(chainId) {
        // if (!sdkRef?.current?.provider) return;
        // sdkRef.current.hideWallet();
        console.log("Hello2");

        setLoading(true);
        // const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider);
        try {
            const smartAccount = await createAccount(chainId);
            console.log("smartAccount", smartAccount);
            setSmartAccount(smartAccount);
            setLoading(false);
            setCurrentProvider("Biconomy");
            return smartAccount;
        } catch (err) {
            setLoading(false);
            console.log("error setting up smart account... ", err);
        }
    }

    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Wallet address Copied");
    };

    const switchOnSpecificChain = async (chainName) => {
        try {
            setLoading(true);
            setSmartAccount(null);
            enableInterval(false);
            // setSelectedChain?.(chainName)
            await changeChain(chainName);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("switchToChain-error: ", error);
        }
    };

    async function changeChain(chainName) {
        try {
            await handleConnect();
            if (chain?.slug != chainName) {
                // await logout()
                if (chainName == "polygon") {
                    await switchChain(137);
                    const _smartAccount = await login(137);
                    // @ts-ignore
                    await isNetworkCorrect(137, _smartAccount.address);
                    setSelectedChain?.(chainName);
                    setSelectedChainId?.("137");
                } else if (chainName == "arbitrum") {
                    await switchChain?.(42161);
                    const _smartAccount = await login(42161);
                    // @ts-ignore
                    await isNetworkCorrect(42161, _smartAccount.address);
                    setSelectedChain?.(chainName);
                    setSelectedChainId?.("42161");
                } else if (chainName == "avalanche") {
                    await switchChain(43114);
                    const _smartAccount = await login(43114);
                    // @ts-ignore
                    await isNetworkCorrect(43114, _smartAccount.address);
                    setSelectedChain?.(chainName);
                    setSelectedChainId?.("43114");
                } else if (chainName == "optimism") {
                    await switchChain?.(10);
                    const _smartAccount = await login(10);
                    // @ts-ignore
                    await isNetworkCorrect(10, _smartAccount.address);
                    setSelectedChain?.(chainName);
                    setSelectedChainId?.("10");
                } else if (chainName == "ethereum") {
                    await switchChain(1);
                    const _smartAccount = await login(1);
                    // @ts-ignore
                    await isNetworkCorrect(1, _smartAccount.address);
                    setSelectedChain?.(chainName);
                    setSelectedChainId?.("1");
                } else if (chainName == "base") {
                    await switchChain?.(8453);
                    const _smartAccount = await login(8453);
                    // @ts-ignore
                    await isNetworkCorrect(8453, _smartAccount.address);
                    setSelectedChain?.(chainName);
                    setSelectedChainId?.("8453");
                }
            } else {
                if (chain) {
                    const _smartAccount = await login(chain?.chainId);
                    setSelectedChain?.(chain?.slug);
                    setSelectedChainId?.(chain?.chainId.toString());
                    // @ts-ignore
                    await isNetworkCorrect(chain?.chainId, _smartAccount.address);
                }
            }
        } catch (error: any) {
            console.log("changeChain-error", error);
        }
    }

    const handleConnect = async () => {
        connect(metamaskConfig, {})
            .then(() => {
                setConnected(true);
            })
            .catch(setConnected(false));
        // if (chain?.chainId) {
        //   await login(chain?.chainId);
        // }
    };

    return (
        <div className="auth-container">
            <ul className="flex justify-between items-center gap-2 bg-primary-950 p-2 shadow-md shadow-secondary-500">
                <li>
                    <div className="text-[30px] font-bold flex flex-row justify-center items-center">
                        <div className="mr-2 p-1">
                            <svg
                                width="45px"
                                height="45px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall mui-style-8tazii"
                                focusable="false"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.71542 1.06718C7.89457 0.977606 8.10543 0.977606 8.28458 1.06718L14.6481 4.249C14.8637 4.3568 14.9999 4.57714 14.9999 4.81818C14.9999 5.05922 14.8637 5.27957 14.6481 5.38736L8.28458 8.56918C8.10543 8.65876 7.89457 8.65876 7.71542 8.56918L1.35191 5.38736C1.13632 5.27957 1.00014 5.05922 1.00014 4.81818C1.00014 4.57714 1.13632 4.3568 1.35191 4.249L7.71542 1.06718ZM3.05941 4.81818L8 7.28852L12.9406 4.81818L8 2.34784L3.05941 4.81818ZM1.06732 7.71541C1.22449 7.40106 1.60673 7.27364 1.92108 7.43082L8 10.4703L14.0789 7.43082C14.3933 7.27364 14.7755 7.40106 14.9327 7.71541C15.0899 8.02976 14.9624 8.41201 14.6481 8.56918L8.28458 11.751C8.10543 11.8406 7.89457 11.8406 7.71542 11.751L1.35191 8.56918C1.03756 8.41201 0.910149 8.02976 1.06732 7.71541ZM1.06732 10.8972C1.22449 10.5829 1.60673 10.4555 1.92108 10.6126L8 13.6522L14.0789 10.6126C14.3933 10.4555 14.7755 10.5829 14.9327 10.8972C15.0899 11.2116 14.9624 11.5938 14.6481 11.751L8.28458 14.9328C8.10543 15.0224 7.89457 15.0224 7.71542 14.9328L1.35191 11.751C1.03756 11.5938 0.910149 11.2116 1.06732 10.8972Z"
                                    fill="white"
                                    stroke="white"
                                    stroke-width="0.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></path>
                            </svg>
                        </div>
                        <div className="text-white">DefiLens</div>
                    </div>
                    {/* <a href="#" className="font-bold text-2xl hover:bg-transparent">
                        DefiLens(Formerly ChainPing)
                    </a> */}
                    {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall mui-style-8tazii" focusable="false" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.71542 1.06718C7.89457 0.977606 8.10543 0.977606 8.28458 1.06718L14.6481 4.249C14.8637 4.3568 14.9999 4.57714 14.9999 4.81818C14.9999 5.05922 14.8637 5.27957 14.6481 5.38736L8.28458 8.56918C8.10543 8.65876 7.89457 8.65876 7.71542 8.56918L1.35191 5.38736C1.13632 5.27957 1.00014 5.05922 1.00014 4.81818C1.00014 4.57714 1.13632 4.3568 1.35191 4.249L7.71542 1.06718ZM3.05941 4.81818L8 7.28852L12.9406 4.81818L8 2.34784L3.05941 4.81818ZM1.06732 7.71541C1.22449 7.40106 1.60673 7.27364 1.92108 7.43082L8 10.4703L14.0789 7.43082C14.3933 7.27364 14.7755 7.40106 14.9327 7.71541C15.0899 8.02976 14.9624 8.41201 14.6481 8.56918L8.28458 11.751C8.10543 11.8406 7.89457 11.8406 7.71542 11.751L1.35191 8.56918C1.03756 8.41201 0.910149 8.02976 1.06732 7.71541ZM1.06732 10.8972C1.22449 10.5829 1.60673 10.4555 1.92108 10.6126L8 13.6522L14.0789 10.6126C14.3933 10.4555 14.7755 10.5829 14.9327 10.8972C15.0899 11.2116 14.9624 11.5938 14.6481 11.751L8.28458 14.9328C8.10543 15.0224 7.89457 15.0224 7.71542 14.9328L1.35191 11.751C1.03756 11.5938 0.910149 11.2116 1.06732 10.8972Z" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> */}
                </li>
                <li className="flex flex-wrap justify-end items-center gap-2">
                    {!smartAccount && !loading && !connected && (
                        <button
                            className={`${buttonStyle} flex justify-center items-center gap-2`}
                            onClick={handleConnect}
                        >
                            <svg
                                className="h-4 w-4 text-light"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />{" "}
                                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
                            </svg>
                            Connect
                        </button>
                    )}
                    {connected && !smartAccount && !loading && (
                        <button
                            className={`${buttonStyle} flex justify-center items-center gap-2`}
                            //   onClick={handleConnect}
                        >
                            <svg
                                className="h-4 w-4 text-light"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />{" "}
                                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
                            </svg>
                            Connected To Metamask
                        </button>
                    )}
                    {loading && (
                        <button className={`${buttonStyle} flex justify-center items-center gap-2`}>
                            <ImSpinner className="animate-spin h-5 w-5" />
                            Loading account details...
                        </button>
                    )}
                    {smartAccount && !loading && (
                        <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                            <button className="relative wallet-container flex justify-center items-center gap-5 bg-primary-600 py-2 px-5 rounded-lg text-primary-100 font-medium  border-b-4 border-primary-900 transition duration-300">
                                <span className="text-sm font-medium">
                                    {smartAccount &&
                                        smartAccount.address.slice(0, 5) + "..." + smartAccount.address.slice(-3)}
                                </span>
                                <span className="flex justify-center items-center gap-2">
                                    <FiCopy
                                        className="text-white hover:text-gray-300 active:text-gray-500"
                                        onClick={() => copyToClipboard(smartAccount.address)}
                                    />
                                    <input
                                        type="checkbox"
                                        id="dropdown-toggle"
                                        checked={showWalletAddress}
                                        onChange={(e: any) => setShowWalletAddress(e.target.checked)}
                                    />
                                    <label htmlFor="dropdown-toggle" className="drop-down">
                                        <FaChevronDown className="arrow cursor-pointer" />
                                    </label>
                                </span>
                            </button>

                            {showWalletAddress && smartAccount && !loading && (
                                <div className="w-80 absolute top-16 z-50 flex flex-col justify-center items-start gap-4 bg-gray-800 border-2 border-gray-700 shadow-md shadow-gray-500 p-3 rounded-lg">
                                    <button className="w-full relative flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-white text-base font-medium">
                                                {smartAccount &&
                                                    smartAccount.address.slice(0, 13) +
                                                        "..." +
                                                        smartAccount.address.slice(-3)}
                                            </span>
                                            <span className="text-gray-300 text-xs">
                                                {smartAccount &&
                                                    "SCW : (" +
                                                        scwBalance +
                                                        " " +
                                                        `${gasFeesNames[selectedChain]}` +
                                                        ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-white active:text-gray-400 p-2 hover:bg-slate-600 rounded-md"
                                            onClick={() => copyToClipboard(smartAccount.address)}
                                        />
                                    </button>
                                    <button className="w-full flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-white text-base font-medium">
                                                {smartAccount && address.slice(0, 13) + "..." + address.slice(-3)}
                                            </span>
                                            <span className="text-gray-300 text-xs">
                                                {smartAccount &&
                                                    "EOA : (" +
                                                        eoaBalance +
                                                        " " +
                                                        `${gasFeesNames[selectedChain]}` +
                                                        ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-white active:text-gray-400 p-2 hover:bg-slate-600 rounded-md"
                                            onClick={() => copyToClipboard(address)}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="relative border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md">
                        <label htmlFor="fromNetwork" className="sr-only">
                            Connect Network
                        </label>
                        <select
                            id="fromNetwork"
                            name="networks"
                            className="w-44 appearance-none py-1 px-3 bg-white rounded-md"
                            value={String(selectedChain)}
                            onChange={(e) => switchOnSpecificChain(e.target.value)}
                        >
                            <option value="" disabled selected={selectedChain == "" || !selectedChain ? true : false}>
                                Selece Network
                            </option>
                            <option
                                value="polygon"
                                disabled={selectedChain == "polygon" ? true : false}
                                selected={selectedChain == "polygon" ? true : false}
                            >
                                Polygon
                            </option>
                            <option
                                value="arbitrum"
                                disabled={selectedChain == "arbitrum" ? true : false}
                                selected={selectedChain == "arbitrum" ? true : false}
                            >
                                Arbitrum
                            </option>
                            <option
                                value="avalanche"
                                disabled={selectedChain == "avalanche" ? true : false}
                                selected={selectedChain == "avalanche" ? true : false}
                            >
                                Avalanche
                            </option>
                            <option
                                value="optimism"
                                disabled={selectedChain == "optimism" ? true : false}
                                selected={selectedChain == "optimism" ? true : false}
                            >
                                Optimism
                            </option>
                            <option
                                value="ethereum"
                                disabled={selectedChain == "ethereum" ? true : false}
                                selected={selectedChain == "ethereum" ? true : false}
                            >
                                Ethereum
                            </option>
                            <option
                                value="base"
                                disabled={selectedChain == "base" ? true : false}
                                selected={selectedChain == "base" ? true : false}
                            >
                                Base
                            </option>
                        </select>
                        <div className="absolute right-0 top-0 bottom-0 pointer-events-none flex items-center px-1">
                            <TbSquareRoundedChevronDownFilled size="25px" />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}
