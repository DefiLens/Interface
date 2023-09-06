import { useState, useRef, useEffect } from "react";

import { BigNumber, ethers } from "ethers";
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

import { Web3AuthModalPack } from "@safe-global/auth-kit";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthOptions } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import {
    MetaTransactionData,
    MetaTransactionOptions,
    SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import {
    RelayTransaction,
    // SafeProxyFactoryContract,
    SafeVersion,
} from "@safe-global/safe-core-sdk-types";
import Safe, {
    DEFAULT_SAFE_VERSION,
    EthersAdapter,
    PREDETERMINED_SALT_NONCE,
    PredictedSafeProps,
    SafeAccountConfig,
    SafeDeploymentConfig,
    encodeCreateProxyWithNonce,
    encodeMultiSendData,
    encodeSetupCallData,
    getMultiSendCallOnlyContract,
    getProxyFactoryContract,
    getSafeContract,
    predictSafeAddress,
} from "@safe-global/protocol-kit";

import IERC20 from "../abis/IERC20.json";
import { getContractInstance } from "../utils/web3Libs/ethers";
import { MAINNET_WEB3_AUTH } from "../utils/keys";

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
    const [_provider, setWeb3Provider] = useState<any>();
    const [_signer, setSigner] = useState<any>();
    const [web3Provider, setWeb3Provider2] = useState<ethers.providers.Web3Provider>();

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

    const sign = async () => {
        try {
            // console.log('loginWeb3Auth+')
            // console.log(process.env.REACT_APP_WEB3AUTH_CLIENT_ID)
            // console.log(chain.id, chain.rpcUrl)
            let options: Web3AuthOptions = {
                clientId: MAINNET_WEB3_AUTH || "",
                web3AuthNetwork: "testnet",
                chainConfig: {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: "0x89",
                    rpcTarget: "https://polygon-rpc.com",
                },
                uiConfig: {
                    theme: "dark",
                    loginMethodsOrder: ["google", "facebook"],
                },
            };

            const modalConfig = {
                [WALLET_ADAPTERS.TORUS_EVM]: {
                    label: "torus",
                    showOnModal: false,
                },
                [WALLET_ADAPTERS.METAMASK]: {
                    label: "metamask",
                    showOnDesktop: true,
                    showOnMobile: false,
                },
            };

            const openloginAdapter: any = new OpenloginAdapter({
                loginSettings: {
                    mfaLevel: "mandatory",
                },
                adapterSettings: {
                    uxMode: "popup",
                    whiteLabel: {
                        name: "Safe",
                    },
                },
            });

            const web3AuthModalPack = new Web3AuthModalPack({
                txServiceUrl: "https://safe-transaction-polygon.safe.global",
            });

            await web3AuthModalPack.init({
                options,
                adapters: [openloginAdapter],
                modalConfig,
            });

            const { safes, eoa }: any = await web3AuthModalPack.signIn();
            const provider = web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider;
            console.log(safes, eoa, new ethers.providers.Web3Provider(provider));
            const signer = new ethers.providers.Web3Provider(provider).getSigner();
            setWeb3Provider(provider);
            setSigner(signer);
            setWeb3Provider2(new ethers.providers.Web3Provider(provider));
        } catch (error) {}
    };

    const check = async () => {
        try {
            console.log("loginWeb3Auth++++++", _provider, _signer);
            // // console.log(process.env.REACT_APP_WEB3AUTH_CLIENT_ID)
            // // console.log(chain.id, chain.rpcUrl)
            // let options: Web3AuthOptions = {
            //     clientId: MAINNET_WEB3_AUTH || "",
            //     web3AuthNetwork: "testnet",
            //     chainConfig: {
            //         chainNamespace: CHAIN_NAMESPACES.EIP155,
            //         chainId: "0x89",
            //         rpcTarget: "https://polygon-rpc.com",
            //     },
            //     uiConfig: {
            //         theme: "dark",
            //         loginMethodsOrder: ["google", "facebook"],
            //     },
            // };

            // const modalConfig = {
            //     [WALLET_ADAPTERS.TORUS_EVM]: {
            //         label: "torus",
            //         showOnModal: false,
            //     },
            //     [WALLET_ADAPTERS.METAMASK]: {
            //         label: "metamask",
            //         showOnDesktop: true,
            //         showOnMobile: false,
            //     },
            // };

            // const openloginAdapter: any = new OpenloginAdapter({
            //     loginSettings: {
            //         mfaLevel: "mandatory",
            //     },
            //     adapterSettings: {
            //         uxMode: "popup",
            //         whiteLabel: {
            //             name: "Safe",
            //         },
            //     },
            // });

            // const web3AuthModalPack = new Web3AuthModalPack({
            //     txServiceUrl: "https://safe-transaction-polygon.safe.global",
            // });

            // await web3AuthModalPack.init({
            //     options,
            //     adapters: [openloginAdapter],
            //     modalConfig,
            // });

            // if (web3AuthModalPack) {
            // const { safes, eoa }: any = await web3AuthModalPack.signIn();
            // const provider = web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider;
            // console.log(safes, eoa, new ethers.providers.Web3Provider(provider));
            // const signer = new ethers.providers.Web3Provider(provider).getSigner();
            if (!web3Provider) return;
            const signer = web3Provider.getSigner();
            const relayPack = new GelatoRelayPack();
            const safeAccountAbstraction = new AccountAbstraction(signer);
            await safeAccountAbstraction.init({ relayPack });

            const USDC: any = await getContractInstance(
                "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                IERC20,
                new ethers.providers.Web3Provider(_provider)
            );
            const approveData = await USDC.populateTransaction.approve(
                "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
                BigNumber.from("2111111111113333")
            );
            
            console.log("approveData", approveData);
            const approveTx = { to: approveData.to, data: approveData.data, value: BigNumber.from("0").toString() };
            console.log("approveTx-", approveTx);

            // const dumpSafeTransafer: any[] = [
            //     {
            //         to: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            //         // to: safes[0],
            //         // data: '0x',
            //         // value: ethers.utils.parseUnits('0.01', 'ether').toString(),
            //         data: approveTx.data,
            //         value: ethers.utils.parseUnits("0").toString(),
            //         operation: OperationType.Call,
            //         // safeTxGas: BigNumber.from("45568").toNumber(),
            //         // baseGas: BigNumber.from("124615538075886000")
            //     },
            // ];

            const dumpSafeTransafer: any[] = [
                {
                    to: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    data: approveTx.data,
                    value: ethers.utils.parseUnits("0").toString(),
                },
            ];

            // @ts-ignore
            const options: any = {
                isSponsored: false,
                gasLimit: BigNumber.from("600000").toString(), // in this alfa version we need to manually set the gas limit
                gasToken: ethers.constants.AddressZero, // native token
                // gasToken: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
            };

            // @ts-ignore
            const gelatoTaskId = await safeAccountAbstraction.relayTransaction(dumpSafeTransafer, options);
            console.log("gelatoTaskId--", gelatoTaskId);
            // }
        } catch (error) {
            console.log("error: ", error);
        }
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
                <select
                    value={String(selectedChain)}
                    onChange={(e) => switchOnSpecificChain(e.target.value)}
                    style={{ float: "right", padding: "5px", marginTop: "12px" }}
                >
                    <option value="" disabled selected={selectedChain == "" || !selectedChain ? true : false}>
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

                <button
                    className="bg-error-600 hover:bg-error-700 py-3 px-8 rounded-lg text-error-100 font-medium border-b-4 border-error-800 hover:border-error-900 transition duration-300 mx-2"
                    onClick={() => sign()}
                >
                    sign
                </button>

                <button
                    className="bg-error-600 hover:bg-error-700 py-3 px-8 rounded-lg text-error-100 font-medium border-b-4 border-error-800 hover:border-error-900 transition duration-300 mx-2"
                    onClick={() => check()}
                >
                    Checkkk
                </button>

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
                        {smartAccount && !loading && (
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
