import { useRef, useEffect, useLayoutEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { FiCopy } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { usePathname } from "next/navigation";
import { useAddress, useUser, useChainId, useChain } from "@thirdweb-dev/react";

import { tHeader } from "./types";
import { copyToClipboard } from "../../utils/helper";
import { logoDark, metamask, wallet } from "../../assets/images";
import useClickOutside from "../../hooks/useClickOutside";
import { ChainIdDetails, NETWORK_LIST } from "../../utils/data/network";
import { NavigationList } from "../../utils/data/navigation";
import TransferContainer from "../transfer/TransferContainer";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import SelectNetwork from "../../components/SelectNetwork/SelectNetwork";
import { ConnectWallet } from "@thirdweb-dev/react";
import toast from "react-hot-toast";

const Header: React.FC<any> = ({ switchOnSpecificChain }: tHeader) => {
    const pathname = usePathname();

    const {
        connected,
        loading,
        smartAccount,
        smartAccountAddress,
        scwBalance,
        eoaBalance,
        showWalletAddress,
        setShowWalletAddress,
        showTransferFundToggle,
        setShowTransferFundToggle,
        selectedNetwork,
    }: iGlobal = useGlobalStore((state) => state);

    const address: any = useAddress();
    const chainId = useChainId();
    const chain = useChain();

    const walletAddressRef = useRef(null);
    const transferModuleRef = useRef(null);
    const selectNetworkRef = useRef(null);

    useClickOutside([walletAddressRef], () => {
        setShowWalletAddress(false);
    });

    useClickOutside([transferModuleRef], () => {
        setShowTransferFundToggle(false);
    });

      const handleSelectNetwork = (data: any) => {
        if (data.chainName) {
            switchOnSpecificChain(data.chainName);
        }
    };

    useEffect(() => {
        if (chainId) {
            if (chain?.slug == "polygon" || chain?.slug == "base" || chain?.slug == "optimism") {
                switchOnSpecificChain(chain?.slug);
            } else {
                toast.error("Only Base, Optimism and Polygon supported.")
            }
        }
    }, [chainId]);

    return (
        <>
            <div className="header-container w-full h-[69px]">
                <ul className="w-full h-full flex justify-between items-center gap-3 bg-backgound-100 p-2 shadow-md shadow-secondary-500">
                    <li className="w-full xl:w-1/3 flex justify-start items-center">
                        <Link
                            href="https://defilens.tech"
                            className="text-[30px] font-bold flex flex-row justify-center items-center hover:bg-transparent"
                        >
                            <Image
                                src={logoDark}
                                alt="defiLens"
                                className="w-48 py-2 px-3"
                            />
                        </Link>
                    </li>
                    <li className="hidden md:flex justify-center items-center gap-3 text-lg bg-backgound-300 rounded-full p-1">
                        {NavigationList.length > 0 &&
                            NavigationList?.map((item) => (
                                <Link
                                    href={item.route}
                                    key={item.title}
                                    className={`cursor-pointer px-5 py-1 text-sm md:text-base text-center rounded-full hover:bg-backgound-100 transition duration-300 ${pathname === item.route ? "bg-backgound-100" : ""
                                        } `}
                                >
                                    {item.title}
                                </Link>
                            ))
                        }
                    </li>
                    <li className="w-full h-full xl:w-1/3 flex flex-wrap justify-end items-center gap-3 overflow-auto">
                        <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                            <div className="relative flex justify-center items-center gap-1 bg-backgound-600 rounded-full font-medium transition duration-300 overflow-hidden">
                                <span className="flex justify-center items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="transfer-fund-toggle"
                                        checked={showTransferFundToggle}
                                        className="absolute hidden"
                                        onChange={(e: any) => setShowTransferFundToggle(e.target.checked)}
                                    />
                                    <label
                                        htmlFor="transfer-fund-toggle"
                                        className="transfer-fund-icon flex justify-center items-center gap-1 bg-backgound-600 hover:bg-backgound-700 active:bg-backgound-600 px-3 cursor-pointer"
                                    >
                                        <span className="font-bold text-font-100 pl-2">
                                            Transfer Fund
                                        </span>
                                        <Image
                                            src={wallet}
                                            alt="close"
                                            className="h-10 w-10 p-1.5 rounded-lg"
                                        />
                                    </label>
                                </span>
                            </div>

                            <div
                                ref={transferModuleRef}
                                className={`absolute w-full h-[calc(100%-69px)] top-[69px] z-40 ${showTransferFundToggle
                                    ? "!right-0 !transition !duration-1000 !ease-out"
                                    : "!hidden !transition !duration-700 !ease-out"
                                    } `}
                            >
                                <TransferContainer />
                            </div>
                        </div>

                        {connected && !smartAccount && !loading && (
                            <button
                                className="bg-button-100 py-2 px-5 rounded-lg text-font-100 font-medium border-b-4 transition duration-300 border-button-300 hover:border-button-400 flex justify-center items-center gap-2"
                            //   onClick={handleConnect}
                            >
                                <svg
                                    className="h-4 w-4 text-font-100"
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
                            <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                                <button
                                    type="button"
                                    onClick={() => setShowWalletAddress(!showWalletAddress)}
                                    className="relative wallet-container flex justify-center items-center gap-5 bg-backgound-600 p-2 rounded-3xl text-font-100 font-medium transition duration-300"
                                >
                                    <CgSpinner className="animate-spin h-6 w-6" />
                                </button>
                            </div>
                        )}
                        <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                            <div
                                className="flex justify-center items-center gap-3"
                            >
                                {smartAccount && !loading && (

                                    <button
                                        type="button"
                                        onClick={() => setShowWalletAddress(!showWalletAddress)}
                                        className="relative wallet-container bg-backgound-600 px-3 py-2.5 rounded-3xl flex justify-center items-center gap-3 text-font-100 font-medium transition duration-300"
                                    >

                                        <span className="text-sm font-medium">
                                            {smartAccount &&
                                                smartAccountAddress.slice(0, 5) + "..." + smartAccountAddress.slice(-3)}
                                        </span>
                                        <span className="flex justify-center items-center gap-2">
                                            <FiCopy
                                                className="text-font-100 hover:text-font-200 active:text-font-400"
                                                onClick={() =>
                                                    copyToClipboard(smartAccountAddress, "Smart account address Copied")
                                                }
                                            />
                                        </span>
                                    </button>
                                )}

                                <ConnectWallet
                                    theme={"dark"}
                                    modalSize={"wide"}
                                    btnTitle="Login"
                                    className="bg-slate-800 h-[30px]"
                                    hideTestnetFaucet={true}
                                    detailsBtn={() => {
                                        return (
                                            <Image
                                                src={metamask}
                                                alt="close"
                                                className="h-7 w-7 p-1 bg-font-100 rounded-full cursor-pointer"
                                            />
                                        )
                                    }}
                                />
                            </div>

                            {showWalletAddress && smartAccount && !loading && (
                                <div
                                    ref={walletAddressRef}
                                    className="w-80 absolute top-16 right-28 z-50 flex flex-col justify-center items-start gap-4 bg-backgound-600 border-2 border-backgound-500 shadow-md shadow-backgound-100 p-3 rounded-lg"
                                >
                                    <button className="w-full relative flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-font-100 text-base font-medium">
                                                {smartAccount &&
                                                    smartAccountAddress.slice(0, 13) +
                                                    "..." +
                                                    smartAccountAddress.slice(-3)}
                                            </span>
                                            <span className="text-font-300 text-xs">
                                                {smartAccount &&
                                                    "SmartAccount : (" +
                                                    scwBalance +
                                                    " " +
                                                    `${ChainIdDetails[selectedNetwork.chainId.toString()]
                                                        ?.gasFeesName
                                                    }` +
                                                    ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() =>
                                                copyToClipboard(smartAccountAddress, "Smart account address Copied")
                                            }
                                        />
                                    </button>
                                    <button className="w-full flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-font-100 text-base font-medium">
                                                {smartAccount &&
                                                    address &&
                                                    address.slice(0, 13) + "..." + address.slice(-3)}
                                            </span>
                                            <span className="text-font-300 text-xs">
                                                {smartAccount &&
                                                    "EOA : (" +
                                                    eoaBalance +
                                                    " " +
                                                    `${ChainIdDetails[selectedNetwork.chainId.toString()]
                                                        ?.gasFeesName
                                                    }` +
                                                    ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() => copyToClipboard(address, "EOA address Copied")}
                                        />
                                    </button>
                                </div>
                            )}

                        </div>

                        <SelectNetwork switchOnSpecificChain={switchOnSpecificChain} />

                    </li>
                </ul>
            </div>
            {chainId &&
                <>
                    {chain?.slug == "polygon" || chain?.slug == "base" || chain?.slug == "optimism" ? <></>
                        :
                        <>
                            <div
                                className="fixed z-[110] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-backgound-600 border-2 border-backgound-500 shadow-md shadow-backgound-100 p-3 rounded-lg transition duration-300"
                                style={{ minWidth: '20%', minHeight: '20%' }}
                            >
                                <div className="relative z-[112] w-full flex flex-col justify-center items-center gap-3">
                                    <div className="w-full flex flex-col text-start mb-4">
                                        <h3 className="font-semibold text-lg md:text-2xl text-font-100">Switch Network</h3>
                                        <p className="text-xs md:text-base text-gray-500">Only following networks are supported</p>
                                    </div>
                                    <div
                                        ref={selectNetworkRef}
                                        className="w-full flex flex-col gap-1 p-3 rounded-xl bg-backgound-300"
                                    >
                                        {NETWORK_LIST?.map((item) => {
                                            return (
                                                <div
                                                    key={item.chainName}
                                                    onClick={() => handleSelectNetwork(item)}
                                                    className="flex justify-start items-center gap-3 hover:bg-backgound-100 p-2 rounded-full cursor-pointer"
                                                >
                                                    <Image src={item.icon} alt="logo" className="h-10 w-10 rounded-full" />
                                                    <div className="text-sm md:text-base text-font-100">{item.key}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="absolute z-[111] inset-0 m-auto max-w-xs h-[600] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 25.73%, rgba(14, 165, 233, 0.41) 25.74%, rgba(232, 121, 249, 0.26) 66.49%, rgba(79, 70, 229, 0.4) 125.91%)" }}></div>
                            </div>
                            <div className="fixed top-0 left-0 z-[100] w-screen h-screen bg-[rgba(0,0,0)]  transition duration-300"></div>
                        </>
                    }
                </>
            }
        </>
    );
};
export default Header;
