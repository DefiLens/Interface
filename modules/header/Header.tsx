import { useRef, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { FiCopy } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { usePathname } from "next/navigation";
import { useAddress, useChainId, useChain } from "@thirdweb-dev/react";

import { tHeader } from "./types";
import { copyToClipboard } from "../../utils/helper";
import { logoDark, logoLight, metamask, wallet, portfolio, batching, mirgrate_asset } from "../../assets/images";
import useClickOutside from "../../hooks/useClickOutside";
import { ChainIdDetails, NETWORK_LIST } from "../../utils/data/network";
import { NavigationList } from "../../utils/data/navigation";
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
        selectedNetwork,
    }: iGlobal = useGlobalStore((state) => state);

    const address: any = useAddress();
    const chainId = useChainId();
    const chain = useChain();

    const walletAddressRef = useRef(null);
    const selectNetworkRef = useRef(null);

    useClickOutside([walletAddressRef], () => {
        setShowWalletAddress(false);
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
            <div className="w-full fixed top-0 left-0 right-0 md:top-3 z-10 ">
                <div className="max-w-[1380px] w-full md:w-[94%] mx-auto h-[70px] placeholder:h-[70px] flex justify-between items-center gap-3 bg-N0 md:border md:shadow-lg md:rounded-full p-3">
                    <div className="flex justify-between items-center gap-8">
                        {NavigationList.length > 0 &&
                            NavigationList?.map((item) => (
                                <Link
                                    href={item.route}
                                    key={item.title}
                                    className={`lg:flex hidden flex-row justify-between items-center gap-3 text-black text-lg`}
                                >
                                    {item.image &&
                                        <Image
                                            src={item.image}
                                            width={150}
                                            height={150}
                                            alt="DefiLens"
                                            className=""
                                        />}
                                    {item.icon &&
                                        <Image
                                            src={item.icon}
                                            width={30}
                                            height={30}
                                            alt="Batching"
                                            className=""
                                        />}
                                    <span>{item.title}</span>
                                </Link>
                            ))
                        }
                    </div>

                    <div className="flex justify-between items-center gap-3">
                        <Link
                            href='/transfer-fund'
                            className={`flex items-center justify-center gap-2 cursor-pointer px-5 py-1 text-sm md:text-base text-center rounded-full bg-N0 shadow-lg hover:bg-N20 transition duration-300 ${pathname === '/transfer-fund' ? "bg-gradient-to-br from-D600 via-D400 to-D100 text-N0" : "text-B100"
                                } `}
                        >
                            <span className="font-bold pl-2">
                                Transfer Fund
                            </span>
                            <Image
                                src={pathname === '/transfer-fund' ? wallet : mirgrate_asset}
                                alt="close"
                                className="h-10 w-10 p-1.5 rounded-lg"
                            />
                        </Link>

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
                                        className="relative wallet-container bg-N0 px-3 py-2.5 rounded-3xl flex justify-center items-center gap-3 text-B100 shadow-lg font-medium transition duration-300 hover:bg-N20"
                                    >

                                        <span className="text-sm font-medium">
                                            {smartAccount &&
                                                smartAccountAddress.slice(0, 5) + "..." + smartAccountAddress.slice(-3)}
                                        </span>
                                        <span className="flex justify-center items-center gap-2">
                                            <FiCopy
                                                size="18px"
                                                className="text-B100 active:text-B200"
                                                onClick={() =>
                                                    copyToClipboard(smartAccountAddress, "Smart account address Copied")
                                                }
                                            />
                                        </span>
                                        {showWalletAddress && smartAccount && !loading && (
                                            <div
                                                ref={walletAddressRef}
                                                className="w-80 absolute top-16 z-50 flex flex-col justify-center items-start gap-4 bg-N0 border-1 border-B75 shadow-lg p-3 rounded-lg"
                                            >
                                                <button className="w-full relative flex justify-between items-center gap-2">
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
                                                                `${ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                    ?.gasFeesName
                                                                }` +
                                                                ")"}
                                                        </span>
                                                    </div>

                                                    <FiCopy
                                                        size="35px"
                                                        className="text-B100 active:text-B200 p-2 hover:bg-N40 rounded-md"
                                                        onClick={() =>
                                                            copyToClipboard(smartAccountAddress, "Smart account address Copied")
                                                        }
                                                    />
                                                </button>
                                                <button className="w-full flex justify-between items-center gap-2">
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
                                                                `${ChainIdDetails[selectedNetwork.chainId.toString()]
                                                                    ?.gasFeesName
                                                                }` +
                                                                ")"}
                                                        </span>
                                                    </div>

                                                    <FiCopy
                                                        size="35px"
                                                        className="text-B100 active:text-B200 p-2 hover:bg-N40 rounded-md"
                                                        onClick={() => copyToClipboard(address, "EOA address Copied")}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </button>
                                )}

                                <ConnectWallet
                                    theme={"light"}
                                    modalSize={"wide"}
                                    btnTitle="Login"
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
                        </div>

                        <div className="flex justify-between items-center">
                            {selectedNetwork?.chainName &&
                                <div className="rounded-full p-1">
                                    <Image src={selectedNetwork.icon} alt="" className="h-8 w-8 rounded-full" />
                                </div>
                            }
                        </div>

                    </div >
                </div >
            </div >

            {chainId &&
                <>
                    {chain?.slug == "polygon" || chain?.slug == "base" || chain?.slug == "optimism" ? <></>
                        :
                        <>
                            <div
                                className="fixed z-[110] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-N20 border-1 border-B75 shadow-lg p-3 rounded-lg transition duration-300"
                                style={{ minWidth: '20%', minHeight: '20%' }}
                            >
                                <div className="relative z-[112] w-full flex flex-col justify-center items-center gap-3">
                                    <div className="w-full flex flex-col text-start mb-4">
                                        <h3 className="font-semibold text-lg md:text-2xl text-B200">Switch Network</h3>
                                        <p className="text-xs md:text-base text-B100">Only following networks are supported</p>
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
                                                    <Image src={item.icon} alt="logo" className="h-10 w-10 rounded-full" />
                                                    <div className="text-sm md:text-base text-B100">{item.key}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="absolute z-[111] inset-0 m-auto max-w-xs h-[600] blur-[118px] sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 25.73%, rgba(14, 165, 233, 0.41) 25.74%, rgba(232, 121, 249, 0.26) 66.49%, rgba(79, 70, 229, 0.4) 125.91%)" }}></div>
                            </div>
                            <div className="fixed top-0 left-0 z-[100] w-screen h-screen bg-[rgba(0,0,0,0.7)] transition duration-300"></div>
                        </>
                    }
                </>
            }
        </>
    );
};
export default Header;
