import { useState, useRef, useEffect } from "react";

import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";
import { FiCopy } from "react-icons/fi";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { IBundler, Bundler } from "@biconomy/bundler";
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import {
    useNetworkMismatch,
    useConnect,
    useAddress,
    metamaskWallet,
    useSigner,
    useChain,
    useSwitchChain,
} from "@thirdweb-dev/react";
import { useAppStore } from "../store/appStore";
import { bundlerURLs, gasFeesNames, paymasterURLs, rpscURLS } from "../utils/constants";
import { useContext } from "react";
import ChainContext from "../Context/ChainContext";
import { ImSpinner } from "react-icons/im";
import { useCalculatebalance } from "../hooks/useCalculateBalance";

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
        setConnected
    }: any = useAppStore((state) => state);
    const { mutateAsync: fetchNativeBalance } = useCalculatebalance();
    const [interval, enableInterval] = useState(false);
    const sdkRef = useRef<SocialLogin | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
    const switchChain = useSwitchChain();
    const metamaskConfig = metamaskWallet();
    const connect = useConnect();
    const address: any = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const chain = useChain();
    const [isWrongNetwork, setisWrongNetwork] = useState(false);
    const { selectedChain } = useContext(ChainContext);
    const chainIds = [137, 42161, 43114, 1, 10, 8453];

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
        isNetworkCorrect(chain?.chainId);
    }, []);

    const isNetworkCorrect = async (chainId: any) => {
        try {
            const chainIds = [137, 42161, 10, 1, 43114, 8453];
            if (chainIds.includes(chainId)) {
                setisWrongNetwork(false);
                await fetchNativeBalance({chainId: chainId, eoaAddress: address, scwAddress: smartAccount?.address})
            } else {
                setisWrongNetwork(true);
            }
        } catch (error) {
            console.log("isNetworkCorrect-error: ", error);
        }
    };

    async function login(chainId) {
        if (!chainId) throw "No ChainId";
        if (!sdkRef.current) {
            const socialLoginSDK = new SocialLogin();
            // const signature1 = await socialLoginSDK.whitelistUrl(
            //   "http://localhost:3000/"
            // );
            await socialLoginSDK.init({
                chainId: ethers.utils.hexValue(chainId),
                // whitelistUrls: {
                //   "http://localhost:3000/": signature1,
                // },
            });
            sdkRef.current = socialLoginSDK;
        }
        if (!sdkRef.current.provider) {
            // sdkRef.current.showConnectModal()
            sdkRef.current.showWallet();
            enableInterval(true);
        } else {
            setupSmartAccount(chainId);
        }
    }

    async function setupSmartAccount(chainId) {
        if (!sdkRef?.current?.provider) return;
        sdkRef.current.hideWallet();
        setLoading(true);
        const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider);
        try {
            const smartAccount = await createAccount(chainId);
            setSmartAccount(smartAccount);
            setLoading(false);
            setCurrentProvider("Biconomy");
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

    // const switchOnSpecificChain = async (chainName) => {
    //     try {
    //         setLoading(true)
    //         setSmartAccount(null)
    //         enableInterval(false)
    //         // setSelectedChain?.(chainName)
    //         await changeChain(chainName)
    //         setLoading(false)
    //     } catch (error) {
    //         setLoading(false)
    //         console.log("switchToChain-error: ", error)
    //     }
    // }

    // async function changeChain(chainName) {
    //     try {
    //         await connect(metamaskConfig, {})
    //         console.log("chainName-2", chain?.slug, chainName)
    //         if (chain?.slug != chainName) {
    //             // await logout()
    //             if (chainName == "polygon") {
    //                 console.log("polygon-2")
    //                 await switchChain(137)
    //                 await login(137)
    //                 await isNetworkCorrect(137)
    //                 setSelectedChain?.(chainName)
    //                 setSelectedChainId?.("137")
    //             } else if (chainName == "arbitrum") {
    //                 console.log("arbitrum-2")
    //                 await switchChain?.(42161)
    //                 await login(42161)
    //                 await isNetworkCorrect(42161)
    //                 setSelectedChain?.(chainName)
    //                 setSelectedChainId?.("42161")
    //             } else {
    //                 console.log("other-2")
    //                 await isNetworkCorrect(chain?.chainId)
    //             }
    //         }
    //     } catch (error: any) {
    //         console.log("changeChain-error", error)
    //     }
    // }

    const handleConnect = async () => {
        connect(metamaskConfig, {}).then(() => {
            setConnected(true)
        }).catch(
            setConnected(false)
        )
        // if (chain?.chainId) {
        //   await login(chain?.chainId);
        // }
      };

    const buttonStyle =
        "bg-primary-600 hover:bg-primary-700 py-3 px-8 rounded-lg text-primary-100 font-medium border-b-4 border-primary-800 hover:border-primary-900 transition duration-300";

    return (
        <div>
            <ul className="bg-primary-950 p-2 shadow-md shadow-secondary-500">
                <li>
                    <a href="#" className="font-bold text-2xl hover:bg-transparent">
                        ChainPing
                    </a>
                </li>
                {/* <select
                    value={String(selectedChain)}
                    onChange={(e) => switchOnSpecificChain(e.target.value)}
                    style={{float: "right", padding: "5px", marginTop: "12px"}}
                >
                    <option
                        value=""
                        disabled
                        selected={
                            selectedChain == "" || !selectedChain ? true : false
                        }
                    >
                        ---
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
                </select> */}

                <li style={{ float: "right", padding: "5px" }}>

                    <div>
                        {/* {!chainIds.includes(chain?.chainId as number) && !loading ? (
                            <button
                                disabled
                                className="bg-error-600 hover:bg-error-700 py-3 px-8 rounded-lg text-error-100 font-medium border-b-4 border-error-800 hover:border-error-900 transition duration-300 mx-2"
                                // onClick={() => switchOnSpecificChain("polygon")}
                            >
                                Wrong Network
                            </button>
                        ) : ( */}
                            { smartAccount && !loading && (
                                <div className="flex flex-wrap justify-start items-center gap-3 text-base">
                                    <button className={`${buttonStyle} flex justify-center items-center gap-2`}>
                                        Current Network: {chain?.name}
                                    </button>
                                    <button className={`${buttonStyle} flex justify-center items-center gap-2`}>
                                        SCW :{" "}
                                        <span className="text-sm font-medium">
                                            {smartAccount &&
                                                smartAccount.address.slice(0, 4) +
                                                    ".." +
                                                    smartAccount.address.slice(-3) +
                                                    " : (" +
                                                    scwBalance +
                                                    " " +
                                                    `${gasFeesNames[selectedChain]}` +
                                                    ")"}
                                        </span>
                                        <FiCopy onClick={() => copyToClipboard(smartAccount.address)} />
                                    </button>

                                    <button className={`${buttonStyle} flex justify-center items-center gap-2`}>
                                        EOA :
                                        <span className="text-sm font-medium">
                                            {smartAccount &&
                                                address?.slice(0, 4) +
                                                    ".." +
                                                    address?.slice(-3) +
                                                    " : (" +
                                                    eoaBalance +
                                                    " " +
                                                    `${gasFeesNames[selectedChain]}` +
                                                    ")"}
                                        </span>
                                        <FiCopy onClick={() => copyToClipboard(address)} />
                                    </button>
                                </div>
                                )}
                            {/* // ) */}
                        {/* )} */}

            {!smartAccount && !loading && !connected && (
              <li>
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
              </li>
            )}

            {connected && !smartAccount && !loading && (
              <li>
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
              </li>
            )}

            {loading && (
                            <button className={`${buttonStyle} flex justify-center items-center gap-2`}>
                                <ImSpinner className="animate-spin h-5 w-5" />
                                Loading account details...
                            </button>
                        )}
                    </div>
                </li>
            </ul>
        </div>
    );
}
