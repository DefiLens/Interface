// Library Imports
import { useRef, useEffect, Component, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { useAddress, useChainId, useChain, useWallet } from "@thirdweb-dev/react";
// Type, Store, Components, Helper Imports
import useClickOutside from "../../hooks/useClickOutside";
import { NETWORK_LIST, SUPPORTED_NETWORKS } from "../../utils/data/network";
import { NavigationList, metadata, socialHandles } from "../../utils/constants";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";
import { logoLight, usdc } from "../../assets/images";
import { MdOutlineFileDownload } from "react-icons/md";
import { tHeader } from "../../modules/header/types";
import JoinWaitlistContainer from "../../modules/join-waitlist/migrate-asset/JoinWaitlistContainer";
import { ConnectWalletWrapper } from "../Button";
import { BigNumber as bg } from "bignumber.js";
import { useSwitchOnSpecificChain } from "../../hooks/useSwitchOnSpecificChain";
bg.config({ DECIMAL_PLACES: 5 });

import React, { ReactNode } from "react";
import { HiBars3 } from "react-icons/hi2";

// Define the type for the props
interface LayoutProps {
    title: string;
    children: ReactNode;
}

import QRCode from "qrcode.react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import CopyButton from "../common/CopyButton";

interface Option {
    key: string;
    chainName: string;
    chainId?: string;
    icon: StaticImageData;
}

interface CustomDropdownProps {
    options: Option[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border rounded w-full flex justify-between items-center text-xs font-semibold text-B200 border-gray-300 bg-W100 hover:bg-white transition-all duration-300 ease-in-out transform shadow-sm"
            >
                <div className="flex gap-2 items-center">
                    <Image
                        src={(selected && options.find((option) => option.key === selected)?.icon) || ""}
                        width={32}
                        height={32}
                        alt="Network Icon"
                        className="h-8 w-8 rounded-full"
                    />
                    <span>
                        {selected ? (
                            options.find((option) => option.key === selected)?.chainName
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </span>
                </div>
                {isOpen ? <BiChevronUp className="w-5 h-5" /> : <BiChevronDown className="w-5 h-5" />}
            </button>
            {isOpen && (
                <ul className="absolute left-0 right-0 bg-W100 border rounded mt-2 max-h-60 overflow-auto z-50 flex flex-col ">
                    {options.map((option) => (
                        <li
                            key={option.key}
                            onClick={() => handleSelect(option.key)}
                            className="p-2 flex items-center gap-2 cursor-pointer text-xs font-semibold text-B200 border-gray-300 bg-W100 hover:bg-gray-300 transition-all duration-300 ease-in-out transform shadow-sm"
                        >
                            <Image src={option.icon} alt="Network Icon" className="h-8 w-8 rounded-full" />
                            {option.chainName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const TOKEN_LIST = [
    {
        key: "USDC",
        chainName: "USDC",
        icon: usdc,
    },
];

const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [token, setToken] = useState<string>("USDC");
    const [network, setNetwork] = useState<string>("Polygon");
    const address = useAddress();

    if (!isOpen) return null;

    return (
        <div className="fixed z-[110] inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Deposite USDC</h2>
                    <button onClick={onClose} className="text-red-500">
                        x
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <CustomDropdown
                        options={TOKEN_LIST}
                        selected={token}
                        onSelect={setToken}
                        placeholder="Select DeFi Token"
                    />
                    <CustomDropdown
                        options={NETWORK_LIST}
                        selected={network}
                        onSelect={setNetwork}
                        placeholder="Select Chain Network"
                    />
                </div>
                {network && (
                    <div className="text-center flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1">
                            <p className="text-base text-B200 font-sans">{address}</p>
                            <CopyButton copy={address} />
                        </div>
                        {address && <QRCode value={address} size={128} level="H" includeMargin={true} color="red"/>}
                    </div>
                )}
            </div>
        </div>
    );
};

// Create the Layout component
const MainLayout: React.FC<any> = ({ children }) => {
    const { mutateAsync: switchOnSpecificChain } = useSwitchOnSpecificChain();
    const { setShowWalletAddress, setConnectedWallet, mobileMenuOpen, setMobileMenuOpen }: iGlobal = useGlobalStore(
        (state) => state
    );

    const pathname = usePathname();
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

    const toggleSidebar = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col lg:flex-row max-h-screen min-h-screen">
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-black opacity-50 z-[99] lg:hidden" onClick={toggleSidebar}></div>
                )}

                {/* sidebar  */}
                <aside
                    id="sidebar"
                    className={`${
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    } fixed lg:static left-0 top-0 z-[100] bg-white min-h-screen max-h-screen w-64 lg:w-72 border-r border-W300 px-3 py-2 transition-transform duration-300 ease-in-out overflow-hidden`}
                >
                    <h1 className="flex items-center justify-center w-full font-bold text-sm md:text-xl h-[5rem]">
                        <Link href="/">
                            <Image src={logoLight} width={150} height={150} alt="defilens logo" />
                        </Link>
                    </h1>

                    <div id="menu" className="flex flex-col space-y-2 justify-between h-[calc(100vh-5rem)] pt-10">
                        <div className="flex flex-col gap-3 overflow-y-auto h-full">
                            {NavigationList.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.route}
                                    onClick={toggleSidebar}
                                    className={cn(
                                        "py-2 px-4 rounded-lg text-B200 bg-W100 hover:bg-W400 hover:bg-opacity-20 transition-all duration-100 ease-in-out transform flex items-center gap-1",
                                        pathname == item.route && "bg-W400 bg-opacity-20"
                                    )}
                                >
                                    <span
                                        className={
                                            "p-2 rounded-full group-hover:bg-purple-100 transition-colors duration-200"
                                        }
                                    >
                                        {item.icon && <Image src={item.icon} width={20} height={20} alt={item.title} />}
                                    </span>
                                    <span className="text-sm font-bold"> {item.title}</span>
                                </Link>
                            ))}
                            <div className="flex flex-col items-center gap-3">
                                <div className="lg:hidden w-full py-2 px-3 flex h-full rounded-lg border text-xs font-semibold text-B200 border-gray-300 bg-W100 transition-all duration-300 ease-in-out transform shadow-sm text-secondary items-center justify-center font-condensed">
                                    Balance: 57,078,126.78 USDC
                                </div>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(true);
                                        toggleSidebar();
                                    }}
                                    className="lg:hidden w-full py-2 px-3 flex h-full rounded-lg border text-xs font-semibold text-B200 border-gray-300 bg-W100 hover:bg-white transitionz-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed"
                                >
                                    <MdOutlineFileDownload className="text-B200 text-sm" />
                                    Deposit USDC
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center space-x-6 gap-2 border-t-[1px] border-W300 py-3">
                            <div className="flex gap-3 items-center justify-start">
                                {socialHandles.map((item) => (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        target="_blank"
                                        className="text-gray-400 hover:text-gray-500 hover:scale-110 transition duration-300"
                                    >
                                        <Image src={item.icon} alt={item.key} width={18} height={18} />
                                    </a>
                                ))}
                            </div>
                            <p className="text-center text-xs leading-5 text-gray-500">
                                &copy; {new Date().getFullYear()} {metadata.APP_NAME}. All rights reserved.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* main content */}
                <div className="main-bg lg:block w-full lg:w-[calc(100vw-16rem)] overflow-x-hidden transition-transform duration-300 ease-in-out">
                    <div className="lg:block max-w-5xl w-full mx-auto overflow-x-hidden transition-transform duration-300 ease-in-out px-2 md:px-4 lg:px-5">
                        <div className="min-h-10 py-3 flex items-center justify-between border-b border-N80">
                            <div className="flex items-center gap-3 h-9 ">
                                <button
                                    type="button"
                                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 lg:hidden"
                                    onClick={toggleSidebar}
                                >
                                    <span className="sr-only">Open main menu</span>
                                    <HiBars3 className="h-6 w-6 ml-2" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 px-2 h-9 ">
                                <div className="hidden lg:flex h-full px-4 rounded-lg border text-xs font-semibold text-B200 border-gray-300 bg-W100 transition-all duration-300 ease-in-out transform shadow-sm text-secondary items-center justify-center font-condensed">
                                    Balance: 57,078,126.78 USDC
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="hidden lg:flex h-full px-4 rounded-lg border text-xs font-semibold text-B200 border-gray-300 bg-W100 hover:bg-white transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed"
                                >
                                    <MdOutlineFileDownload className="text-B200 text-lg" />
                                    Deposit USDC
                                </button>
                                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                                <ConnectWalletWrapper />
                            </div>
                        </div>
                        <JoinWaitlistContainer />
                        <div className="py-4">{children}</div>
                    </div>
                </div>
            </div>

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
                                        <h3 className="font-semibold text-base md:text-2xl text-B200">
                                            Switch Network
                                        </h3>
                                        <p className="text-xs md:text-sm text-B100">
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
                                                        className="h-8 w-8 rounded-full"
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

export default MainLayout;
