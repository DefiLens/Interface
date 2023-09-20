import { ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import aave_v2_Abi from "../../abis/defi/aave_v2.json";
import compound_Abi from "../../abis/defi/compound.json";
import { getContractInstance } from "../../utils/web3Libs/ethers";

bg.config({ DECIMAL_PLACES: 20 });

/// For BASE Network

export const abiFetcherNum = {
    cUSDbCv3: "1",
    aBasUSDbC: "2",
    aBasWETH: "2",
};

export const abiFetcher = {
    "1": {
        depositAbi: "function supply(address asset, uint256 amount)",
        withdrawAbi: "function withdraw(address asset,uint256 amount)",
        depositMethodName: "supply",
        withdrawMethodName: "withdraw",
        depositParamDetailsMethod: "compound_supply",
        withdrawParamDetailsMethod: "compound_withdraw",
        contractAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
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
        apyFetch: "fetchApyForAaveV3Polygon",
    },
};

export const nativeTokenNum = {
    cUSDbCv3: "1",
    aBasUSDbC: "1",
    aBasWETH: "2",
};

export const nativeTokenFetcher = {
    "1": {
        nativeToken: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // USDC
    },
    "2": {
        nativeToken: "0x4200000000000000000000000000000000000006", // WETH
    },
    "3": {
        nativeToken: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22", // cbETH
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
    if (paramDetailsMethod == "aave_deposit" || paramDetailsMethod == "aave_supply_v3") {
        return [nativeTokenIn, amount, address, 0];
    } else if (paramDetailsMethod == "aave_withdraw" || paramDetailsMethod == "aave_withdraw_v3") {
        return [nativeTokenIn, amount, address];
    } else if (paramDetailsMethod == "compound_supply") {
        return [nativeTokenIn, amount];
    } else if (paramDetailsMethod == "compound_withdraw") {
        return [nativeTokenIn, amount];
    }
    // else if (paramDetailsMethod == "dForce_deposit") {
    //     return [address, amount];
    // } else if (paramDetailsMethod == "dForce_withdraw") {
    //     return [address, amount];
    // }
}

export async function fetchApy({ protocol, contractAddress, provider, signer, token }) {
    if (protocol == "fetchApyForAaveV2Polygon") {
        let abi = new ethers.utils.Interface(aave_v2_Abi);
        const protocolInstance = await getContractInstance(contractAddress, abi, provider);
        const reserveData = await protocolInstance?.getReserveData(token);
        return bg(reserveData[3].toString()).dividedBy(1e25);
    } else if (protocol == "fetchApyForAaveV3Polygon") {
        let abi = new ethers.utils.Interface(aave_v2_Abi);
        const protocolInstance = await getContractInstance(contractAddress, abi, provider);
        const reserveData = await protocolInstance?.getReserveData(token);
        return bg(reserveData[2].toString()).dividedBy(1e25);
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
