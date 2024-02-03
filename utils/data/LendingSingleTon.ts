// Protocol
// native tokens
// aTokens
// aBorrowedTokens
// deposit - nativeToken balance (USDC->aUSDC)
// withdraw - aToken balance (aUSDC->USDC)
// borrow - check collateral and calculate with CR and decide (USDC)
// repay - USDC get back
// apy
// health factor
import {
    aavev2,
    aavev3,
    arbitrum,
    avalanche,
    base,
    benqi,
    compoundV3,
    dforce,
    moonwell,
    seamless,
    optimism,
    polygon,
} from "../../assets/images";
import { BigNumber as bg } from "bignumber.js";
import { polygonNativeTokens } from "./ConstantInfo/nativeTokens/PolygonNativeTokens";
import { baseNativeTokens } from "./ConstantInfo/nativeTokens/BaseNativeTokens";
import { optimismNativeTokens } from "./ConstantInfo/nativeTokens/optimismNativeTokens";
bg.config({ DECIMAL_PLACES: 10 });

export const nativeTokens = {
    "8453": baseNativeTokens,
    "137": polygonNativeTokens,
    "10": optimismNativeTokens
};

export const tokensSupported = {
    polygon: {
        aaveV3: {
            Lending: ["USDC", "USDT", "DAI", "WETH", "WMATIC", "AAVE", "WBTC", "BAL"],
            Borrow: ["USDC", "USDT", "DAI", "WETH", "WMATIC", "WBTC", "BAL"],
            Withdraw: ["aUSDCv3", "aUSDTv3", "aDAIv3", "aWETHv3", "aWMATICv3", "aAAVEv3", "aWBTCv3", "aBALv3"],
            Repay: ["USDC", "USDT", "DAI", "WETH", "WMATIC", "WBTC", "BAL"],
        },
        aaveV2: {
            Lending: ["USDC", "USDT", "DAI", "WETH", "WMATIC", "AAVE", "WBTC"],
            Borrow: ["USDC", "USDT", "DAI", "WETH", "WMATIC", "WBTC"],
            Withdraw: ["aUSDC", "aUSDT", "aDAI", "aWETH", "aWMATIC", "aAAVE", "aWBTC"],
            Repay: ["USDC", "USDT", "DAI", "WETH", "WMATIC", "WBTC"],
        },
        compoundV3: {
            Lending: [],
            Borrow: [],
            Withdraw: [],
            Repay: [],
        }
    },
    base: {
        aaveV3: {
            Lending: ["USDC", "USDbC", "WETH", "wstETH", "cbETH"],
            Borrow: ["USDC", "USDbC", "WETH", "wstETH", "cbETH"],
            Withdraw: ["aBasUSDC", "aBasUSDbC", "aBasWETH", "aBaswstETH", "aBascbETH"],
            Repay: ["USDC", "USDbC", "WETH", "wstETH", "cbETH"],
        },
    },
    optimism: {
        aaveV3: {
            Lending: ["DAI", "OP", "WETH", "wstETH", "WBTC", "USDC", "USDT", "LINK", "sUSD", "rETH", "AAVE", "LUSD",],
            Borrow: ["DAI", "OP", "WETH", "wstETH", "WBTC", "USDC", "USDT", "LINK", "sUSD", "rETH", "AAVE", "LUSD",],
            Withdraw: ["aDAI", "aOP", "aWETH", "awstETH", "aWBTC", "aUSDC", "aUSDT", "aLINK", "asUSD", "arETH", "aAAVE", "aLUSD",],
            Repay: ["DAI", "OP", "WETH", "wstETH", "WBTC", "USDC", "USDT", "LINK", "sUSD", "rETH", "AAVE", "LUSD",],
        },
    },
};

export const tokenToShare = {
    polygon: {
        aaveV3: {
            USDC: "aUSDCv3",
            USDT: "aUSDTv3",
            DAI: "aDAIv3",
            WETH: "aWETHv3",
            WMATIC: "aWMATICv3",
            AAVE: "aAAVEv3",
            WBTC: "aWBTCv3",
            BAL: "aBALv3",
        },
        aaveV2: {
            USDC: "aUSDC",
            USDT: "aUSDT",
            DAI: "aDAI",
            WETH: "aWETH",
            WMATIC: "aWMATIC",
            AAVE: "aAAVE",
            WBTC: "aWBTC",
        }
    },
    base: {
        aaveV3: {
            USDC: "aBasUSDC",
            USDbC: "aBasUSDbC",
            WETH: "aBasWETH",
            wstETH: "aBaswstETH",
            cbETH: "aBascbETH",
        },
    },
    optimism: {
        aaveV3: {
            DAI: "aDAI",
            OP: "aOP",
            WETH: "aWETH",
            wstETH: "awstETH",
            WBTC: "aWBTC",
            USDC: "aUSDC",
            USDT: "aUSDT",
            LINK: "aLINK",
            sUSD: "asUSD",
            rETH: "arETH",
            AAVE: "aAAVE",
            LUSD: "aLUSD",
        }
    }
};

export const protocolNames = {
    "137": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                // tokenList: tokensByProtocol.polygon.aaveV3,
                // tokenAddresses: tokenAddressByProtocol.polygon.aaveV3,
            },
            {
                name: "aaveV2",
                icon: aavev2,
                // tokenList: tokensByProtocol.polygon.aaveV3,
                // tokenAddresses: tokenAddressByProtocol.polygon.aaveV3,
            },
            {
                name: "erc20",
                icon: polygon,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "AAVE V2", "ERC20"],
    },
    "10": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                // tokenList: tokensByProtocol.polygon.aaveV3,
                // tokenAddresses: tokenAddressByProtocol.polygon.aaveV3,
            },
            {
                name: "erc20",
                icon: optimism,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "ERC20"],
    },
    "8453": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                // tokenList: tokensByProtocol.base.aaveV3,
                // tokenAddresses: tokenAddressByProtocol.base.aaveV3,
            },
            {
                name: "erc20",
                icon: base,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "ERC20"],
    },
};


export const protocolList = {
    137: ["aaveV3", "aaveV2"],
    10: ["aaveV3"],
    8453: ["aaveV3"],
};

export const supportedTokenDetails = {
    polygon: {
        aaveV3: {
            USDC: "1",
            USDT: "2",
            DAI: "3",
            WETH: "4",
            WMATIC: "5",
            AAVE: "6",
            WBTC: "7",
            BAL: "8",

            aUSDCv3: "1",
            aUSDTv3: "2",
            aDAIv3: "3",
            aWETHv3: "4",
            aWMATICv3: "5",
            aAAVEv3: "6",
            aWBTCv3: "7",
            aBALv3: "8",
        },
        aaveV2: {
            USDC: "1",
            USDT: "2",
            DAI: "3",
            WETH: "4",
            WMATIC: "5",
            AAVE: "6",
            WBTC: "7",

            aUSDC: "1",
            aUSDT: "2",
            aDAI: "3",
            aWETH: "4",
            aWMATIC: "5",
            aAAVE: "6",
            aWBTC: "7",
        }
    },
    base: {
        aaveV3: {
            USDC: "4",
            USDbC: "1",
            WETH: "2",
            wstETH: "6",
            cbETH: "3",

            aBasUSDC: "4",
            aBasUSDbC: "1",
            aBasWETH: "2",
            aBaswstETH: "6",
            aBascbETH: "3",
        },
    },
    optimism: {
        aaveV3: {
            DAI: "1",
            OP: "2",
            WETH: "3",
            wstETH: "4",
            WBTC: "5",
            USDC: "6",
            USDT: "7",
            LINK: "8",
            sUSD: "9",
            rETH: "10",
            AAVE: "11",
            LUSD: "12",

            aDAI: "1",
            aOP: "2",
            aWETH: "3",
            awstETH: "4",
            aWBTC: "5",
            aUSDC: "6",
            aUSDT: "7",
            aLINK: "8",
            asUSD: "9",
            arETH: "10",
            aAAVE: "11",
            aLUSD: "12",
        }
    }
};

export const abiFetcher = {
    "137": {
        aaveV3: {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            borrowAbi: "function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf)",
            repayAbi: "function repay(address asset,uint256 amount,uint256 interestRateMode,address onBehalfOf)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            borrowMethodName: "borrow",
            repayMethodName: "repay",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Polygon",
        },
        aaveV2: {
            depositAbi: "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            borrowAbi: "function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf)",
            repayAbi: "repay(address asset,uint256 amount,uint256 rateMode,address onBehalfOf)",
            depositMethodName: "deposit",
            withdrawMethodName: "withdraw",
            borrowMethodName: "borrow",
            repayMethodName: "repay",
            paramDetailsMethod: "aave_withdraw",
            depositParamDetailsMethod: "aave_deposit",
            withdrawParamDetailsMethod: "aave_withdraw",
            contractAddress: "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV2Polygon",
        }
    },
    "8453": {
        aaveV3: {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            borrowAbi: "function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf)",
            repayAbi: "function repay(address asset,uint256 amount,uint256 interestRateMode,address onBehalfOf)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            borrowMethodName: "borrow",
            repayMethodName: "repay",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Base",
        },
    },
    "10": {
        "aaveV3": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            borrowAbi: "function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf)",
            repayAbi: "function repay(address asset,uint256 amount,uint256 interestRateMode,address onBehalfOf)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            borrowMethodName: "borrow",
            repayMethodName: "repay",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Optimism",
        },
    }
};

export const tokenAddressByProtocol = {
    polygon: {
        aaveV3: {
            lendAssets: {
                aUSDCv3: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
                aUSDTv3: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
                aDAIv3: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
                aWETHv3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
                aWMATICv3: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
                aAAVEv3: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
                aWBTCv3: "0x078f358208685046a11C85e8ad32895DED33A249",
                aBALv3: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
            },
            borrowAssets: {
                aUSDCv3: "0xFCCf3cAbbe80101232d343252614b6A3eE81C989",
                aUSDTv3: "0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7",
                aDAIv3: "0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC",
                aWETHv3: "0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351",
                aWMATICv3: "0x4a1c3aD6Ed28a636ee1751C69071f6be75DEb8B8",
                aAAVEv3: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375", // wrong
                aWBTCv3: "0x92b42c66840C7AD907b4BF74879FF3eF7c529473",
                aBALv3: "0xA8669021776Bc142DfcA87c21b4A52595bCbB40a",
            },
        },
        aaveV2: {
            lendAssets: {
                aUSDC: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
                aUSDT: "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
                aDAI: "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
                aWETH: "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390",
                aWMATIC: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
                aAAVE: "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360",
                aWBTC: "0x5c2ed810328349100A66B82b78a1791B101C9D61",
            },
            borrowAssets: {
                aUSDC: "0x248960A9d75EdFa3de94F7193eae3161Eb349a12",
                aUSDT: "0x8038857FD47108A07d1f6Bf652ef1cBeC279A2f3",
                aDAI: "0x75c4d1Fb84429023170086f06E682DcbBF537b7d",
                aWETH: "0xeDe17e9d79fc6f9fF9250D9EEfbdB88Cc18038b5",
                aWMATIC: "0x59e8E9100cbfCBCBAdf86b9279fa61526bBB8765",
                aAAVE: "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360", // wrong
                aWBTC: "0xF664F50631A6f0D72ecdaa0e49b0c019Fa72a8dC",
            }
        }
    },
    base: {
        aaveV3: {
            lendAssets: {
                aBasUSDbC: "0x0a1d576f3eFeF75b330424287a95A366e8281D54",
                aBasWETH: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
                aBasUSDC: "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB",
                aBaswstETH: "0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D",
                aBascbETH: "0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad",
            },
            borrowAssets: {
                aBasUSDbC: "0x7376b2F323dC56fCd4C191B34163ac8a84702DAB",
                aBasWETH: "0x1DabC36f19909425f654777249815c073E8Fd79F",
                aBasUSDC: "0x59dca05b6c26dbd64b5381374aAaC5CD05644C28",
                aBaswstETH: "0x41A7C3f5904ad176dACbb1D99101F59ef0811DC1",
                aBascbETH: "0x24e6e0795b3c7c71D965fCc4f371803d1c1DcA1E",
            },
        },
    },
    optimism: {
        aaveV3: {
            lendAssets: {
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
            borrowAssets: {
                aDAI: "0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC",
                aOP: "0x77CA01483f379E58174739308945f044e1a764dc",
                aWETH: "0x0c84331e39d6658Cd6e6b9ba04736cC4c4734351",
                awstETH: "0x34e2eD44EF7466D5f9E0b782B5c08b57475e7907",
                aWBTC: "0x92b42c66840C7AD907b4BF74879FF3eF7c529473",
                aUSDC: "0xFCCf3cAbbe80101232d343252614b6A3eE81C989",
                aUSDT: "0xfb00AC187a8Eb5AFAE4eACE434F493Eb62672df7",
                aLINK: "0x953A573793604aF8d41F306FEb8274190dB4aE0e",
                asUSD: "0x4a1c3aD6Ed28a636ee1751C69071f6be75DEb8B8",
                arETH: "0xf611aEb5013fD2c0511c9CD55c7dc5C1140741A6",
                aAAVE: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375", // wrong
                aLUSD: "0xCE186F6Cccb0c955445bb9d10C59caE488Fea559",
            },
        },
    },
};
