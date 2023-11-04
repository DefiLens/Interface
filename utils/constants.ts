import { BigNumber } from "ethers";
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
import { arbitrum, avalanche, base, compoundV3, ethereum, optimism, polygon, aave, dforce } from "../assets/images";

export const BIG_ZERO = BigNumber.from(0);

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

export const NavigationList = [
    {
      title: "Cross Chain",
      route: '/cross-chain-defi',
    },
    {
      title: "Batching",
      route: '/batching-transactions',
    },
    // {
    //   title: "Swap",
    //   route: '/swap',
    // },
    {
      title: "Trade",
      route: '/trade',
    },
];

export const NETWORK_LIST = [
    {
        key: "Polygon",
        chainName: "polygon",
        chainId: "137",
        icon: polygon,
    },
    {
        key: "Arbitrum",
        chainName: "arbitrum",
        chainId: "42161",
        icon: arbitrum,
    },
    {
        key: "Avalanche",
        chainName: "avalanche",
        chainId: "43114",
        icon: avalanche,
    },
    {
        key: "Optimism",
        chainName: "optimism",
        chainId: "10",
        icon: optimism,
    },
    {
        key: "Ethereum",
        chainName: "ethereum",
        chainId: "1",
        icon: ethereum,
    },
    {
        key: "Base",
        chainName: "base",
        chainId: "8453",
        icon: base,
    },
];

export const methodWithApi = {
    "109": {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
        "0xF25212E676D1F7F89Cd72fFEe66158f541246445": {
            supply: `${netlifyNodeURL}/compound/compoundv3/supply`,
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
        "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5": {
            supply: `${netlifyNodeURL}/aave/aavev3/supply`,
        },
        "0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf": {
            supply: `${netlifyNodeURL}/compound/compoundv3/supply`,
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

export const NetworkLogoByChainId = {
    "137": polygon,
    "43114": avalanche,
    "42161": arbitrum,
    "10": optimism,
    "1": ethereum,
    "8453": base,
};

export const NetworkLogoByNetworkName = {
    "polygon": polygon,
    "avalanche": avalanche,
    "arbitrum": arbitrum,
    "optimism": optimism,
    "ethereum": ethereum,
    "base": base,
};

export const ProtocolLogoByProtocolName = {
    "aaveV2": aave,
    "aaveV3": aave,
    "compoundV3": compoundV3,
    "dForce": dforce,
    "erc20": compoundV3,
};

export const NetworkNameByStargateChainId = {
    "109": "Polygon",
    "106": "Avalanche",
    "110": "Arbitrum",
    "111": "Optimism",
    "101": "Ethereum",
    "184": "Base",
};

export const chainIdByStargateChainId = {
    "109": "137",
    "106": "43114",
    "110": "42161",
    "111": "10",
    "101": "1",
    "184": "8453",
};

export const StargateChainIdBychainId = {
    "137": "109",
    "43114": "106",
    "42161": "110",
    "10": "111",
    "1": "101",
    "8453": "184",
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
    "109": "matic",
    "106": "avax",
    "110": "eth",
    "111": "eth",
    "101": "eth",
    "184": "eth",
};

export const gasFeesNamesByMainChainId = {
    "137": "matic",
    "43114": "avax",
    "42161": "eth",
    "10": "eth",
    "1": "eth",
    "8453": "eth",
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

export const uniswapSwapRouterByChainId = {
    "137": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "43114": "",
    "42161": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "10": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "1": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "8453": "0x2626664c2603336E57B271c5C0b26F421741e481",
};


// export const protocolNames = {
//     "base": {
//         key: ["aaveV3", "compoundV3", "erc20"],
//         value: ["AAVE V3", "Compound V3", "ERC20"],
//     },
//     "polygon": {
//         key: ["aaveV2", "aaveV3", "compoundV3", "dForce", "erc20"],
//         value: ["AAVE V2", "AAVE V3", "Compound V3", "dForce", "ERC20"],
//     }
// };


// export const protocolByNetwork = {
//     base: {
//         aaveV3: ["aBasUSDbC", "aBasWETH"],
//         compoundV3: ["cUSDbCv3"],
//     },
//     polygon: {
//         aaveV2: ["aUSDC", "aUSDT", "aDAI", "aWETH", "aWMATIC", "aAAVE", "aWBTC"],
//         aaveV3: ["aUSDCv3", "aUSDTv3", "aDAIv3", "aWETHv3", "aWMATICv3", "aAAVEv3", "aWBTCv3", "aBALv3"],
//         compoundV3: ["cUSDC"],
//         dForce: ["dForceUSDC"],
//     }
// };

export const protocolNames = {
    "polygon": {
        key: [
            {
                name: "aaveV2",
                icon: aave,
            },
            {
                name: "aaveV3",
                icon: aave,
            },
            {
                name: "compoundV3",
                icon: compoundV3,
            },
            {
                name: "dForce",
                icon: dforce,
            },
            {
                name: "erc20",
                icon: polygon,
            },
        ],
        value: ["AAVE V2", "AAVE V3", "Compound V3", "dForce", "ERC20"],
    },
    "avalanche": {
        key: [
            {
                name: "aaveV3",
                icon: aave,
            },
            {
                name: "erc20",
                icon: avalanche,
            },
        ],
        value: ["AAVE V3", "ERC20"],
    },
    "arbitrum": {
        key: [
            {
                name: "aaveV3",
                icon: aave,
            },
            {
                name: "compoundV3",
                icon: compoundV3,
            },
            {
                name: "erc20",
                icon: arbitrum,
            },
        ],
        value: ["AAVE V3", "Compound V3", "ERC20"],
    },
    "optimism": {
        key: [
            {
                name: "aaveV3",
                icon: aave,
            },
            {
                name: "erc20",
                icon: optimism,
            },
        ],
        value: ["AAVE V3", "ERC20"],
    },
    "base": {
        key: [
            {
                name: "aaveV3",
                icon: aave,
            },
            {
                name: "compoundV3",
                icon: compoundV3,
            },
            {
                name: "erc20",
                icon: base,
            },
        ],
        value: ["AAVE V3", "Compound V3", "ERC20"],
    },
};

export const protocolByNetwork = {
    polygon: {
        aaveV2: [
            {
                name: "aUSDC",
                icon: ethereum,
            },
            {
                name: "aUSDT",
                icon: optimism,
            },
            {
                name: "aDAI",
                icon: avalanche,
            },
            {
                name: "aWETH",
                icon: ethereum,
            },
            {
                name: "aWMATIC",
                icon: optimism,
            },
            {
                name: "aAAVE",
                icon: avalanche,
            },
            {
                name: "aWBTC",
                icon: optimism,
            },
        ],
        aaveV3: [
            {
                name: "aUSDCv3",
                icon: ethereum,
            },
            {
                name: "aUSDTv3",
                icon: optimism,
            },
            {
                name: "aDAIv3",
                icon: avalanche,
            },
            {
                name: "aWETHv3",
                icon: ethereum,
            },
            {
                name: "aWMATICv3",
                icon: optimism,
            },
            {
                name: "aAAVEv3",
                icon: avalanche,
            },
            {
                name: "aWBTCv3",
                icon: ethereum,
            },
            {
                name: "aBALv3",
                icon: optimism,
            },
        ],
        compoundV3: [
            {
                name: "cUSDC",
                icon: ethereum,
            }
        ],
        dForce: [
            {
                name: "dForceUSDC",
                icon: optimism,
            }
        ],
    },
    avalanche: {
        aaveV3: [
            {
                name: "aUSDT",
                icon: avalanche,
            },
            {
                name: "aUSDC",
                icon: ethereum,
            },
            {
                name: "aWAVAX",
                icon: avalanche,
            },
            {
                name: "aBTCb",
                icon: ethereum,
            },
            {
                name: "aWETHe",
                icon: avalanche,
            },
            {
                name: "aWBTCe",
                icon: ethereum,
            },
            {
                name: "asAVAX",
                icon: avalanche,
            },
            {
                name: "aLINKe",
                icon: ethereum,
            },
            {
                name: "aDAIe",
                icon: avalanche,
            },
            {
                name: "aAAVEe",
                icon: ethereum,
            },
            {
                name: "aMAI",
                icon: avalanche,
            },
            {
                name: "aFRAX",
                icon: ethereum,
            }
        ],
    },
    arbitrum: {
        aaveV3: [
            {
                name: "aWETH",
                icon: avalanche,
            },
            {
                name: "aUSDC",
                icon: avalanche,
            },
            {
                name: "aUSDCe",
                icon: avalanche,
            },
            {
                name: "awstETH",
                icon: avalanche,
            },
            {
                name: "aWBTC",
                icon: avalanche,
            },
            {
                name: "aUSDT",
                icon: avalanche,
            },
            {
                name: "aARB",
                icon: avalanche,
            },
            {
                name: "aLINK",
                icon: avalanche,
            },
            {
                name: "aDAI",
                icon: avalanche,
            },
            {
                name: "arETH",
                icon: avalanche,
            },
            {
                name: "aLUSD",
                icon: avalanche,
            },
            {
                name: "aAAVE",
                icon: avalanche,
            },
            {
                name: "aFRAX",
                icon: avalanche,
            },
            {
                name: "aEURS",
                icon: avalanche,
            },
        ],
        compoundV3: [
            {
                name: "cUSDCev3",
                icon: arbitrum,
            },
            {
                name: "cUSDCv3",
                icon: arbitrum,
            }
        ],
    },
    optimism: {
        aaveV3: [
            {
                name: "aDAI",
                icon: optimism,
            },
            {
                name: "aOP",
                icon: optimism,
            },
            {
                name: "aWETH",
                icon: optimism,
            },
            {
                name: "awstETH",
                icon: optimism,
            },
            {
                name: "aWBTC",
                icon: optimism,
            },
            {
                name: "aUSDC",
                icon: optimism,
            },
            {
                name: "aUSDT",
                icon: optimism,
            },
            {
                name: "aLINK",
                icon: optimism,
            },
            {
                name: "asUSD",
                icon: optimism,
            },
            {
                name: "arETH",
                icon: optimism,
            },
            {
                name: "aAAVE",
                icon: optimism,
            },
            {
                name: "aLUSD",
                icon: optimism,
            },
        ]
    },
    base: {
        aaveV3: [
            {
                name: "aBasUSDbC",
                icon: avalanche,
            },
            {
                name: "aBasWETH",
                icon: ethereum,
            }
        ],
        compoundV3: [
            {
                name: "cUSDbCv3",
                icon: optimism,
            }
        ],
    },
};

export const tokenAddressByProtocol = {
    polygon: {
        aaveV2: {
            aUSDC: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
            aUSDT: "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
            aDAI: "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
            aWETH: "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390",
            aWMATIC: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
            aAAVE: "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360",
            aWBTC: "0x5c2ed810328349100A66B82b78a1791B101C9D61",
        },
        aaveV3: {
            aUSDCv3: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            aUSDTv3: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aDAIv3: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            aWETHv3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            aWMATICv3: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
            aAAVEv3: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aWBTCv3: "0x078f358208685046a11C85e8ad32895DED33A249",
            aBALv3: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
        },
        compoundV3: {
            cUSDC: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
        },
        dForce: {
            dForceUSDC: "0x5268b3c4afb0860D365a093C184985FCFcb65234",
        },
    },
    avalanche: {
        aaveV3: {
            aUSDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aUSDC: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            aWAVAX: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
            aBTCb: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
            aWETHe: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            aWBTCe: "0x078f358208685046a11C85e8ad32895DED33A249",
            asAVAX: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf",
            aLINKe: "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530",
            aDAIe: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            aAAVEe: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aMAI: "0x8Eb270e296023E9D92081fdF967dDd7878724424",
            aFRAX: "0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA",
        }
    },
    arbitrum: {
        aaveV3: {
            aWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            aUSDC: "0x724dc807b04555b71ed48a6896b6F41593b8C637",
            aUSDCe: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            awstETH: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf",
            aWBTC: "0x078f358208685046a11C85e8ad32895DED33A249",
            aUSDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aARB: "0x6533afac2E7BCCB20dca161449A13A32D391fb00",
            aLINK: "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530",
            aDAI: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            arETH: "0x8Eb270e296023E9D92081fdF967dDd7878724424",
            aLUSD: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
            aAAVE: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aFRAX: "0x38d693cE1dF5AaDF7bC62595A37D667aD57922e5",
            aEURS: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
        },
        compoundV3: {
            cUSDCev3: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA",
            cUSDCv3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
        }
    },
    optimism: {
        aDAI: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
        aOP: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf",
        aWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
        awstETH: "0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA",
        aWBTC: "0x078f358208685046a11C85e8ad32895DED33A249",
        aUSDC: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
        aUSDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
        aLINK: "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530",
        asUSD: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
        arETH: "0x724dc807b04555b71ed48a6896b6F41593b8C637",
        aAAVE: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
        aLUSD: "0x8Eb270e296023E9D92081fdF967dDd7878724424",
    },
    ethereum: {

    },
    base: {
        aaveV3: {
            aBasUSDbC: "0x0a1d576f3eFeF75b330424287a95A366e8281D54",
            aBasWETH: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7"
        },
        compoundV3: {
            cUSDbCv3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf"
        }
    },
};

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
