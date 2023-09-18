import { useEffect } from "react";
import { useContext } from "react";

import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { IBundler, Bundler } from "@biconomy/bundler";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { DEFAULT_ENTRYPOINT_ADDRESS, BiconomySmartAccountConfig, BiconomySmartAccount } from "@biconomy/account";
import { useSwitchChain, useSigner, useConnect, useChain, useAddress, metamaskWallet } from "@thirdweb-dev/react";

import Header from "./Header";
import ChainContext from "../../Context/ChainContext";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { paymasterURLs, bundlerURLs } from "../../utils/constants";
import { useCalculatebalance } from "../../hooks/useCalculateBalance";

bg.config({ DECIMAL_PLACES: 5 });

const HeaderContainer: React.FC<any> = () => {

    const {
        setConnected,
        setLoading,
        smartAccount,
        setSmartAccount,
        setCurrentProvider,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        setSelectedChain,
        setSelectedChainId
    } = useContext(ChainContext);
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
                // console.log("ChainDetails: ", selectedChainId, selectedChain, chain);
                const _smartAccount = await login(chain?.chainId);
                console.log("_smartAccount_", _smartAccount);
                // @ts-ignore
                await isNetworkCorrect(chain?.chainId, _smartAccount.address);
                setSelectedChain?.(chain.slug);
                setSelectedChainId?.(chain?.chainId.toString());
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
            if (chainIds.includes(chainId)) {
                await fetchNativeBalance({ chainId: chainId, eoaAddress: address, scwAddress: smartAccountAddress });
            } else {
            }
        } catch (error) {
            console.log("isNetworkCorrect:error: ", error);
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
        // } else {
        return setupSmartAccount(chainId);
        // }
    }

    async function setupSmartAccount(chainId) {
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

    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Wallet address Copied");
    };

    const switchOnSpecificChain = async (chainName) => {
        try {
            setLoading(true);
            setSmartAccount(null);
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
            .catch(() => {
                setConnected(false);
            });
    };

    return (
        <Header 
            handleConnect={handleConnect}
            switchOnSpecificChain={switchOnSpecificChain}
        />
    );
};

export default HeaderContainer;
