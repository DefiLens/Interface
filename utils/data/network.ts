import { arbitrum, avalanche, base, ethereum, optimism, polygon } from "../../assets/images";
import {
    ARBITRUM_ETHERSCAN_API_KEY,
    AVALANCHE_BICONOMY_AA_KEY,
    BASE_BICONOMY_AA_KEY,
    BICONOMY_MAINNET_BUNDLAR_KEY,
    ETHEREUM_BICONOMY_AA_KEY,
    MAINNET_INFURA,
    NETLIFY_NODE_URL,
    OPTIMISM_BICONOMY_AA_KEY,
    POLYGON_BICONOMY_AA_KEY,
} from "./../keys";

export const NETWORK_LIST = [
    {
        key: "Polygon",
        chainName: "polygon",
        chainId: "137",
        icon: polygon,
    },
    // {
    //     key: "Arbitrum",
    //     chainName: "arbitrum",
    //     chainId: "42161",
    //     icon: arbitrum,
    // },
    // {
    //     key: "Avalanche",
    //     chainName: "avalanche",
    //     chainId: "43114",
    //     icon: avalanche,
    // },
    {
        key: "Optimism",
        chainName: "optimism",
        chainId: "10",
        icon: optimism,
    },
    // {
    //     key: "Ethereum",
    //     chainName: "ethereum",
    //     chainId: "1",
    //     icon: ethereum,
    // },
    {
        key: "Base",
        chainName: "base",
        chainId: "8453",
        icon: base,
    },
];

export const ChainIdDetails = {
    "137": {
        paymasterURL: `https://paymaster.biconomy.io/api/v1/137/${POLYGON_BICONOMY_AA_KEY}`,
        bundlerURL: `https://bundler.biconomy.io/api/v2/137/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        rpcURL: `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        networkName: "polygon",
        networkLogo: polygon,
        gasFeesName: "polygon",
        stargateChainId: "109",
    },
    "43114": {
        paymasterURL: `https://paymaster.biconomy.io/api/v1/43114/${AVALANCHE_BICONOMY_AA_KEY}`,
        bundlerURL: `https://bundler.biconomy.io/api/v2/43114/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        rpcURL: `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        networkName: "avalanche",
        networkLogo: avalanche,
        gasFeesName: "avax",
        stargateChainId: "106",
    },
    "42161": {
        paymasterURL: `https://paymaster.biconomy.io/api/v1/42161/${ARBITRUM_ETHERSCAN_API_KEY}`,
        bundlerURL: `https://bundler.biconomy.io/api/v2/42161/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        rpcURL: `https://arbitrum-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        networkName: "arbitrum",
        networkLogo: arbitrum,
        gasFeesName: "eth",
        stargateChainId: "110",
    },
    "10": {
        paymasterURL: `https://paymaster.biconomy.io/api/v1/10/${OPTIMISM_BICONOMY_AA_KEY}`,
        bundlerURL: `https://bundler.biconomy.io/api/v2/10/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        rpcURL: `https://optimism-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        networkName: "optimism",
        networkLogo: optimism,
        gasFeesName: "eth",
        stargateChainId: "111",
    },
    "1": {
        paymasterURL: `https://paymaster.biconomy.io/api/v1/1/${ETHEREUM_BICONOMY_AA_KEY}`,
        bundlerURL: `https://bundler.biconomy.io/api/v2/1/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        rpcURL: `https://mainnet.infura.io/v3/${MAINNET_INFURA}`,
        networkName: "ethereum",
        networkLogo: ethereum,
        gasFeesName: "eth",
        stargateChainId: "101",
    },
    "8453": {
        paymasterURL: `https://paymaster.biconomy.io/api/v1/8453/${BASE_BICONOMY_AA_KEY}`,
        bundlerURL: `https://bundler.biconomy.io/api/v2/8453/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        rpcURL: `https://mainnet.base.org/`,
        networkName: "base",
        networkLogo: base,
        gasFeesName: "eth",
        stargateChainId: "184",
    },
};
