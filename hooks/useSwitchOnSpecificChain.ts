import { useEffect } from "react";

import toast from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { useMutation } from "@tanstack/react-query";
import { Bundler, IBundler } from "@biconomy/bundler";
import { BiconomyPaymaster, IPaymaster } from "@biconomy/paymaster";
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { metamaskWallet, useAddress, useChain, useConnect, useSigner, useSwitchChain } from "@thirdweb-dev/react";

import { iTrade, useTradeStore } from "../store/TradeStore";
import { iGlobal, useGlobalStore } from "../store/GlobalStore";
import { useCalculatebalance } from "../hooks/useCalculateBalance";
import { bundlerURLs, NetworkLogoByChainId, paymasterURLs } from "../utils/constants";
import { arbitrum, avalanche, base, ethereum, optimism, polygon } from "../assets/images";

bg.config({ DECIMAL_PLACES: 5 });


export function useSwitchOnSpecificChain() {
    const {
        connected,
        setConnected,
        setLoading,
        smartAccount,
        setSmartAccount,
        setCurrentProvider,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        setSelectedFromNetwork,
    }: iTrade = useTradeStore((state) => state);


    const { mutateAsync: fetchNativeBalance } = useCalculatebalance();
    const switchChain = useSwitchChain();
    const metamaskConfig = metamaskWallet();
    const connect = useConnect();
    const address: any = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const chain = useChain();

    useEffect(() => {
        async function changeWallet() {
            if (address && smartAccount && chain) {
                if (smartAccount.owner == address) return;
                const _smartAccount = await login(chain?.chainId);
                // @ts-ignore
                await isNetworkCorrect(chain?.chainId, _smartAccount.address);

                setSelectedFromNetwork({
                    key: chain?.chain,
                    chainName: chain?.slug,
                    chainId: chain?.chainId.toString(),
                    icon: NetworkLogoByChainId[chain?.chainId.toString()],
                })

            } else {
                setSmartAccount(null)
                setConnected(false)

                setSelectedFromNetwork({
                    key: '',
                    chainName: '',
                    chainId: '',
                    icon: '',
                })
            }
        }
        changeWallet();
    }, [address]);

    useEffect(() => {
        if (smartAccount) isNetworkCorrect(chain?.chainId, smartAccount.address);
    }, []);

    const handleConnect = async () => {
        connect(metamaskConfig, {})
            .then(() => {
                setConnected(true);
            })
            .catch(() => {
                setConnected(false);
            });
    };

    const createAccount = async (chainId: any) => {
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
    
    const isNetworkCorrect = async (chainId: any, smartAccountAddress: any) => {
        try {
            const chainIds = [137, 42161, 10, 1, 43114, 8453];
            if (chainIds.includes(chainId)) {
                await fetchNativeBalance({ 
                    chainId: chainId,
                    eoaAddress: address,
                    scwAddress: smartAccountAddress
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
        };
       
        return setupSmartAccount(chainId);
    };

    const setupSmartAccount = async (chainId: number) => {
        // if (!sdkRef?.current?.provider) return;
        // sdkRef.current.hideWallet();
        setLoading(true);
        // const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider);
        try {
            const smartAccount = await createAccount(chainId);
            setSmartAccount(smartAccount);
            setLoading(false);
            setCurrentProvider("Biconomy");
            return smartAccount;
        } catch (err) {
            setLoading(false);
            console.log("error setting up smart account... ", err);
        }
    }

    const changeChain = async (chainName: string) => {
        try {
            if (!connected) await handleConnect();
            if (chain?.slug != chainName) {
                // await logout()
                if (chainName == "polygon") {
                    await switchChain(137);
                    const _smartAccount = await login(137);
                    // @ts-ignore
                    await isNetworkCorrect(137, _smartAccount.address);

                    setSelectedFromNetwork({
                        key: "Polygon",
                        chainName: chainName,
                        chainId: "137",
                        icon: polygon,
                    })

                } else if (chainName == "arbitrum") {
                    await switchChain?.(42161);
                    const _smartAccount = await login(42161);
                    // @ts-ignore
                    await isNetworkCorrect(42161, _smartAccount.address);

                    setSelectedFromNetwork({
                        key: "Arbitrum",
                        chainName: chainName,
                        chainId: "42161",
                        icon: arbitrum,
                    })

                } else if (chainName == "avalanche") {
                    await switchChain(43114);
                    const _smartAccount = await login(43114);
                    // @ts-ignore
                    await isNetworkCorrect(43114, _smartAccount.address);

                    setSelectedFromNetwork({
                        key: "Avalanche",
                        chainName: chainName,
                        chainId: "43114",
                        icon: avalanche,
                    })

                } else if (chainName == "optimism") {
                    await switchChain?.(10);
                    const _smartAccount = await login(10);
                    // @ts-ignore
                    await isNetworkCorrect(10, _smartAccount.address);

                    setSelectedFromNetwork({
                        key: "Optimism",
                        chainName: chainName,
                        chainId: "10",
                        icon: optimism,
                    })
                    
                } else if (chainName == "ethereum") {
                    await switchChain(1);
                    const _smartAccount = await login(1);
                    // @ts-ignore
                    await isNetworkCorrect(1, _smartAccount.address);

                    setSelectedFromNetwork({
                        key: "Ethereum",
                        chainName: chainName,
                        chainId: "1",
                        icon: ethereum,
                    })

                } else if (chainName == "base") {
                    await switchChain?.(8453);
                    const _smartAccount = await login(8453);
                    // @ts-ignore
                    await isNetworkCorrect(8453, _smartAccount.address);

                    setSelectedFromNetwork({
                        key: "Base",
                        chainName: chainName,
                        chainId: "8453",
                        icon: base,
                    })
                }
            } else {
                if (chain) {
                    const _smartAccount = await login(chain?.chainId);

                    setSelectedFromNetwork({
                        key: chain?.chain,
                        chainName: chain?.slug,
                        chainId: chain?.chainId.toString(),
                        icon: NetworkLogoByChainId[chain?.chainId.toString()],
                    })

                    // @ts-ignore
                    await isNetworkCorrect(chain?.chainId, _smartAccount.address);
                }
            }
        } catch (error: any) {
            console.log("changeChain-error", error);
        }
    }

    const switchOnSpecificChain = async (chainName: string) => {
        try {
            setLoading(true);
            setSmartAccount(null);
            await changeChain(chainName);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.log("switchToChain-error: ", error);
            return 0;
        }
    }

    return useMutation(switchOnSpecificChain);
}
