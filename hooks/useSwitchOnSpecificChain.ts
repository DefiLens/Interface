// Library Imports
import { useEffect } from "react";
import toast from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";
import { useMutation } from "@tanstack/react-query";
import { Signer } from "ethers";
import { Bundler, IBundler } from "@biconomy/bundler";
import { BiconomyPaymaster, IPaymaster } from "@biconomy/paymaster";
import {
    metamaskWallet,
    phantomWallet,
    rainbowWallet,
    coinbaseWallet,
    useAddress,
    useChain,
    useConnect,
    useSigner,
    useSwitchChain,
    useWallet,
} from "@thirdweb-dev/react";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";

import { ChainIdDetails } from "../utils/data/network";
import { iGlobal, useGlobalStore } from "../store/GlobalStore";
import { iTrading, useTradingStore } from "../store/TradingStore";
import { useCalculatebalance } from "../hooks/utilsHooks/useCalculateBalance";
import { arbitrum, avalanche, base, ethereum, optimism, polygon } from "../assets/images";
import {DEFAULT_MULTICHAIN_MODULE, MultiChainValidationModule } from "@biconomy/modules";
import { handleLogin } from "../utils/globalApis/trackingApi";
import { iTransfer, useTransferStore } from "../store/TransferStore";
import { iPortfolio, usePortfolioStore } from "../store/Portfolio";
bg.config({ DECIMAL_PLACES: 5 });

export function useSwitchOnSpecificChain() {
    const {
        connected,
        setConnected,
        setLoading,
        smartAccount,
        smartAccountAddress,
        setSmartAccount,
        setSmartAccountAddress,
        setCurrentProvider,
        setSelectedNetwork,
        connectedWallet,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        txhash: txhashTrading,
    }: iTrading = useTradingStore((state) => state);

    const {
        txhash: txhashTransferFund,
    }: iTransfer = useTransferStore((state) => state);

    const {
        txhash: txhashPortfolio,
    }: iPortfolio = usePortfolioStore((state) => state);

    const { setSelectedFromNetwork }: iTrading = useTradingStore((state) => state);
    const { mutateAsync: fetchNativeBalance } = useCalculatebalance();
    const switchChain = useSwitchChain();
    const connect = useConnect();
    const address = useAddress(); // Detect the connected address
    const signer = useSigner(); // Detect the connected signer
    const chain = useChain();
    const wallet = useWallet();

    useEffect(() => {
        async function changeWallet() {
            if (address && smartAccount && chain) {
                if (smartAccount.owner == address) return;
                const _smartAccount = await login(chain?.chainId);
                console.log("_smartAccount--use", _smartAccount);
                // @ts-ignore
                await isNetworkCorrect(chain?.chainId, await _smartAccount.getAccountAddress());

                setSelectedNetwork({
                    key: chain?.chain,
                    chainName: chain?.slug,
                    chainId: chain?.chainId.toString(),
                    icon: ChainIdDetails[chain?.chainId.toString()].networkLogo,
                });
                setSelectedFromNetwork({
                    key: chain?.chain,
                    chainName: chain?.slug,
                    chainId: chain?.chainId.toString(),
                    icon: ChainIdDetails[chain?.chainId.toString()].networkLogo,
                });

            } else {
                setSmartAccount(null);
                setSmartAccountAddress("");
                setConnected(false);

                setSelectedNetwork({
                    key: "",
                    chainName: "",
                    chainId: "",
                    icon: "",
                });

                setSelectedFromNetwork({
                    key: "",
                    chainName: "",
                    chainId: "",
                    icon: "",
                });
            }
        }
        changeWallet();
    }, [address]);

    useEffect(() => {
        if (smartAccount) isNetworkCorrect(chain?.chainId, smartAccountAddress);
    }, [txhashTransferFund, txhashPortfolio, txhashTrading]);

    /**
     *
     * @param walletName Wallet name
     * @returns Desired Wallet Configuration
     */
    const getConfig = (walletName: string) => {
        // Wallet Configurations
        const metamaskConfig = metamaskWallet();
        const phantomConfig = phantomWallet();
        const coinbaseConfig = coinbaseWallet();
        const rainbowConfig = rainbowWallet();

        if (walletName == "metamask") {
            return connect(metamaskConfig, {});
        } else if (walletName == "phantom") {
            return connect(phantomConfig, {});
        } else if (walletName == "coinbase") {
            return connect(coinbaseConfig, {});
        } else if (walletName == "rainbowWallet") {
            return connect(rainbowConfig, {});
        } else {
            return connect(metamaskConfig, {});
        }
    };

    const handleConnect = async () => {
        if (connectedWallet == null) return;
        getConfig(connectedWallet.walletId)
            .then(() => {
                setConnected(true);
            })
            .catch(() => {
                setConnected(false);
            });
    };

    const createAccount = async (chainId: number) => {
        const bundler: IBundler = new Bundler({
            bundlerUrl: ChainIdDetails[chainId].bundlerURL,
            chainId: chainId,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        });
        const paymaster: IPaymaster = new BiconomyPaymaster({
            paymasterUrl: ChainIdDetails[chainId].paymasterURL,
        });
        // const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        //     signer: signer,
        //     chainId: chainId,
        //     bundler: bundler,
        //     paymaster: paymaster,
        // };
        // let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
        // biconomySmartAccount = await biconomySmartAccount.init();

        // const ownerShipModule: any = await ECDSAOwnershipValidationModule.create({
        //     signer: signer as Signer,
        //     moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
        // });
        const multiChainModule = await MultiChainValidationModule.create({
            signer: signer as Signer,
            moduleAddress: DEFAULT_MULTICHAIN_MODULE,
        });
        //   setProvider(provider)
        let biconomySmartAccount = await BiconomySmartAccountV2.create({
            chainId: chainId,
            bundler: bundler,
            paymaster: paymaster,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            defaultValidationModule: multiChainModule,
            activeValidationModule: multiChainModule,
        });

        // await biconomySmartAccount.init()
        // console.log('biconomySmartAccount-2', biconomySmartAccount)

        return biconomySmartAccount;
    };

    const isNetworkCorrect = async (chainId: number | undefined, smartAccountAddress: any) => {
        try {
            const chainIds: Array<number | undefined> = [1, 137, 42161, 43114, 10, 8453];
            if (chainIds.includes(chainId)) {
                await fetchNativeBalance({
                    chainId: chainId,
                    eoaAddress: address,
                    scwAddress: smartAccountAddress,
                });
            } else {
            }
        } catch (error) {
            console.log("isNetworkCorrect:error: ", error);
        }
    };

    const login = async (chainId: number) => {
        if (!chainId) {
            toast.error("No ChainId");
            return;
        }

        return setupSmartAccount(chainId);
    };

    const setupSmartAccount = async (chainId: number) => {
        // if (!sdkRef?.current?.provider) return;
        // sdkRef.current.hideWallet();
        setLoading(true);
        // const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider);
        try {
            const smartAccount = await createAccount(chainId);
            const _smartAccountAddress = await smartAccount.getAccountAddress();
            console.log("_smartAccountAddress ,", _smartAccountAddress);
            setSmartAccountAddress(_smartAccountAddress);
            setSmartAccount(smartAccount);

            setLoading(false);
            setCurrentProvider("Biconomy");

            console.log("----------------------------Log in--------------------------")
            console.log('address:', _smartAccountAddress);
            console.log("wallet", wallet)

            handleLogin(_smartAccountAddress, address, wallet?.walletId);

            return smartAccount;
        } catch (err) {
            setLoading(false);
            console.log("error setting up smart account... ", err);
        }
    };

    const changeChain = async (chainName: string) => {
        try {
            if (!connected) await handleConnect();
            if (chain?.slug != chainName) {
                // await logout()
                if (chainName == "polygon") {
                    await switchChain(137);
                    const _smartAccount = await login(137);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);
                    // @ts-ignore
                    await isNetworkCorrect(137, _smartAccountAddress);

                    setSelectedNetwork({
                        key: "Polygon",
                        chainName: chainName,
                        chainId: "137",
                        icon: polygon,
                    });
                    setSelectedFromNetwork({
                        key: "Polygon",
                        chainName: chainName,
                        chainId: "137",
                        icon: polygon,
                    });
                } else if (chainName == "arbitrum") {
                    await switchChain?.(42161);
                    const _smartAccount = await login(42161);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);
                    // @ts-ignore
                    await isNetworkCorrect(42161, _smartAccountAddress);

                    setSelectedNetwork({
                        key: "Arbitrum",
                        chainName: chainName,
                        chainId: "42161",
                        icon: arbitrum,
                    });
                    setSelectedFromNetwork({
                        key: "Arbitrum",
                        chainName: chainName,
                        chainId: "42161",
                        icon: arbitrum,
                    });
                } else if (chainName == "avalanche") {
                    await switchChain(43114);

                    const _smartAccount = await login(43114);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);
                    // @ts-ignore
                    await isNetworkCorrect(43114, _smartAccountAddress);

                    setSelectedNetwork({
                        key: "Avalanche",
                        chainName: chainName,
                        chainId: "43114",
                        icon: avalanche,
                    });
                    setSelectedFromNetwork({
                        key: "Avalanche",
                        chainName: chainName,
                        chainId: "43114",
                        icon: avalanche,
                    });
                } else if (chainName == "optimism") {
                    await switchChain?.(10);

                    const _smartAccount = await login(10);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);
                    // @ts-ignore
                    await isNetworkCorrect(10, _smartAccountAddress);

                    setSelectedNetwork({
                        key: "Optimism",
                        chainName: chainName,
                        chainId: "10",
                        icon: optimism,
                    });
                    setSelectedFromNetwork({
                        key: "Optimism",
                        chainName: chainName,
                        chainId: "10",
                        icon: optimism,
                    });
                } else if (chainName == "ethereum") {
                    await switchChain(1);

                    const _smartAccount = await login(1);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);
                    // @ts-ignore
                    await isNetworkCorrect(1, _smartAccountAddress);

                    setSelectedNetwork({
                        key: "Ethereum",
                        chainName: chainName,
                        chainId: "1",
                        icon: ethereum,
                    });
                    setSelectedFromNetwork({
                        key: "Ethereum",
                        chainName: chainName,
                        chainId: "1",
                        icon: ethereum,
                    });
                } else if (chainName == "base") {
                    await switchChain?.(8453);

                    const _smartAccount = await login(8453);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);
                    // @ts-ignore
                    await isNetworkCorrect(8453, _smartAccountAddress);

                    setSelectedNetwork({
                        key: "Base",
                        chainName: chainName,
                        chainId: "8453",
                        icon: base,
                    });
                    setSelectedFromNetwork({
                        key: "Base",
                        chainName: chainName,
                        chainId: "8453",
                        icon: base,
                    });
                }
            } else {
                if (chain) {
                    console.log("Already on that chain");
                    const _smartAccount = await login(chain?.chainId);
                    const _smartAccountAddress = await _smartAccount?.getAccountAddress();
                    console.log("_smartAccountAddress: ", _smartAccountAddress);

                    setSelectedNetwork({
                        key: chain?.chain,
                        chainName: chain?.slug,
                        chainId: chain?.chainId.toString(),
                        icon: ChainIdDetails[chain?.chainId.toString()].networkLogo,
                    });
                    setSelectedFromNetwork({
                        key: chain?.chain,
                        chainName: chain?.slug,
                        chainId: chain?.chainId.toString(),
                        icon: ChainIdDetails[chain?.chainId.toString()].networkLogo,
                    });

                    // @ts-ignore
                    await isNetworkCorrect(chain?.chainId, _smartAccountAddress);
                }
            }
        } catch (error: any) {
            console.log("changeChain-error", error);
        }
    };

    const switchOnSpecificChain = async (chainName: string) => {
        try {
            setLoading(true);
            setSmartAccount(null);
            setSmartAccountAddress("");
            await changeChain(chainName);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.log("switchToChain-error: ", error);
            return 0;
        }
    };

    return useMutation(switchOnSpecificChain);
}
