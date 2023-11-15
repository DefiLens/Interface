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
import {
    arbitrum,
    avalanche,
    base,
    compoundV3,
    ethereum,
    optimism,
    polygon,
    aavev2,
    aavev3,
    dforce,
} from "../assets/images";

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
        title: "Home",
        route: "/",
    },
    {
        title: "Trade",
        route: "/trade",
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

export const ChainIdDetails = {
    "137": {
        'paymasterURL': `https://paymaster.biconomy.io/api/v1/137/${POLYGON_BICONOMY_AA_KEY}`,
        'bundlerURL': `https://bundler.biconomy.io/api/v2/137/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        'rpcURL': `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        'networkName': "polygon",
        'networkLogo': polygon,
        'gasFeesName': 'polygon',
        'stargateChainId': '109',


    },
    "43114": {
        'paymasterURL': `https://paymaster.biconomy.io/api/v1/43114/${AVALANCHE_BICONOMY_AA_KEY}`,
        'bundlerURL': `https://bundler.biconomy.io/api/v2/43114/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        'rpcURL': `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        'networkName': "avalanche",
        'networkLogo': avalanche,
        'gasFeesName': 'avax',
        'stargateChainId': '106',

    },
    "42161": {
        'paymasterURL': `https://paymaster.biconomy.io/api/v1/42161/${ARBITRUM_ETHERSCAN_API_KEY}`,
        'bundlerURL': `https://bundler.biconomy.io/api/v2/42161/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        'rpcURL': `https://arbitrum-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        'networkName': "arbitrum",
        'networkLogo': arbitrum,
        'gasFeesName': 'eth',
        'stargateChainId': '110',

    },
    "10": {
        'paymasterURL': `https://paymaster.biconomy.io/api/v1/10/${OPTIMISM_BICONOMY_AA_KEY}`,
        'bundlerURL': `https://bundler.biconomy.io/api/v2/10/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        'rpcURL': `https://optimism-mainnet.infura.io/v3/${MAINNET_INFURA}`,
        'networkName': "optimism",
        'networkLogo': optimism,
        'gasFeesName': 'eth',
        'stargateChainId': '111',

    },
    "1": {
        'paymasterURL': `https://paymaster.biconomy.io/api/v1/1/${ETHEREUM_BICONOMY_AA_KEY}`,
        'bundlerURL': `https://bundler.biconomy.io/api/v2/1/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        'rpcURL': `https://mainnet.infura.io/v3/${MAINNET_INFURA}`,
        'networkName': "ethereum",
        'networkLogo': ethereum,
        'gasFeesName': 'eth',
        'stargateChainId': '101',

    },
    "8453": {
        'paymasterURL': `https://paymaster.biconomy.io/api/v1/8453/${BASE_BICONOMY_AA_KEY}`,
        'bundlerURL': `https://bundler.biconomy.io/api/v2/8453/${BICONOMY_MAINNET_BUNDLAR_KEY}`,
        'rpcURL': `https://mainnet.base.org/`,
        'networkName': "base",
        'networkLogo': base,
        'gasFeesName': 'eth',
        'stargateChainId': '184',

    },
}

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

// not used anywhere
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
    polygon: polygon,
    avalanche: avalanche,
    arbitrum: arbitrum,
    optimism: optimism,
    ethereum: ethereum,
    base: base,
};

export const ProtocolLogoByProtocolName = {
    aaveV2: aavev2,
    aaveV3: aavev3,
    compoundV3: compoundV3,
    dForce: dforce,
    erc20: compoundV3,
};

// not used anywhere indirectly
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

export const gasFeesNamesByMainChainId = {
    "137": "matic",
    "43114": "avax",
    "42161": "eth",
    "10": "eth",
    "1": "eth",
    "8453": "eth",
};

// not used anywhere indirectly
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

export const uniswapSwapRouterByChainId = {
    "137": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "43114": "",
    "42161": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "10": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "1": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "8453": "0x2626664c2603336E57B271c5C0b26F421741e481",
};

export const protocolNames = {
    polygon: {
        key: [
            {
                name: "aaveV2",
                icon: aavev2,
            },
            {
                name: "aaveV3",
                icon: aavev3,
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
    avalanche: {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
            },
            {
                name: "erc20",
                icon: avalanche,
            },
        ],
        value: ["AAVE V3", "ERC20"],
    },
    arbitrum: {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
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
    optimism: {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
            },
            {
                name: "erc20",
                icon: optimism,
            },
        ],
        value: ["AAVE V3", "ERC20"],
    },
    base: {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
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

export const tokensByProtocol = {
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
            },
        ],
        dForce: [
            {
                name: "dForceUSDC",
                icon: optimism,
            },
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
            },
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
            },
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
        ],
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
            },
        ],
        compoundV3: [
            {
                name: "cUSDbCv3",
                icon: optimism,
            },
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
        },
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
        },
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
    ethereum: {},
    base: {
        aaveV3: {
            aBasUSDbC: "0x0a1d576f3eFeF75b330424287a95A366e8281D54",
            aBasWETH: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
        },
        compoundV3: {
            cUSDbCv3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
        },
    },
};

export const ReactSelectStyles = {
    control: (styles: any) => ({
        ...styles,
        border: "2px solid #293347",
        background: "#15223D",
        color: "#cccccc !important",
        padding: "5px",
        borderRadius: "10px",
        outline: "none",
        boxShadow: styles.isFocused ? 0 : 0,
        "&:hover": {
            boxShadow: styles.isFocused ? 0 : 0,
        },
    }),
    placeholder: (styles: any) => ({
        ...styles,
        color: "#ffffff !important",
    }),
};

export const buttonStyle =
    "bg-button-100 hover:bg-primary-700 py-1 px-5 rounded-lg text-primary-100 font-medium border-b-4 border-primary-800 hover:border-primary-900 transition duration-300";

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
