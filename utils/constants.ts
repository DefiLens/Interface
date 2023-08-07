import { MAINNET_INFURA } from "./keys"

export const implementation_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

export const _functionType = 1
export const _nonce = 1
export const nodeLocalUrl = "http://localhost:3000"

interface Tokens {
    [tokenName: string]: string;
}

export const fetchNetworkDataURL = `${nodeLocalUrl}/common/getNetworkAndContractData`
export const fetchContractMetadataURL = `${nodeLocalUrl}/common/getContractMetaData`

export const methodWithApi = {
    '109': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD" : {
            'supply': `${nodeLocalUrl}/aave/aavev3/supply`
        },
        "0xF25212E676D1F7F89Cd72fFEe66158f541246445" : {
            'supply': `${nodeLocalUrl}/compound/109/compound/supply`
        },
    },
    '106': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD" : {
            'supply': `${nodeLocalUrl}/aave/aavev3/supply`
        },
        "0x8F9b2A7Ae089AA01636996eBAf276f48feFDb916" : {
            'deposit': `${nodeLocalUrl}/vector/106/vectorFinance/deposit`
        },
        "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C" : {
            'mint': `${nodeLocalUrl}/benqi/106/benqi/mint`
        }
    },
    '110': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD" : {
            'supply': `${nodeLocalUrl}/aave/aavev3/supply`
        },
    },
    '111': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD" : {
            'supply': `${nodeLocalUrl}/aave/aavev3/supply`
        },
        "0xEC8FEa79026FfEd168cCf5C627c7f486D77b765F" : {
            'mint': `${nodeLocalUrl}/sonne/111/sonneFinance/mint`
        },
        "0x81C9A7B55A4df39A9B7B5F781ec0e53539694873" : {
            'deposit': `${nodeLocalUrl}/exactly/111/exactly/deposit`
        },
    },
    '101': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD" : {
            'supply': `${nodeLocalUrl}/aave/aavev3/supply`
        },
    },
}

export const rpscURLS = {
    '109': `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    '106': `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    '110': `https://arbitrum-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    '111': `https://optimism-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    '101': `https://mainnet.infura.io/v3/${MAINNET_INFURA}`,
}

export const NetworkNameByChainId = {
    '109': 'Polygon',
    '106': 'Avalanche',
    '110': 'Arbitrum',
    '111': 'Optimism',
    '101': 'Ethereum'
}

export const tokensByNetwork: Record<string, Tokens> = {
    '109':  {
        usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    },
    '106':  {
        usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    },
    '110':  {
        usdc: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    },
    '111':  {
        usdc: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    },
    '101':  {
        usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    }

}

// export const contractDataByNetwork = [
//     {
//         109: {
//             "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
//                 methodNames: ["supply",],
//                 // methodNames: ["repay", "supply",],
//                 amountFieldIndex: [1],
//                 contractName: "Polygon: AAVE Lending POOL-V3",
//                 network: "Polygon",
//             },
//         },
//     },
//     {
//         106: {
//             "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
//                 methodNames: ["supply"],
//                 amountFieldIndex: [1],
//                 contractName: "Avalanche: AAVE Lending POOL-V3",
//                 network: "Avalanche",
//             },
//         },
//     },
//     {
//         110: {
//             "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
//                 methodNames: ["supply", "supply"],
//                 amountFieldIndex: [1, -1],
//                 // methodNames: ["repay", "repay", "supply", "supply",],
//                 // amountFieldIndex: [-1, 1, 1, -1],
//                 contractName: "Arbitrum: AAVE Lending POOL-V3",
//                 network: "Arbitrum",
//             },
//         },
//     },
//     {
//         111: {
//             "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
//                 methodNames: ["supply", "supply"],
//                 amountFieldIndex: [1, -1],
//                 // methodNames: ["repay", "repay", "supply", "supply",],
//                 // amountFieldIndex: [-1, 1, 1, -1],
//                 contractName: "Optimism: AAVE Lending POOL-V3",
//                 network: "Optimism",
//             },
//         },
//     },
//     {
//         101: {
//             "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2": {
//                 methodNames: ["supply"],
//                 amountFieldIndex: [1],
//                 // methodNames: ["repay", "supply"],
//                 // amountFieldIndex: [1, 1],
//                 contractName: "Ethereum: AAVE Lending POOL-V3",
//                 network: "Ethereum",
//             },
//         },
//     },
// ]

// export const allNetworkDetails = {
//     '109': { // Polygon
//         contractAddresses: [
//             {
//                 contractName: "Polygon: AAVE Lending POOL-V3",
//                 contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
//             }
//         ],
//         USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
//         stargateRouter: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
//         rpcURL: `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`,
//         network: "Polygon"
//     },
//     '106': { // Avalanche
//         contractAddresses: [
//             {
//                 contractName: "Avalanche: AAVE Lending POOL-V3",
//                 contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
//             }
//         ],
//         USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
//         ChainPing: "0x6FE8e3E0c47043f136640dF7972C1e3F144B807F",
//         stargateRouter: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
//         rpcURL: `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`,
//         network: "Avalanche"
//     },
//     '110': { // Arbitrum
//         contractAddresses: [
//             {
//                 contractName: "Arbitrum: AAVE Lending POOL-V3",
//                 contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
//             }
//         ],
//         USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
//         ChainPing: "0xBA821135197bB2614F5Bd8943b5d1607288DC60d",
//         stargateRouter: "0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614",
//         rpcURL: `https://arbitrum-mainnet.infura.io/v3/${MAINNET_INFURA}`,
//         network: "Arbitrum"
//     },
//     '111': { // Optimism
//         contractAddresses: [
//             {
//                 contractName: "Optimism: AAVE Lending POOL-V3",
//                 contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
//             }
//         ],
//         USDC: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
//         ChainPing: "0x934E5421D4ce678ae4c4B136306Fbee91bfDBbC8",
//         stargateRouter: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
//         rpcURL: `https://optimism-mainnet.infura.io/v3/${MAINNET_INFURA}`,
//         network: "Optimism"
//     },
//     '101': { // Ethereum
//         contractAddresses: [
//             {
//                 contractName: "Ethereum: AAVE Lending POOL-V3",
//                 contractAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
//             }
//         ],
//         USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
//         // ChainPing: "0xBA821135197bB2614F5Bd8943b5d1607288DC60d",
//         stargateRouter: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
//         rpcURL: `https://mainnet.infura.io/v3/${MAINNET_INFURA}`,
//         network: "Ethereum"
//     }
// }