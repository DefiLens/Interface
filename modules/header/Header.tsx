// Library Imports
import { useRef, useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { CgSpinner } from "react-icons/cg";
import { usePathname } from "next/navigation";
import { useAddress, useChainId, useChain, useWallet } from "@thirdweb-dev/react";
import { HiBars3 } from "react-icons/hi2";
// Type, Store, Components, Helper Imports
import { tHeader } from "./types";
import useClickOutside from "../../hooks/useClickOutside";
import { ChainIdDetails, NETWORK_LIST, SUPPORTED_NETWORKS } from "../../utils/data/network";
import { NavigationList } from "../../utils/constants";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import toast from "react-hot-toast";
import CopyButton from "../../components/common/CopyButton";
import ConnectWalletWrapper from "../../components/Button/ConnectWalletWrapper";
import { cn } from "../../lib/utils";
import { logoLight, usdc } from "../../assets/images";
import { MdOutlineFileDownload } from "react-icons/md";
import { decreasePowerByDecimals } from "../../utils/helper";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";

const Header: React.FC<tHeader> = ({ switchOnSpecificChain }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

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
        isFetchingUsdc,
        setIsFetchingUsdc,
    }: iGlobal = useGlobalStore((state) => state);
 
    const { txhash: txhashTrading }: iTrading = useTradingStore((state) => state);

    const { txhash: txhashTransferFund }: iTransfer = useTransferStore((state) => state);

    const { txhash: txhashPortfolio }: iPortfolio = usePortfolioStore((state) => state);

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleSidebar = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    useEffect(() => {
        fetchBalances();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [smartAccountAddress]);

    const tokensByNetworkForCC = {
        "137": {
            usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        },
        "42161": {
            usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        },
        "10": {
            usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        },
        "8453": {
            usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
        },
    };

    const [balances, setBalances] = useState({});
    const [totalUsdcInDecimal, setTotalUsdcInDecimal] = useState<number | string>(0);

    const fetchBalances = async () => {
        const results = {};
        let total = 0;

        try {
            setIsFetchingUsdc(true);
            const fetchBalancePromises = Object.keys(tokensByNetworkForCC).map(async (chainId) => {
                const tokenAddress = tokensByNetworkForCC[chainId].usdc;
                const response = await fetch("http://localhost:8000/getBalances", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chainId,
                        tokenAddress,
                        userAddress: smartAccountAddress,
                    }),
                });

                const result = await response.json();
                results[chainId] = result;

                // Sum up the USDC balance
                total += parseFloat(result.balance);
            });

            await Promise.all(fetchBalancePromises);

            setBalances(results);

            // Calculate and set total USDC balance in decimal
            const totalDecimal = decreasePowerByDecimals(total, 6);
            setTotalUsdcInDecimal(totalDecimal);
            setIsFetchingUsdc(false);
        } catch (error) {
            console.error("Error fetching balances:", error);
            setIsFetchingUsdc(false);
        }  
    };

    useEffect(() => {
        if (smartAccountAddress) {
            fetchBalances();
        }
    }, [smartAccountAddress, txhashTransferFund, txhashPortfolio, txhashTrading]);

    return (
        <>
            <header className="w-full fixed top-0 left-0 right-0 md:top-3 z-50">
                <nav
                    className="max-w-[1380px] w-full md:w-[94%] mx-auto h-[70px] placeholder:h-[70px] flex justify-between items-center gap-3 bg-N0 md:border md:rounded-full py-3 px-7"
                    aria-label="Global"
                >
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">DefiLens</span>
                            <Image src={logoLight} width={150} height={150} alt="defilens logo" />
                        </Link>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-8">
                        {NavigationList.map((item) => (
                            <Link
                                key={item.title}
                                href={item.route}
                                className="flex flex-row transition-colors duration-200 rounded-full justify-between items-center gap-1 group"
                            >
                                <span
                                    className={cn(
                                        "p-2 rounded-full group-hover:bg-purple-100 transition-colors duration-200",
                                        pathname == item.route && "bg-purple-100"
                                    )}
                                >
                                    {item.icon && <Image src={item.icon} width={20} height={20} alt={item.title} />}
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
                    <div className="flex flex-1 items-center justify-end gap-x-6">
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
                            <div className="flex items-center overflow-hidden h-9 border rounded-lg border-gray-300 bg-white hover:bg-W100">
                                <div className="hidden lg:flex h-full px-2 text-sm font-semibold text-B200 border-gray-200 bg-white transition-all duration-300 ease-in-out transform shadow-sm text-secondary items-center justify-center font-condensed gap-2">
                                    <Image src={usdc} width={20} height={20} alt="USDC" />
                                    <span className="flex items-center gap-1">
                                        {isFetchingUsdc ? (
                                            <CgSpinner className="animate-spin h-5 w-5" />
                                        ) : (
                                            Number(totalUsdcInDecimal).toFixed(3)
                                        )}{" "}
                                    </span>
                                </div>
                                <Link
                                    href="deposite-fund"
                                    className="hidden lg:flex h-full px-2 border-l text-sm font-semibold text-B200 border-gray-300 bg-white hover:bg-W100 transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed"
                                >
                                    <MdOutlineFileDownload className="text-B200 text-lg" />
                                    Deposit USDC
                                </Link>
                            </div>
                            {/* Third web auth btn */}
                            <ConnectWalletWrapper />
                        </div>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => {
                                setMobileMenuOpen(!mobileMenuOpen);
                            }}
                        >
                            <span className="sr-only">Open main menu</span>
                            <HiBars3 className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </nav>
                <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 mt-16 sm:mt-20 sm:mr-7 max-h-fit rounded-xl shadow-xl right-0 z-20 w-full sm:max-w-sm overflow-y-auto bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
                        <div className="hidden sm:flex items-center gap-x-6">
                            <Link href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">DefiLens</span>
                                <Image src={logoLight} width={150} height={150} alt="defilens logo" />
                            </Link>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="flex flex-col space-y-2 py-6">
                                    {NavigationList.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.route}
                                            className="-mx-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
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
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
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

// {smartAccount && !loading && (
//     <button
//         onClick={() => setShowWalletAddress(!showWalletAddress)}
//         ref={walletAddressRef}
//         className="relative hidden sm:flex justify-center items-center gap-3 wallet-container bg-N0 border border-N40 px-5 py-1 rounded-xl text-B100 shadow-sm font-medium transition duration-300 hover:bg-N20 cursor-pointer"
//     >
//         {/* Smart account address and copy btn */}
//         <span className="text-sm font-medium">
//             {smartAccount &&
//                 smartAccountAddress.slice(0, 5) + "..." + smartAccountAddress.slice(-3)}
//         </span>
//         <CopyButton copy={smartAccountAddress} />

//         {/* Drop down see both addresses */}
//         {showWalletAddress && (
//             <div className="w-80 absolute top-16 right-0 z-50 flex flex-col justify-center items-start bg-N0 border-1 border-B75 shadow-xl p-3 rounded-lg">
//                 {/* SCW Address and Balance */}
//                 <div className="w-full relative flex justify-between p-2 items-center gap-2 cursor-default">
//                     <div className="flex flex-col justify-center items-start">
//                         <span className="text-B200 text-base font-medium">
//                             {smartAccount &&
//                                 smartAccountAddress.slice(0, 8) +
//                                     "..." +
//                                     smartAccountAddress.slice(-5)}
//                         </span>
//                         <span className="text-B100 text-xs">
//                             {smartAccount &&
//                                 "SmartAccount : (" +
//                                     scwBalance +
//                                     " " +
//                                     `${
//                                         ChainIdDetails[selectedNetwork.chainId.toString()]
//                                             ?.gasFeesName
//                                     }` +
//                                     ")"}
//                         </span>
//                     </div>
//                     <CopyButton copy={smartAccountAddress} />
//                 </div>
//                 {/* EOA Address and Balance */}
//                 <div className="w-full flex justify-between items-center gap-2 p-2 cursor-default">
//                     <div className="flex flex-col justify-center items-start">
//                         <span className="text-B200 text-base font-medium">
//                             {smartAccount &&
//                                 address &&
//                                 address.slice(0, 8) + "..." + address.slice(-5)}
//                         </span>
//                         <span className="text-B100 text-xs">
//                             {smartAccount &&
//                                 "EOA : (" +
//                                     eoaBalance +
//                                     " " +
//                                     `${
//                                         ChainIdDetails[selectedNetwork.chainId.toString()]
//                                             ?.gasFeesName
//                                     }` +
//                                     ")"}
//                         </span>
//                     </div>
//                     <CopyButton copy={address} />
//                 </div>
//             </div>
//         )}
//     </button>
// )}
