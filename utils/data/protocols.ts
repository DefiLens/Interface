import { ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { decreasePowerByDecimals } from "../helper";
import aave_v2_Abi from "../../abis/defi/aave_v2.json";
import { getContractInstance } from "../web3Libs/ethers";
import compound_Abi from "../../abis/defi/compound.json";
import { tokenAddressByProtocol, tokensByProtocol } from "./tokensByProtocol";
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
    sonne,
    tarot,
    exactly,
    granary,
    radiant,
} from "../../assets/images";

interface iProtocolKey {
    name: string;
    icon: any;
    tokenList: {
        name: string;
        icon: any;
    }[] | string;
    tokenAddresses: {
        [key: string]: string;
    } | string;
}

export interface iProtocolNames {
    [chainId: string]: {
        key: iProtocolKey[];
        value: string[];
    };
}

export const protocolNames: iProtocolNames = {
    "137": {
        key: [
            {
                name: "aaveV2",
                icon: aavev2,
                tokenList: tokensByProtocol.polygon.aaveV2,
                tokenAddresses: tokenAddressByProtocol.polygon.aaveV2,
            },
            {
                name: "aaveV3",
                icon: aavev3,
                tokenList: tokensByProtocol.polygon.aaveV3,
                tokenAddresses: tokenAddressByProtocol.polygon.aaveV3,
            },
            {
                name: "compoundV3",
                icon: compoundV3,
                tokenList: tokensByProtocol.polygon.compoundV3,
                tokenAddresses: tokenAddressByProtocol.polygon.compoundV3,
            },
            {
                name: "dForce",
                icon: dforce,
                tokenList: tokensByProtocol.polygon.dForce,
                tokenAddresses: tokenAddressByProtocol.polygon.dForce,
            },
            {
                name: "erc20",
                icon: polygon,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V2", "AAVE V3", "Compound V3", "dForce", "ERC20"],
    },
    "43114": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                tokenList: tokensByProtocol.avalanche.aaveV3,
                tokenAddresses: tokenAddressByProtocol.avalanche.aaveV3,
            },
            {
                name: "benqi",
                icon: benqi,
                tokenList: tokensByProtocol.avalanche.benqi,
                tokenAddresses: tokenAddressByProtocol.avalanche.benqi,
            },
            {
                name: "erc20",
                icon: avalanche,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "BENQI", "ERC20"],
    },
    "42161": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                tokenList: tokensByProtocol.arbitrum.aaveV3,
                tokenAddresses: tokenAddressByProtocol.arbitrum.aaveV3,
            },
            {
                name: "compoundV3",
                icon: compoundV3,
                tokenList: tokensByProtocol.arbitrum.compoundV3,
                tokenAddresses: tokenAddressByProtocol.arbitrum.compoundV3,
            },
            {
                name: "radiant",
                icon: radiant,
                tokenList: tokensByProtocol.arbitrum.radiant,
                tokenAddresses: tokenAddressByProtocol.arbitrum.radiant,
            },
            {
                name: "erc20",
                icon: arbitrum,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "Compound V3", "Radiant", "ERC20"],
    },
    "10": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                tokenList: tokensByProtocol.optimism.aaveV3,
                tokenAddresses: tokenAddressByProtocol.optimism.aaveV3,
            },
            {
                name: "sonne",
                icon: sonne,
                tokenList: tokensByProtocol.optimism.sonne,
                tokenAddresses: tokenAddressByProtocol.optimism.sonne,
            },
            {
                name: "exactly",
                icon: exactly,
                tokenList: tokensByProtocol.optimism.exactly,
                tokenAddresses: tokenAddressByProtocol.optimism.exactly,
            },
            {
                name: "granary",
                icon: granary,
                tokenList: tokensByProtocol.optimism.granary,
                tokenAddresses: tokenAddressByProtocol.optimism.granary,
            },
            {
                name: "erc20",
                icon: optimism,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "Sonne Finance", "Exactly Finance", "Granary Finance", "ERC20"],
    },
    "8453": {
        key: [
            {
                name: "aaveV3",
                icon: aavev3,
                tokenList: tokensByProtocol.base.aaveV3,
                tokenAddresses: tokenAddressByProtocol.base.aaveV3,
            },
            {
                name: "compoundV3",
                icon: compoundV3,
                tokenList: tokensByProtocol.base.compoundV3,
                tokenAddresses: tokenAddressByProtocol.base.compoundV3,
            },
            {
                name: "seamless",
                icon: seamless,
                tokenList: tokensByProtocol.base.seamless,
                tokenAddresses: tokenAddressByProtocol.base.seamless,
            },
            {
                name: "moonwell",
                icon: moonwell,
                tokenList: tokensByProtocol.base.moonwell,
                tokenAddresses: tokenAddressByProtocol.base.moonwell,
            },
            {
                name: "sonne",
                icon: sonne,
                tokenList: tokensByProtocol.base.sonne,
                tokenAddresses: "tokenAddresses",
            },
            {
                name: "erc20",
                icon: base,
                tokenList: "tokenList",
                tokenAddresses: "tokenAddresses",
            },
        ],
        value: ["AAVE V3", "Compound V3", "Seamless", "Moonwell", "Sonne", "ERC20"],
    },
};

export const abiFetcherNum = {
    "137": {
        cUSDC: "1",
        aUSDC: "2",
        aUSDT: "2",
        aDAI: "2",
        aWETH: "2",
        aWMATIC: "2",
        aAAVE: "2",
        aWBTC: "2",
        dForceUSDC: "3",
        aUSDCv3: "4",
        aUSDTv3: "4",
        aDAIv3: "4",
        aWETHv3: "4",
        aWMATICv3: "4",
        aAAVEv3: "4",
        aWBTCv3: "4",
        aBALv3: "4",
    },
    "43114": {
        aUSDT: "1",
        aUSDC: "1",
        aWAVAX: "1",
        aBTCb: "1",
        aWETHe: "1",
        aWBTCe: "1",
        asAVAX: "1",
        aLINKe: "1",
        aDAIe: "1",
        aAAVEe: "1",
        aMAI: "1",
        aFRAX: "1",

        qiAVAX: "2",
        qisAVAX: "2",
        qiBTCb: "2",
        qiBTC: "2",
        qiETH: "2",
        qiLINK: "2",
        qiUSDT: "2",
        qiUSDC: "2",
        qiUSDTn: "2",
        qiUSDCn: "2",
        qiDAI: "2",
    },
    "42161": {
        aWETH: "1",
        aUSDC: "1",
        aUSDCe: "1",
        awstETH: "1",
        aWBTC: "1",
        aUSDT: "1",
        aARB: "1",
        aLINK: "1",
        aDAI: "1",
        arETH: "1",
        aLUSD: "1",
        aAAVE: "1",
        aFRAX: "1",
        aEURS: "1",
        cUSDCev3: "2",
        cUSDCv3: "3",

        rWBTC: "",
        rUSDT: "",
        "rUSDC.e": "",
        rDAI: "",
        rWETH: "",
        rwstETH: "",
        rARB: "",
        rUSDC: "",
    },
    "10": {
        aDAI: "1",
        aOP: "1",
        aWETH: "1",
        awstETH: "1",
        aWBTC: "1",
        aUSDC: "1",
        aUSDT: "1",
        aLINK: "1",
        asUSD: "1",
        arETH: "1",
        aAAVE: "1",
        aLUSD: "1",

        soWETH: "2",
        soDAI: "2",
        "soUSDC.e": "2",
        soUSDT: "2",
        soOP: "2",
        soSUSD: "2",
        sSONNE: "2",
        soSNX: "2",
        soWBTC: "2",
        soLUSD: "2",
        sowstETH: "2",
        soMAI: "2",
        soUSDC: "2",

        "exaOP": "3",
        "exaUSDC": "3",
        "exaWBTC": "3",
        "exaWETH": "3",
        "exawstETH": "3",

        "grainDAI": "4",
        "grainUSDC": "4",
        "grainUSDT": "4",
        "grainWBTC": "4",
        "grainWETH": "4",
        "grainOP": "4",
        "grainSUSD": "4",
        "grainBAL": "4",
        "grainSNX": "4",
        "grainWSTETH": "4",
    },
    "8453": {
        cUSDbCv3: "1",
        aBasUSDbC: "2",
        aBasWETH: "2",
        sUSDbC: "3",
        sWETH: "3",
        scbETH: "3",
        sUSDC: "3",
        sDAI: "3",

        mDAI: "4",
        mUSDC: "4",
        mUSDbC: "4",
        mWETH: "4",
        mcbETH: "4",
        mwstETH: "4",
        mrETH: "4",

        sobUSDbC: "5",
        sobUSDC: "5",
        sobDAI: "5",
        sobWETH: "5",
        sobcbETH: "5",
    },
};

export const abiFetcher = {
    "137": {
        "1": {
            depositAbi: "function supply(address asset, uint256 amount)",
            withdrawAbi: "function withdraw(address asset,uint256 amount)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            depositParamDetailsMethod: "compound_supply",
            withdrawParamDetailsMethod: "compound_withdraw",
            contractAddress: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
            isContractSet: false,
            apyFetch: "fetchApyForCompoundPolygon",
        },
        "2": {
            depositAbi: "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "deposit",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "aave_withdraw",
            depositParamDetailsMethod: "aave_deposit",
            withdrawParamDetailsMethod: "aave_withdraw",
            contractAddress: "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV2Polygon",
        },
        "3": {
            depositAbi: "function mint(address _recipient, uint256 _mintAmount)",
            withdrawAbi: "function redeem(address _from, uint256 _redeemiToken)",
            depositMethodName: "mint",
            withdrawMethodName: "redeem",
            paramDetailsMethod: "dForce_withdraw",
            depositParamDetailsMethod: "dForce_deposit",
            withdrawParamDetailsMethod: "dForce_withdraw",
            contractAddress: "0x5268b3c4afb0860D365a093C184985FCFcb65234",
            isContractSet: false,
            apyFetch: "fetchApyForDForcePolygon",
        },
        "4": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Polygon",
        },
    },
    "43114": {
        "1": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Avalanche",
        },
        "2": {
            depositAbi: "function mint(uint256 mintAmount)",
            withdrawAbi: "function redeemUnderlying(uint256 redeemAmount)",
            depositMethodName: "mint",
            withdrawMethodName: "redeemUnderlying",
            paramDetailsMethod: "benqi_mint",
            depositParamDetailsMethod: "benqi_mint",
            withdrawParamDetailsMethod: "benqi_redeemUnderlying",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: true,
            contractSet: {
                qiAVAX: "0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c",
                qisAVAX: "0xF362feA9659cf036792c9cb02f8ff8198E21B4cB",
                qiBTCb: "0x89a415b3D20098E6A6C8f7a59001C67BD3129821",
                qiBTC: "0xe194c4c5aC32a3C9ffDb358d9Bfd523a0B6d1568",
                qiETH: "0x334AD834Cd4481BB02d09615E7c11a00579A7909",
                qiLINK: "0x4e9f683A27a6BdAD3FC2764003759277e93696e6",
                qiUSDT: "0xc9e5999b8e75C3fEB117F6f73E664b9f3C8ca65C",
                qiUSDC: "0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F",
                qiUSDTn: "0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF",
                qiUSDCn: "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C",
                qiDAI: "0x835866d37AFB8CB8F8334dCCdaf66cf01832Ff5D",
            },
            apyFetch: "fetchApyForBenqiAvalanche",
        },
    },
    "42161": {
        "1": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Arbitrum",
        },
        "2": {
            depositAbi: "function supply(address asset, uint256 amount)",
            withdrawAbi: "function withdraw(address asset,uint256 amount)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            depositParamDetailsMethod: "compound_supply",
            withdrawParamDetailsMethod: "compound_withdraw",
            contractAddress: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA",
            isContractSet: false,
            apyFetch: "fetchApyForCompoundArbitrum",
        },
        "3": {
            depositAbi: "function supply(address asset, uint256 amount)",
            withdrawAbi: "function withdraw(address asset,uint256 amount)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            depositParamDetailsMethod: "compound_supply",
            withdrawParamDetailsMethod: "compound_withdraw",
            contractAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
            isContractSet: false,
            apyFetch: "fetchApyForCompoundArbitrum",
        },
        "4": {
            depositAbi: "function deposit(address asset,uint256 amount,address onBehalfOf,uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset,uint256 amount,address to)",
            depositMethodName: "deposit",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "radiant_deposit",
            depositParamDetailsMethod: "radiant_deposit",
            withdrawParamDetailsMethod: "radiant_withdraw",
            contractAddress: "0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1",
            isContractSet: false,
            apyFetch: "fetchApyForRadiantArbitrum",
        },
    },
    "10": {
        "1": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Optimism",
        },
        "2": {
            depositAbi: "function mint(uint256 mintAmount)",
            withdrawAbi: "function redeem(uint256 redeemTokens)",
            depositMethodName: "mint",
            withdrawMethodName: "redeem",
            paramDetailsMethod: "sonne_mint",
            depositParamDetailsMethod: "sonne_mint",
            withdrawParamDetailsMethod: "sonne_redeem",
            contractAddress: "",
            isContractSet: true,
            contractSet: {
                soWETH: "0xf7B5965f5C117Eb1B5450187c9DcFccc3C317e8E",
                soDAI: "0x5569b83de187375d43FBd747598bfe64fC8f6436",
                "soUSDC.e": "0xEC8FEa79026FfEd168cCf5C627c7f486D77b765F",
                soUSDT: "0x5Ff29E4470799b982408130EFAaBdeeAE7f66a10",
                soOP: "0x8cD6b19A07d754bF36AdEEE79EDF4F2134a8F571",
                soSUSD: "0xd14451E0Fa44B18f08aeB1E4a4d092B823CaCa68",
                sSONNE: "0xdc05d85069dc4aba65954008ff99f2d73ff12618",
                soSNX: "0xD7dAabd899D1fAbbC3A9ac162568939CEc0393Cc",
                soWBTC: "0x33865E09A572d4F1CC4d75Afc9ABcc5D3d4d867D",
                soLUSD: "0xAFdf91f120DEC93c65fd63DBD5ec372e5dcA5f82",
                sowstETH: "0x26AaB17f27CD1c8d06a0Ad8E4a1Af8B1032171d5",
                soMAI: "0xE7De932d50EfC9ea0a7a409Fc015B4f71443528e",
                soUSDC: "0x1AfD1fF9E441973B7D34c7B8AbE91d94F1B23ce0"
            },
            apyFetch: "fetchApyForSonneOptimism",
        },
        "3": {
            depositAbi: "function deposit(uint256 assets,address receiver)",
            withdrawAbi: "function withdraw(uint256 assets,address receiver,address owner)",
            depositMethodName: "deposit",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "exactly_deposit",
            depositParamDetailsMethod: "exactly_deposit",
            withdrawParamDetailsMethod: "exactly_withdraw",
            contractAddress: "",
            isContractSet: true,
            contractSet: {
                "exaOP": "0xa430A427bd00210506589906a71B54d6C256CEdb",
                "exaUSDC": "0x81C9A7B55A4df39A9B7B5F781ec0e53539694873",
                "exaWBTC": "0x6f748FD65d7c71949BA6641B3248C4C191F3b322",
                "exaWETH": "0xc4d4500326981eacD020e20A81b1c479c161c7EF",
                "exawstETH": "0x22ab31Cd55130435b5efBf9224b6a9d5EC36533F",
            },
            apyFetch: "fetchApyForExactlyOptimism",
        },
        "4": {
            depositAbi: "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "deposit",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "granary_deposit",
            depositParamDetailsMethod: "granary_deposit",
            withdrawParamDetailsMethod: "granary_withdraw",
            contractAddress: "0x8FD4aF47E4E63d1D2D45582c3286b4BD9Bb95DfE",
            isContractSet: false,
            apyFetch: "fetchApyForGranaryOptimism",
        },
    },
    "8453": {
        "1": {
            depositAbi: "function supply(address asset, uint256 amount)",
            withdrawAbi: "function withdraw(address asset,uint256 amount)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            depositParamDetailsMethod: "compound_supply",
            withdrawParamDetailsMethod: "compound_withdraw",
            contractAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
            isContractSet: false,
            apyFetch: "fetchApyForCompoundPolygon",
        },
        "2": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "aave_supply_v3",
            depositParamDetailsMethod: "aave_supply_v3",
            withdrawParamDetailsMethod: "aave_withdraw_v3",
            contractAddress: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Base",
        },
        "3": {
            depositAbi: "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
            withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
            depositMethodName: "supply",
            withdrawMethodName: "withdraw",
            paramDetailsMethod: "seamless_supply_v3",
            depositParamDetailsMethod: "seamless_supply_v3",
            withdrawParamDetailsMethod: "seamless_withdraw_v3",
            contractAddress: "0x8F44Fd754285aa6A2b8B9B97739B79746e0475a7",
            isContractSet: false,
            apyFetch: "fetchApyForSeamlessV3Base",
        },
        "4": {
            depositAbi: "function mint(uint256 mintAmount)",
            withdrawAbi: "function redeem(uint256 redeemTokens)",
            depositMethodName: "mint",
            withdrawMethodName: "redeem",
            depositParamDetailsMethod: "moonwell_mint",
            withdrawParamDetailsMethod: "moonwell_redeem",
            contractAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
            isContractSet: true,
            contractSet: {
                mDAI: "0x73b06D8d18De422E269645eaCe15400DE7462417",
                mUSDC: "0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22",
                mUSDbC: "0x703843C3379b52F9FF486c9f5892218d2a065cC8",
                mWETH: "0x628ff693426583D9a7FB391E54366292F509D457",
                mcbETH: "0x3bf93770f2d4a794c3d9EBEfBAeBAE2a8f09A5E5",
                mwstETH: "0x627Fe393Bc6EdDA28e99AE648fD6fF362514304b",
                mrETH: "0xCB1DaCd30638ae38F2B94eA64F066045B7D45f44",
            },
            apyFetch: "fetchApyForMoonWellBase",
        },
        "5": {
            depositAbi: "function mint(uint256 mintAmount)",
            withdrawAbi: "function redeem(uint256 redeemTokens)",
            depositMethodName: "mint",
            withdrawMethodName: "redeem",
            depositParamDetailsMethod: "sonne_mint",
            withdrawParamDetailsMethod: "sonne_redeem",
            contractAddress: "",
            isContractSet: true,
            contractSet: {
                sobUSDbC: "0x225886C9beb5eeE254F79d58bbD80cf9F200D4d0",
                sobUSDC: "0xfd68F92B45b633bbe0f475294C1A86aecD62985A",
                sobDAI: "0xb864BA2aab1f53BC3af7AE49a318202dD3fd54C2",
                sobWETH: "0x5F5c479fe590cD4442A05aE4a941dd991A633B8E",
                sobcbETH: "0x6C91bEECEEDda2089307fAb818E12757948BF489",
            },
            apyFetch: "fetchApyForSonneBase",
        },
    },
};

export const nativeTokenNum = {
    "137": {
        cUSDC: "1",

        aUSDC: "1",
        aUSDT: "2",
        aDAI: "3",
        aWETH: "4",
        aWMATIC: "5",
        aAAVE: "6",
        aWBTC: "7",

        dForceUSDC: "1",

        aUSDCv3: "1",
        aUSDTv3: "2",
        aDAIv3: "3",
        aWETHv3: "4",
        aWMATICv3: "5",
        aAAVEv3: "6",
        aWBTCv3: "7",
        aBALv3: "8",
    },
    "43114": {
        aUSDT: "1",
        aUSDC: "2",
        aWAVAX: "3",
        aBTCb: "4",
        aWETHe: "5",
        aWBTCe: "6",
        asAVAX: "7",
        aLINKe: "8",
        aDAIe: "9",
        aAAVEe: "10",
        aMAI: "11",
        aFRAX: "12",

        // qiAVAX: "",
        qisAVAX: "7",
        qiBTCb: "4",
        qiBTC: "6",
        qiETH: "5",
        qiLINK: "8",
        qiUSDT: "13",
        qiUSDC: "14",
        qiUSDTn: "1",
        qiUSDCn: "2",
        qiDAI: "9",
    },
    "42161": {
        aWETH: "1",
        aUSDC: "2",
        aUSDCe: "3",
        awstETH: "4",
        aWBTC: "5",
        aUSDT: "6",
        aARB: "7",
        aLINK: "8",
        aDAI: "9",
        arETH: "10",
        aLUSD: "11",
        aAAVE: "12",
        aFRAX: "13",
        aEURS: "14",
        cUSDCev3: "3",
        cUSDCv3: "2",
    },
    "10": {
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

        soWETH: "3",
        soDAI: "1",
        "soUSDC.e": "6",
        soUSDT: "7",
        soOP: "2",
        soSUSD: "9",
        sSONNE: "16", //
        soSNX: "15",
        soWBTC: "5",
        soLUSD: "12",
        sowstETH: "4",
        soMAI: "14",
        soUSDC: "13",

        "exaOP": "2",
        "exaUSDC": "6",
        "exaWBTC": "5",
        "exaWETH": "3",
        "exawstETH": "4",

        "grainDAI": "1",
        "grainUSDC": "6",
        "grainUSDT": "7",
        "grainWBTC": "5",
        "grainWETH": "3",
        "grainOP": "2",
        "grainSUSD": "9",
        "grainBAL": "17",
        "grainSNX": "15",
        "grainWSTETH": "4",
    },
    "8453": {
        cUSDbCv3: "1",
        aBasUSDbC: "1",
        aBasWETH: "2",
        sUSDbC: "1",
        sWETH: "2",
        scbETH: "3",
        sUSDC: "4",
        sDAI: "5",

        mDAI: "5",
        mUSDC: "4",
        mUSDbC: "1",
        mWETH: "2",
        mcbETH: "3",
        mwstETH: "6",
        mrETH: "7",

        sobUSDbC: "1",
        sobUSDC: "4",
        sobDAI: "5",
        sobWETH: "2",
        sobcbETH: "3",
    },
};

export const nativeTokenFetcher = {
    "137": {
        "1": {
            nativeToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            symbol: "usdc",
            decimals: 6,
        },
        "2": {
            nativeToken: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            symbol: "usdt",
            decimals: 6,
        },
        "3": {
            nativeToken: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            symbol: "dai",
            decimals: 18,
        },
        "4": {
            nativeToken: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            symbol: "weth",
            decimals: 18,
        },
        "5": {
            nativeToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            symbol: "wmatic",
            decimals: 18,
        },
        "6": {
            nativeToken: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
            symbol: "aave",
            decimals: 18,
        },
        "7": {
            nativeToken: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            symbol: "wbtc",
            decimals: 8,
        },
        "8": {
            nativeToken: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
            symbol: "bal",
            decimals: 18,
        },
    },
    "43114": {
        "1": {
            nativeToken: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
            symbol: "usdt",
            decimals: 6,
        },
        "2": {
            nativeToken: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            symbol: "usdc",
            decimals: 6,
        },
        "3": {
            nativeToken: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            symbol: "wavax",
            decimals: 18,
        },
        "4": {
            nativeToken: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
            symbol: "btc.b",
            decimals: 8,
        },
        "5": {
            nativeToken: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
            symbol: "weth.e",
            decimals: 18,
        },
        "6": {
            nativeToken: "0x50b7545627a5162F82A992c33b87aDc75187B218",
            symbol: "wbtc.3",
            decimals: 8,
        },
        "7": {
            nativeToken: "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
            symbol: "savax",
            decimals: 18,
        },
        "8": {
            nativeToken: "0x5947BB275c521040051D82396192181b413227A3",
            symbol: "link.e",
            decimals: 18,
        },
        "9": {
            nativeToken: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
            symbol: "dai.e",
            decimals: 18,
        },
        "10": {
            nativeToken: "0x63a72806098Bd3D9520cC43356dD78afe5D386D9",
            symbol: "aave.e",
            decimals: 18,
        },
        "11": {
            nativeToken: "0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b",
            symbol: "mai",
            decimals: 18,
        },
        "12": {
            nativeToken: "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64",
            symbol: "frax",
            decimals: 18,
        },
        "13": {
            nativeToken: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
            symbol: "usdt.e",
            decimal: 6,
        },
        "14": {
            nativeToken: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
            symbol: "usdc.e",
            decimal: 6,
        },
    },
    "42161": {
        "1": {
            nativeToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            symbol: "weth",
            decimals: 18,
        },
        "2": {
            nativeToken: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            symbol: "usdc",
            decimals: 6,
        },
        "3": {
            nativeToken: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            symbol: "usdc.e",
            decimals: 6,
        },
        "4": {
            nativeToken: "0x5979D7b546E38E414F7E9822514be443A4800529",
            symbol: "wstETH",
            decimals: 18,
        },
        "5": {
            nativeToken: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
            symbol: "wbtc",
            decimals: 8,
        },
        "6": {
            nativeToken: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            symbol: "usdt",
            decimals: 6,
        },
        "7": {
            nativeToken: "0x912CE59144191C1204E64559FE8253a0e49E6548",
            symbol: "arb",
            decimals: 18,
        },
        "8": {
            nativeToken: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
            symbol: "link",
            decimals: 18,
        },
        "9": {
            nativeToken: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            symbol: "dai",
            decimals: 18,
        },
        "10": {
            nativeToken: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
            symbol: "rETH",
            decimals: 18,
        },
        "11": {
            nativeToken: "0x93b346b6BC2548dA6A1E7d98E9a421B42541425b",
            symbol: "lusd",
            decimals: 18,
        },
        "12": {
            nativeToken: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
            symbol: "aave",
            decimals: 18,
        },
        "13": {
            nativeToken: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
            symbol: "frax",
            decimals: 18,
        },
        "14": {
            nativeToken: "0xD22a58f79e9481D1a88e00c343885A588b34b68B",
            symbol: "eurs",
            decimals: 2,
        },
    },
    "10": {
        "1": {
            nativeToken: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            symbol: "dai",
            decimals: 18,
        },
        "2": {
            nativeToken: "0x4200000000000000000000000000000000000042",
            symbol: "op",
            decimals: 18,
        },
        "3": {
            nativeToken: "0x4200000000000000000000000000000000000006",
            symbol: "weth",
            decimals: 18,
        },
        "4": {
            nativeToken: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
            symbol: "wsteth",
            decimals: 18,
        },
        "5": {
            nativeToken: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
            symbol: "wbtc",
            decimals: 8,
        },
        "6": {
            nativeToken: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            symbol: "usdc",
            decimals: 6,
        },
        "7": {
            nativeToken: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            symbol: "usdt",
            decimals: 6,
        },
        "8": {
            nativeToken: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
            symbol: "link",
            decimals: 18,
        },
        "9": {
            nativeToken: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
            symbol: "susd",
            decimals: 18,
        },
        "10": {
            nativeToken: "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D",
            symbol: "reth",
            decimals: 18,
        },
        "11": {
            nativeToken: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
            symbol: "aave",
            decimals: 18,
        },
        "12": {
            nativeToken: "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
            symbol: "lusd",
            decimals: 18,
        },
        "13": {
            nativeToken: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
            symbol: "usdc",
            decimals: 6,
        },
        "14": {
            nativeToken: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
            symbol: "mai",
            decimals: 18,
        },
        "15": {
            nativeToken: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
            symbol: "snx",
            decimals: 18,
        },
        "16": {
            nativeToken: "0x1DB2466d9F5e10D7090E7152B68d62703a2245F0",
            symbol: "sonne",
            decimals: 18,
        },
        "17": {
            nativeToken: "0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921",
            symbol: "bal",
            decimals: 18
        }
    },
    "8453": {
        "1": {
            nativeToken: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // USDC
            symbol: "usdc", // USDbC
            decimals: 6,
        },
        "2": {
            nativeToken: "0x4200000000000000000000000000000000000006", // WETH
            symbol: "weth",
            decimals: 18,
        },
        "3": {
            nativeToken: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", // cbETH
            symbol: "cbeth",
            decimals: 18,
        },
        "4": {
            nativeToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // cbETH
            symbol: "usdc",
            decimals: 6,
        },
        "5": {
            nativeToken: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // cbETH
            symbol: "dai",
            decimals: 18,
        },
        "6": {
            nativeToken: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452", // cbETH
            symbol: "wstETH",
            decimals: 18,
        },
        "7": {
            nativeToken: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c", // cbETH
            symbol: "rETH",
            decimals: 18,
        },
    },
};

export async function buildParams({
    tokenIn,
    tokenOut,
    nativeTokenIn,
    nativeTokenOut,
    amount,
    address,
    paramDetailsMethod,
}) {
    if (
        paramDetailsMethod == "aave_deposit" ||
        paramDetailsMethod == "aave_supply_v3" ||
        paramDetailsMethod == "seamless_supply_v3" ||
        paramDetailsMethod == "granary_deposit" ||
        paramDetailsMethod == "radiant_deposit"
    ) {
        return [nativeTokenIn, amount, address, 0];
    } else if (
        paramDetailsMethod == "aave_withdraw" ||
        paramDetailsMethod == "aave_withdraw_v3" ||
        paramDetailsMethod == "seamless_withdraw_v3" ||
        paramDetailsMethod == "granary_withdraw" ||
        paramDetailsMethod == "radiant_withdraw"
    ) {
        return [nativeTokenIn, amount, address];
    } else if (paramDetailsMethod == "compound_supply") {
        return [nativeTokenIn, amount];
    } else if (paramDetailsMethod == "compound_withdraw") {
        return [nativeTokenIn, amount];
    } else if (paramDetailsMethod == "dForce_deposit") {
        return [address, amount];
    } else if (paramDetailsMethod == "dForce_withdraw") {
        return [address, amount];
    } else if (
        paramDetailsMethod == "benqi_mint" ||
        paramDetailsMethod == "moonwell_mint" ||
        paramDetailsMethod == "sonne_mint"
    ) {
        return [amount];
    } else if (
        paramDetailsMethod == "benqi_redeemUnderlying" ||
        paramDetailsMethod == "moonwell_redeem" ||
        paramDetailsMethod == "sonne_redeem"
    ) {
        return [amount];
    } else if (
        paramDetailsMethod == "exactly_deposit"
    ) {
        return [amount, address];
    } else if (
        paramDetailsMethod == "exactly_withdraw"
    ) {
        return [amount, address, address];
    }
}

export async function fetchApy({ protocol, contractAddress, provider, signer, token }) {
    if (protocol == "fetchApyForAaveV2Polygon") {
        let abi = new ethers.utils.Interface(aave_v2_Abi);
        const protocolInstance = await getContractInstance(contractAddress, abi, provider);
        const reserveData = await protocolInstance?.getReserveData(token);
        return await decreasePowerByDecimals(reserveData[3].toString().toString(), 25);
    } else if (protocol == "fetchApyForAaveV3Polygon") {
        let abi = new ethers.utils.Interface(aave_v2_Abi);
        const protocolInstance = await getContractInstance(contractAddress, abi, provider);
        const reserveData = await protocolInstance?.getReserveData(token);
        return await decreasePowerByDecimals(reserveData[2].toString().toString(), 25);
    } else if (protocol == "fetchApyForCompoundPolygon") {
        let abi = new ethers.utils.Interface(compound_Abi);
        const SecondsPerYear = 60 * 60 * 24 * 365;
        const protocolInstance = await getContractInstance(contractAddress, abi, provider);
        const utilization = await protocolInstance?.getUtilization();
        let supplyRate = await protocolInstance?.getSupplyRate(utilization);
        supplyRate = bg(supplyRate.toString()).dividedBy(1e18).multipliedBy(bg(SecondsPerYear).multipliedBy(100));
        return supplyRate;
    } else if (protocol == "fetchApyForCompoundPolygon") {
        let abi = new ethers.utils.Interface(compound_Abi);
        const SecondsPerYear = 60 * 60 * 24 * 365;
        const protocolInstance = await getContractInstance(contractAddress, abi, provider);
        const utilization = await protocolInstance?.getUtilization();
        let supplyRate = await protocolInstance?.getSupplyRate(utilization);
        supplyRate = bg(supplyRate.toString()).dividedBy(1e18).multipliedBy(bg(SecondsPerYear).multipliedBy(100));
        return supplyRate;
    }
}

interface ChainPing {
    [network: string]: string;
}

interface StarGateRouter {
    [network: string]: string;
}

interface Tokens {
    [tokenName: string]: string;
}

// export const chainPingByNetwork: ChainPing = {
//     "137": "0x664BFAA3ce3C03aAf18EC2627d81f439576f7969",
//     "43114": "0x934E5421D4ce678ae4c4B136306Fbee91bfDBbC8",
//     "42161": "0xBA821135197bB2614F5Bd8943b5d1607288DC60d",
//     "10": "0x2b2ED70C5B25b71CaA766C1054092A9Ff0900df0",
//     "1": "0x0000000000000000000000000000000000000000",
//     "8453": "0x5764FfF7629c03aFE36AA35114C250b2218a77E2",
// };

export const newChainPingByNetwork: ChainPing = {
    // "137": "0x9Aab7e96A706444df9d965a4c1684132554737Fc",
    "137": "0x3E5011b3eEe32363906b4C93a8D6D794faD89bcC",
    "43114": "0x934E5421D4ce678ae4c4B136306Fbee91bfDBbC8",
    // "42161": "0xBA821135197bB2614F5Bd8943b5d1607288DC60d",
    "42161": "0xdEE20C84898f66B7A65121b811988707E1c5aB20",
    // "10": "0x7e25feE19DDf584Ae5Ff755ed51Fc1ede7834336",
    "10": "0x191844A8C6eCB93BbDBF82b30bB21a4C66B104F7",
    "1": "0x0000000000000000000000000000000000000000",
    // "8453": "0x5764FfF7629c03aFE36AA35114C250b2218a77E2",
    "8453": "0x77a90ebb0C950cACe0fD4ce5274efac305C9a7e4"
};

export const starGateRouterByNetwork: StarGateRouter = {
    "137": "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9",
    "43114": "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9",
    "42161": "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9",
    "10": "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9",
    "1": "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9",
    "8453": "0xeCc19E177d24551aA7ed6Bc6FE566eCa726CC8a9",
};


export const OneInchRouter = "0x111111125421ca6dc452d289314280a0f8842a65"

export const uniswapSwapRouterByChainId = {
    "137": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "43114": "0x82635AF6146972cD6601161c4472ffe97237D292",
    "42161": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "10": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "1": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    "8453": "0x2626664c2603336E57B271c5C0b26F421741e481",
};

export const tokensByNetworkForCC: Record<string, Tokens> = {
    "137": {
        usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    "43114": {
        usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    },
    "42161": {
        usdc: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    "10": {
        usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    "1": {
        usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    "8453": {
        usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    },
};
