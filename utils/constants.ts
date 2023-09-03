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
} from "./keys";

export const implementation_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

export const _functionType = 1;
export const _nonce = 1;
// export const netlifyNodeURL = "http://localhost:8888/.netlify/functions/server"
export const netlifyNodeURL = NETLIFY_NODE_URL;

interface Tokens {
    [tokenName: string]: string;
}

export const fetchNetworkDataURL = `${netlifyNodeURL}/common/getNetworkAndContractData`;
export const fetchContractMetadataURL = `${netlifyNodeURL}/common/getContractMetaData`;

export const methodWithApi = {
    "109": {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
        "0xF25212E676D1F7F89Cd72fFEe66158f541246445": {
            supply: `${netlifyNodeURL}/compound/109/compound/supply`,
        },
    },
    "106": {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
        "0x8F9b2A7Ae089AA01636996eBAf276f48feFDb916": {
            deposit: `${netlifyNodeURL}/vector/106/vectorFinance/deposit`,
        },
        "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C": {
            mint: `${netlifyNodeURL}/benqi/106/benqi/mint`,
        },
    },
    "110": {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
    },
    "111": {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
        "0xEC8FEa79026FfEd168cCf5C627c7f486D77b765F": {
            mint: `${netlifyNodeURL}/sonne/111/sonneFinance/mint`,
        },
        "0x81C9A7B55A4df39A9B7B5F781ec0e53539694873": {
            deposit: `${netlifyNodeURL}/exactly/111/exactly/deposit`,
        },
    },
    "101": {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
    },
    "184": {
        "0x8184285DfaB372201AFb8B5d6D4718467179E33d": {
            mint: `${netlifyNodeURL}/swirllend/184/swirllend/mint/`,
        },
    },
};

export const paymasterURLs = {
    "137": `https://paymaster.biconomy.io/api/v1/137/${POLYGON_BICONOMY_AA_KEY}`,
    "43114": `https://paymaster.biconomy.io/api/v1/43114/${AVALANCHE_BICONOMY_AA_KEY}`,
    "42161": `https://paymaster.biconomy.io/api/v1/42161/${ARBITRUM_ETHERSCAN_API_KEY}`,
    "10": `https://paymaster.biconomy.io/api/v1/10/${OPTIMISM_BICONOMY_AA_KEY}`,
    "1": `https://paymaster.biconomy.io/api/v1/1/${ETHEREUM_BICONOMY_AA_KEY}`,
    "8453": `https://paymaster.biconomy.io/api/v1/8453/${BASE_BICONOMY_AA_KEY}`,
};

export const bundlerURLs = {
    "137": `https://bundler.biconomy.io/api/v2/137/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
    "43114": `https://bundler.biconomy.io/api/v2/43114/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
    "42161": `https://bundler.biconomy.io/api/v2/42161/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
    "10": `https://bundler.biconomy.io/api/v2/10/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
    "1": `https://bundler.biconomy.io/api/v2/1/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
    "8453": `https://bundler.biconomy.io/api/v2/8453/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
};

export const rpscURLS = {
    "137": `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    "43114": `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    "42161": `https://arbitrum-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    "10": `https://optimism-mainnet.infura.io/v3/${MAINNET_INFURA}`,
    "1": `https://mainnet.infura.io/v3/${MAINNET_INFURA}`,
    "8453": `https://mainnet.base.org/`,
};

export const NetworkNameByChainId = {
    "137": "polygon",
    "43114": "avalanche",
    "42161": "arbitrum",
    "10": "optimism",
    "1": "ethereum",
    "8453": "base",
};

export const NetworkNameByStargateChainId = {
    "109": "Polygon",
    "106": "Avalanche",
    "110": "Arbitrum",
    "111": "Optimism",
    "101": "Ethereum",
    "184": "Base",
};

export const gasFeesNames = {
    polygon: "polygon",
    avalanche: "avax",
    arbitrum: "eth",
    optimism: "eth",
    ethereum: "eth",
    base: "eth",
};

export const gasFeesNamesByChainId = {
    "109": "polygon",
    "106": "avax",
    "110": "eth",
    "111": "eth",
    "101": "eth",
    "184": "eth",
};

export const richAddressByChainId = {
    "109": "0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245",
    "106": "0x3A2434c698f8D79af1f5A9e43013157ca8B11a66",
    "110": "0xB38e8c17e38363aF6EbdCb3dAE12e0243582891D",
    "111": "0xf89d7b9c864f589bbF53a82105107622B35EaA40",
    "101": "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
    "184": "0x76db18f9FBA2F757530E8bae30D0DB5B937c5b98",
};


export const tokensByNetwork: Record<string, Tokens> = {
    "109": {
        usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    "106": {
        usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    },
    "110": {
        usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    "111": {
        usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    "101": {
        usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    "184": {
        usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    },
};

// Dex
export const UniversalRouter = "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5"; // polygon
export const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

export const protocolByNetwork = {
    aaveV2: [
        "aUSDC",
        "aUSDT",
        "aDAI",
        "aWETH",
        "aWMATIC",
        "aAAVE",
        "aWBTC",
    ],
    aaveV3: [
        "aUSDCv3",
        "aUSDTv3",
        "aDAIv3",
        "aWETHv3",
        "aWMATICv3",
        "aAAVEv3",
        "aWBTCv3",
        "aBALv3",
    ],
    compoundV3: [
        'cUSDC'
    ],
    dForce: [
        'dForceUSDC'
    ]
}

export const tokenAddressByProtocol = {
    aaveV2: {
        "aUSDC": "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
        "aUSDT": "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
        "aDAI": "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
        "aWETH": "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390",
        "aWMATIC": "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
        "aAAVE": "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360",
        "aWBTC": "0x5c2ed810328349100A66B82b78a1791B101C9D61",
    },
    aaveV3: {
        "aUSDCv3": "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
        "aUSDTv3": "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
        "aDAIv3": "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
        "aWETHv3": "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
        "aWMATICv3": "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
        "aAAVEv3": "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
        "aWBTCv3": "0x078f358208685046a11C85e8ad32895DED33A249",
        "aBALv3": "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692"
    },
    compoundV3: {
        'cUSDC': "0xF25212E676D1F7F89Cd72fFEe66158f541246445"
    },
    dForce: {
        'dForceUSDC': '0x5268b3c4afb0860D365a093C184985FCFcb65234'
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

export const buttonStyle =
    "bg-primary-600 hover:bg-primary-700 py-1 px-5 rounded-lg text-primary-100 font-medium border-b-4 border-primary-800 hover:border-primary-900 transition duration-300";

export const inputContainer = "w-full relative float-label-input shadow-md rounded-md";

export const inputBoxStyle =
    "w-full bg-white focus:outline-none focus:shadow-outline border-2  rounded-md p-2 block appearance-none leading-normal focus:border-primary-950";

export const inputLabelStyle =
    "absolute top-2 left-0 text-secondary-800 text-md pointer-events-none rounded-full transition duration-200 ease-in-outbg-white px-3";

export const selectContainer =
    "w-full relative border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md";

export const selectBoxStyle = "appearance-none w-full p-2 bg-white rounded-md";

export const selectAppearanceStyle =
    "pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-3 text-secondary-500 border-l-2";
