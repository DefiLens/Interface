// Library Imports
import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { usePathname } from "next/navigation";
import { useAddress, useChainId, useChain, useWallet } from "@thirdweb-dev/react";
// Type, Store, Components, Helper Imports
import { tHeader } from "./types";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import useClickOutside from "../../hooks/useClickOutside";
import { ChainIdDetails, NETWORK_LIST, SUPPORTED_NETWORKS } from "../../utils/data/network";
import { NavigationList } from "../../utils/data/navigation";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import toast from "react-hot-toast";
import CopyButton from "../../components/common/CopyButton";
import ConnectWalletWrapper from "../../components/Button/ConnectWalletWrapper";
import { cn } from "../../lib/utils";
import { logoLight } from "../../assets/images";

const Header: React.FC<tHeader> = ({ switchOnSpecificChain }) => {
    const pathname = usePathname();
    useEffect(() => console.log("path", pathname), [pathname]);

    const {
        loading,
        smartAccount,
        smartAccountAddress,
        scwBalance,
        eoaBalance,
        showWalletAddress,
        setShowWalletAddress,
        selectedNetwork,
        setConnectedWallet,
    }: iGlobal = useGlobalStore((state) => state);

    const address = useAddress();
    const chainId = useChainId();
    const chain = useChain();
    const wallet = useWallet();

    const walletAddressRef = useRef(null);
    const selectNetworkRef = useRef(null);

    // set connected wallet's instance globally
    useEffect(() => {
        if (wallet) {
            setConnectedWallet(wallet);
        }
    }, [wallet]);

    // To close copy dropdown
    useClickOutside([walletAddressRef], () => {
        setShowWalletAddress(false);
    });

    // To Set network
    const handleSelectNetwork = (data: { key: string; chainName: string; chainId: string; icon: any }) => {
        if (data.chainName) {
            switchOnSpecificChain(data.chainName);
        }
    };

    // To Check user remain on supported chains
    useEffect(() => {
        if (chainId) {
            if (chain?.slug && SUPPORTED_NETWORKS.includes(chain.slug)) {
                switchOnSpecificChain(chain.slug);
            } else {
                toast.error("Only Polygon, Optimism, Arbitrum, and Base supported.");
            }
        }
    }, [chainId]);

    return (
        <>
            <header className="w-full fixed top-0 left-0 right-0 md:top-3 z-50">
                <div className="max-w-[1380px] w-full md:w-[94%] mx-auto h-[70px] placeholder:h-[70px] flex justify-between items-center gap-3 bg-N0 md:border md:rounded-full py-3 px-7">
                    {/* Left Side navigation */}
                    <div className="flex justify-between items-center gap-6">
                        {/* Logo */}
                        <Image src={logoLight} width={150} height={150} alt="defilens logo" />
                        {/* Navigation Links */}
                        <div className="inline-flex items-center gap-4">
                            {NavigationList.length > 0 &&
                                NavigationList?.map((item, index: number) => (
                                    <Link
                                        href={item.route}
                                        key={index}
                                        className="lg:flex hidden flex-row transition-colors duration-200 rounded-full justify-between items-center gap-1 text-black text-lg"
                                    >
                                        <span
                                            className={cn(
                                                "p-2 rounded-full",
                                                pathname == item.route && "bg-purple-100"
                                            )}
                                        >
                                            {item.icon && (
                                                <Image src={item.icon} width={20} height={20} alt={item.title} />
                                            )}
                                        </span>
                                        <span
                                            className={cn(
                                                "text-base text-font-700 font-bold",
                                                pathname == item.route && "text-font-1000"
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </Link>
                                ))}
                        </div>
                    </div>
                    {/* CTA Buttons */}
                    <div className="flex justify-between items-center gap-3">
                        {/* Link: "/transfer-fund" */}
                        <Link
                            href="/transfer-fund"
                            className={cn(
                                "flex h-full items-center justify-center gap-2 cursor-pointer px-5 py-3 text-sm md:text-base text-center rounded-full bg-N0 shadow-sm hover:bg-N20 border border-N40 transition duration-300",
                                pathname === "/transfer-fund"
                                    ? "bg-gradient-to-br from-D600 via-D400 to-D100 text-N0"
                                    : "text-green-800 bg-green-100"
                            )}
                        >
                            <span className="font-bold pl-2">Transfer Fund</span>
                            <HiArrowPathRoundedSquare className="h-5 w-5" />
                            {/* <Image
                                src={pathname === "/transfer-fund" ? wallet : mirgrate_asset}
                                alt="close"
                                className="h-10 w-10 p-1.5 rounded-lg"
                            /> */}
                        </Link>

                        {/* Loading spinner */}
                        {loading && (
                            <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                                <button
                                    onClick={() => setShowWalletAddress(!showWalletAddress)}
                                    className="relative wallet-container flex justify-center items-center gap-5 bg-backgound-600 p-2 rounded-3xl text-font-100 font-medium transition duration-300"
                                >
                                    <CgSpinner className="animate-spin h-6 w-6" />
                                </button>
                            </div>
                        )}

                        {/* Account Addreses */}
                        <div className="flex flex-wrap justify-center items-center gap-3 text-base">
                            {smartAccount && !loading && (
                                <button
                                    onClick={() => setShowWalletAddress(!showWalletAddress)}
                                    ref={walletAddressRef}
                                    className="relative flex justify-center items-center gap-3 wallet-container bg-N0 border border-N40 px-5 py-1 rounded-xl text-B100 shadow-sm font-medium transition duration-300 hover:bg-N20 cursor-pointer"
                                >
                                    {/* Smart account address and copy btn */}
                                    <span className="text-sm font-medium">
                                        {smartAccount &&
                                            smartAccountAddress.slice(0, 5) + "..." + smartAccountAddress.slice(-3)}
                                    </span>
                                    <CopyButton copy={smartAccountAddress} />

                                    {/* Drop down see both addresses */}
                                    {showWalletAddress && (
                                        <div className="w-80 absolute top-16 right-0 z-50 flex flex-col justify-center items-start bg-N0 border-1 border-B75 shadow-xl p-3 rounded-lg">
                                            {/* SCW Address and Balance */}
                                            <div className="w-full relative flex justify-between p-2 items-center gap-2 cursor-default">
                                                <div className="flex flex-col justify-center items-start">
                                                    <span className="text-B200 text-base font-medium">
                                                        {smartAccount &&
                                                            smartAccountAddress.slice(0, 13) +
                                                                "..." +
                                                                smartAccountAddress.slice(-3)}
                                                    </span>
                                                    <span className="text-B100 text-xs">
                                                        {smartAccount &&
                                                            "SmartAccount : (" +
                                                                scwBalance +
                                                                " " +
                                                                `${
                                                                    ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                        ?.gasFeesName
                                                                }` +
                                                                ")"}
                                                    </span>
                                                </div>
                                                <CopyButton copy={smartAccountAddress} />
                                            </div>
                                            {/* EOA Address and Balance */}
                                            <div className="w-full flex justify-between items-center gap-2 p-2 cursor-default">
                                                <div className="flex flex-col justify-center items-start">
                                                    <span className="text-B200 text-base font-medium">
                                                        {smartAccount &&
                                                            address &&
                                                            address.slice(0, 13) + "..." + address.slice(-3)}
                                                    </span>
                                                    <span className="text-B100 text-xs">
                                                        {smartAccount &&
                                                            "EOA : (" +
                                                                eoaBalance +
                                                                " " +
                                                                `${
                                                                    ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                        ?.gasFeesName
                                                                }` +
                                                                ")"}
                                                    </span>
                                                </div>
                                                <CopyButton copy={address} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            )}

                            {/* Third web auth btn */}
                            <ConnectWalletWrapper />
                        </div>
                    </div>
                </div>
            </header>

            {/* Network switching Modal */}
            {chainId && (
                <>
                    {chain?.slug == "polygon" ||
                    chain?.slug == "base" ||
                    chain?.slug == "optimism" ||
                    chain?.slug == "arbitrum" ? (
                        <></>
                    ) : (
                        <>
                            <div
                                className="fixed z-[110] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-N20 border-1 border-B75 shadow-lg p-3 rounded-lg transition duration-300"
                                style={{ minWidth: "20%", minHeight: "20%" }}
                            >
                                <div className="relative z-[112] w-full flex flex-col justify-center items-center gap-3">
                                    <div className="w-full flex flex-col text-start mb-4">
                                        <h3 className="font-semibold text-lg md:text-2xl text-B200">Switch Network</h3>
                                        <p className="text-xs md:text-base text-B100">
                                            Only following networks are supported
                                        </p>
                                    </div>
                                    <div
                                        ref={selectNetworkRef}
                                        className="w-full flex flex-col gap-1 p-3 rounded-xl bg-N0 border-1 border-B75"
                                    >
                                        {NETWORK_LIST?.map((item) => {
                                            return (
                                                <div
                                                    key={item.chainName}
                                                    onClick={() => handleSelectNetwork(item)}
                                                    className="flex justify-start items-center gap-3 hover:bg-N40 p-2 rounded-full cursor-pointer"
                                                >
                                                    <Image
                                                        src={item.icon}
                                                        alt="logo"
                                                        className="h-10 w-10 rounded-full"
                                                    />
                                                    <div className="text-sm md:text-base text-B100">{item.key}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div
                                    className="absolute z-[111] inset-0 m-auto max-w-xs h-[600] blur-[118px] sm:max-w-md md:max-w-lg"
                                    style={{
                                        background:
                                            "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 25.73%, rgba(14, 165, 233, 0.41) 25.74%, rgba(232, 121, 249, 0.26) 66.49%, rgba(79, 70, 229, 0.4) 125.91%)",
                                    }}
                                ></div>
                            </div>
                            <div className="fixed top-0 left-0 z-[100] w-screen h-screen bg-[rgba(0,0,0,0.7)] transition duration-300"></div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Header;
