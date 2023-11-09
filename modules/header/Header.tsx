import { useContext, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import { FiCopy } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { usePathname } from "next/navigation";
import { useAddress } from "@thirdweb-dev/react";
import { TbSquareRoundedChevronDownFilled } from "react-icons/tb";

import { tHeader } from "./types";
import { copyToClipboard } from "../../utils/helper";
import ChainContext from "../../Context/ChainContext";
import { metamask, wallet } from "../../assets/images";
import useClickOutside from "../../hooks/useClickOutside";
import TransferContainer from "../transfer/TransferContainer";
import { iTrade, useTradeStore } from "../../store/TradeStore";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { gasFeesNames, NavigationList } from "../../utils/constants";
import SelectNetwork from "../../components/SelectNetwork/SelectNetwork";

const Header: React.FC<any> = ({
    handleConnect,
    switchOnSpecificChain
}: tHeader) => {
    
    const pathname = usePathname()

    const {
        connected,
        loading,
        smartAccount,
        scwBalance,
        eoaBalance,
        showWalletAddress,
        setShowWalletAddress,
        showTransferFundToggle,
        setShowTransferFundToggle,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
    }: iTrade = useTradeStore((state) => state);

    // const {
    //     selectedChain,
    // } = useContext(ChainContext);

    const address: any = useAddress(); // Detect the connected address

    const walletAddressRef = useRef(null);
    const transferModuleRef = useRef(null);

    useClickOutside([walletAddressRef], () => {
        setShowWalletAddress(false);
      });

    useClickOutside([transferModuleRef], () => {
        setShowTransferFundToggle(false);
    });

    return (
        <div className="header-container w-full h-[69px]">
            <ul className="w-full h-full flex justify-between items-center gap-3 bg-backgound-100 p-2 shadow-md shadow-secondary-500">
                <li className="w-full xl:w-1/3 flex justify-start items-center">
                    <Link href="/" className="text-[30px] font-bold flex flex-row justify-center items-center">
                        <div className="mr-2 p-1">
                            <svg
                                width="40px"
                                height="40px"
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
                        <div className="text-font-100">DefiLens</div>
                    </Link>
                </li>
                <li className="hidden xl:flex justify-center items-center gap-3 text-lg bg-backgound-300 rounded-full p-1">
                    {NavigationList.length > 0 &&
                        NavigationList?.map((item) => (
                            <Link
                                href={item.route}
                                key={item.title}
                                className={`cursor-pointer px-5 py-1 text-sm md:text-base text-center rounded-full hover:bg-backgound-100 transition duration-300 ${
                                pathname === item.route ? "bg-backgound-100" : ""
                                } `}
                            >
                                {item.title}
                            </Link>
                    ))}
                </li>
                <li className="w-full xl:w-1/3 flex flex-wrap justify-end items-center gap-3">
                    {/* {!smartAccount && !loading && !connected && (
                        <button
                            className="bg-button-100 hover:bg-button-200 py-1 px-5 rounded-lg text-font-100 font-medium border-b-4 transition duration-300 border-primary-800 hover:border-primary-900 flex justify-center items-center gap-2"
                            // onClick={handleConnect}
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
                            Connect
                        </button>
                    )} */}
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
                    {smartAccount && !loading && (
                        <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                            <button
                                type="button"
                                onClick={() => setShowWalletAddress(!showWalletAddress)}
                                className="relative wallet-container flex justify-center items-center gap-5 bg-backgound-600 p-2 pr-4 rounded-3xl text-font-100 font-medium transition duration-300"
                            >
                                <Image
                                    src={metamask}
                                    alt="close"
                                    className="h-7 w-7 p-1 bg-font-100 rounded-full cursor-pointer"
                                />
                                <span className="text-sm font-medium">
                                    {smartAccount &&
                                        smartAccount.address.slice(0, 5) + "..." + smartAccount.address.slice(-3)}
                                </span>
                                <span className="flex justify-center items-center gap-2">
                                    <FiCopy
                                        className="text-font-100 hover:text-font-200 active:text-font-400"
                                        onClick={() => copyToClipboard(smartAccount.address, 'Smart account address Copied')}
                                    />
                                </span>
                            </button>

                            {showWalletAddress && smartAccount && !loading && (
                                <div 
                                    ref={walletAddressRef} 
                                    className="w-80 absolute top-16 right-28 z-50 flex flex-col justify-center items-start gap-4 bg-backgound-600 border-2 border-backgound-500 shadow-md shadow-backgound-100 p-3 rounded-lg"
                                >
                                    <button className="w-full relative flex justify-between items-center gap-2">
                                        <div className="flex flex-col justify-center items-start">
                                            <span className="text-font-100 text-base font-medium">
                                                {smartAccount &&
                                                    smartAccount.address.slice(0, 13) +
                                                        "..." +
                                                        smartAccount.address.slice(-3)}
                                            </span>
                                            <span className="text-font-300 text-xs">
                                                {smartAccount &&
                                                    "SmartAccount : (" +
                                                        scwBalance +
                                                        " " +
                                                        `${gasFeesNames[selectedFromNetwork.chainName]}` +
                                                        ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() => copyToClipboard(smartAccount.address, 'Smart account address Copied')}
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
                                                        `${gasFeesNames[selectedFromNetwork.chainName]}` +
                                                        ")"}
                                            </span>
                                        </div>

                                        <FiCopy
                                            size="35px"
                                            className="text-font-100 active:text-font-300 p-2 hover:bg-backgound-700 rounded-md"
                                            onClick={() => copyToClipboard(address, 'EOA address Copied')}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <SelectNetwork
                        switchOnSpecificChain={switchOnSpecificChain}
                    />
                    
                    {/* <div className="relative border-2 border-secondary-300 text-backgound-100 bg-font-100 shadow-md rounded-md">
                        <label htmlFor="fromNetwork" className="sr-only">
                            Connect Network
                        </label>
                        <select
                            id="fromNetwork"
                            name="networks"
                            className="w-44 appearance-none py-1 px-3 bg-font-100 rounded-md"
                            value={String(selectedChain)}
                            onChange={(e) => switchOnSpecificChain(e.target.value)}
                        >
                            <option value="" disabled selected={selectedChain == "" || !selectedChain ? true : false}>
                                Select Network
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
                    </div> */}

                    <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                        <div className="relative flex justify-center items-center gap-5 bg-font-100 rounded-full font-medium  transition duration-300 overflow-hidden">
                            <span className="flex justify-center items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="transfer-fund-toggle"
                                    checked={showTransferFundToggle}
                                    className="absolute hidden"
                                    onChange={(e: any) => setShowTransferFundToggle(e.target.checked)}
                                />
                                <label htmlFor="transfer-fund-toggle" className="transfer-fund-icon">
                                    <Image
                                        src={wallet}
                                        alt="close"
                                        className="h-10 w-10 p-2 bg-font-100 hover:bg-font-200 active:font-400 rounded-lg cursor-pointer"
                                    />
                                </label>
                            </span>
                        </div>
                        <div
                            ref={transferModuleRef}
                            className={`absolute w-96 h-[calc(100%-69px)] top-[69px] z-40 shadow-xl shadow-gray-900 ${
                                showTransferFundToggle
                                    ? "!right-0 !translate-x-0 !transition !duration-1000 !ease-out"
                                    : "!-right-96 !translate-x-96 !transition !duration-700 !ease-out"
                            } `}
                        >
                            <TransferContainer />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};
export default Header;
