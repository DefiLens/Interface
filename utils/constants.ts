import { MAINNET_INFURA } from "./keys"

export const implementation_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

export const _functionType = 1
export const _nonce = 1

// export const polygonUSDTAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
// export const polygonUSDCAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
// export const polygonDAIAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
// export const avaxUSDTAddress = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7" // avax mainnet usdt
// export const avaxUSDCAddress = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
// export const arbitrumUSDCAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
// export const polygonStargateRouter = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd"
// export const ChainPingToContractAddressForAvax = "0x6FE8e3E0c47043f136640dF7972C1e3F144B807F" // CHainPing Contract Address on Avalanche Network
// export const ChainPingToContractAddressForArbitrum = "0xBA821135197bB2614F5Bd8943b5d1607288DC60d"

export const contractDataByNetwork = [
    {
        // avax stargate chainId
        106: {
            "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
                methodNames: ["repay", "supply"],
                amountFieldIndex: [1, 1],
                contractName: "AAVE Lending POOL-V3",
                network: "Avalanche",
            },
        },
    },
    {
        110: {
            "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
                methodNames: ["repay", "repay", "supply", "supply",],
                amountFieldIndex: [-1, 1, 1, -1],
                contractName: "AAVE Lending POOL-V3",
                network: "Arbitrum",
            },
        },
    },
    {
        111: {
            "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
                methodNames: ["repay", "repay", "supply", "supply",],
                amountFieldIndex: [-1, 1, 1, -1],
                contractName: "AAVE Lending POOL-V3",
                network: "Optimism",
            },
        },
    },
    {
        101: {
            "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2": {
                methodNames: ["repay", "supply"],
                amountFieldIndex: [1, 1],
                contractName: "AAVE Lending POOL-V3",
                network: "Ethereum",
            },
        },
    },
    {
        109: {
            "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
                methodNames: ["repay", "supply",],
                amountFieldIndex: [1, 1],
                contractName: "AAVE Lending POOL-V3",
                network: "Polygon",
            },
        },
    }
]

export const contractsDetails = {
    '109': { // Polygon
        contractAddresses: [
            {
                contractName: "AAVE Lending POOL-V3",
                contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            }
        ],
        USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        stargateRouter: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
        rpcURL: `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`
    },
    '106': { // Avalanche
        contractAddresses: [
            {
                contractName: "AAVE Lending POOL-V3",
                contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            }
        ],
        USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        ChainPing: "0x6FE8e3E0c47043f136640dF7972C1e3F144B807F",
        stargateRouter: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
        rpcURL: `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`
    },
    '110': { // Arbitrum
        contractAddresses: [
            {
                contractName: "AAVE Lending POOL-V3",
                contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            }
        ],
        USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        ChainPing: "0xBA821135197bB2614F5Bd8943b5d1607288DC60d",
        stargateRouter: "0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614",
        rpcURL: `https://arbitrum-mainnet.infura.io/v3/${MAINNET_INFURA}`
    },
    '111': { // Optimism
        contractAddresses: [
            {
                contractName: "AAVE Lending POOL-V3",
                contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            }
        ],
        USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        ChainPing: "0x934E5421D4ce678ae4c4B136306Fbee91bfDBbC8",
        stargateRouter: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
        rpcURL: `https://optimism-mainnet.infura.io/v3/${MAINNET_INFURA}`
    },
    '101': { // ETHERTEUM
        contractAddresses: [
            {
                contractName: "AAVE Lending POOL-V3",
                contractAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
            }
        ],
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        // ChainPing: "0xBA821135197bB2614F5Bd8943b5d1607288DC60d",
        stargateRouter: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
        rpcURL: `https://mainnet.infura.io/v3/${MAINNET_INFURA}`
    }
}