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

import { arbitrum, avalanche, ethereum, optimism } from "../../assets/images";
import { getContractInstance, getErc20Balanceof, getProvider } from "../web3Libs/ethers";
import IERC20 from "../../abis/IERC20.json";
import poolv3 from "../../abis/aave/poolv3.json";
import { ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
bg.config({ DECIMAL_PLACES: 10 });

export const nativeTokens = {
    "8453": {
        "1": {
            nativeToken: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA", // USDC
            symbol: "usdbc", // USDbC
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
}

export const tokensSupported = {
    base: {
        aaveV3: {
            Lending: ["USDC", "USDbC", "WETH", "wstETH", "cbETH"],
            Borrow: ["USDC", "USDbC", "WETH", "wstETH", "cbETH"],
            Withdraw: ["aBasUSDC", "aBasUSDbC", "aBasWETH", "aBaswstETH", "aBascbETH"],
            Repay: ["USDC", "USDbC", "WETH", "wstETH", "cbETH"],
        },
    }
}

export const tokenToShare = {
    base: {
        aaveV3: {
            "USDC": "aBasUSDC",
            "USDbC": "aBasUSDbC",
            "WETH": "aBasWETH",
            "wstETH": "aBaswstETH",
            "cbETH": "aBascbETH",
        }
    }
}

export const supportedTokenDetails = {
    base: {
        aaveV3: {
            "USDC": "4",
            "USDbC": "1",
            "WETH": "2",
            "wstETH": "6",
            "cbETH": "3",

            "aBasUSDC": "4",
            "aBasUSDbC": "1",
            "aBasWETH": "2",
            "aBaswstETH": "6",
            "aBascbETH": "3",

        }
    }
}

export const abiFetcher = {
    "8453": {
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
            contractAddress: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
            isContractSet: false,
            apyFetch: "fetchApyForAaveV3Base",
        },
    },
};

export const tokenAddressByProtocol = {
    "base": {
        "aaveV3": {
            "lendAssets": {
                "aBasUSDbC": "0x0a1d576f3eFeF75b330424287a95A366e8281D54",
                "aBasWETH": "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
                "aBasUSDC": "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB",
                "aBaswstETH": "0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D",
                "aBascbETH": "0xcf3D55c10DB69f28fD1A75Bd73f3D8A2d9c595ad",
            },
            "borrowAssets": {
                "aBasUSDbC": "0x7376b2F323dC56fCd4C191B34163ac8a84702DAB",
                "aBasWETH": "0x1DabC36f19909425f654777249815c073E8Fd79F",
                "aBasUSDC": "0x59dca05b6c26dbd64b5381374aAaC5CD05644C28",
                "aBaswstETH": "0x41A7C3f5904ad176dACbb1D99101F59ef0811DC1",
                "aBascbETH": "0x24e6e0795b3c7c71D965fCc4f371803d1c1DcA1E"
            }
        },
    },
};

// function getValue(aaveV3: string, key: string): string | undefined {
//     return aaveV3[key];
//   }

//   function getKey(aaveV3: string, value: string): string | undefined {
//     for (const key in aaveV3) {
//       if (aaveV3[key] === value) {
//         return key;
//       }
//     }
//     return undefined;
//   }

// function getSupportedTokens(network: string, protocol: string, action: string): string[] | string {
//     if (tokensSupported[network] && tokensSupported[network][protocol] && tokensSupported[network][protocol][action]) {
//         const supportedTokens = tokensSupported[network][protocol][action];
//         return supportedTokens;
//     } else {
//         return 'Network, protocol, or action type not supported';
//     }
// }

// function findNativeTokenDetails(network: string, protocol: string, tokenSymbol: string): object | string {
//     // Check if the network, protocol, and token symbol are valid and available
//     if (supportedTokenDetails[network] && supportedTokenDetails[network][protocol] && supportedTokenDetails[network][protocol][tokenSymbol]) {
//         const tokenIndex = supportedTokenDetails[network][protocol][tokenSymbol];
//         const nativeTokenDetails = nativeTokens[network][tokenIndex];

//         if (nativeTokenDetails) {
//             return nativeTokenDetails;
//         } else {
//             return 'Native token details not found';
//         }
//     } else {
//         return 'Network, protocol, or token symbol not supported';
//     }
// }

// function findAbiDetailsForSupportedToken(token: string, protocol: string, network: string, chainId: string): object | string {
//     // Check if the token is supported in the given network and protocol
//     if (supportedTokenDetails[network] && supportedTokenDetails[network][protocol] && supportedTokenDetails[network][protocol][token]) {
//         // Retrieve the token index
//         const tokenIndex = supportedTokenDetails[network][protocol][token];

//         // Check if the ABI details are available for the given chainId and protocol
//         if (abiFetcher[chainId] && abiFetcher[chainId][protocol]) {
//             const abiDetails = abiFetcher[chainId][protocol];
//             // Return the relevant ABI details
//             return abiDetails;
//         } else {
//             return 'ABI details for the specified chainId and protocol not found';
//         }
//     } else {
//         return 'Token not supported in the specified network and protocol';
//     }
// }

// async function getAllLendingTokenInfo(network: string, protocol: string, chainId: string, address: string): Record<string, object> | string {
//     const lendingTokens = tokensSupported[network][protocol].Lending;
//     if (!lendingTokens) {
//         return 'Lending tokens not found for the specified network and protocol';
//     }

//     const lendingTokenInfoObject: Record<string, object> = {};
//     const provider = await getProvider(chainId);
//     lendingTokens.forEach(async (tokenSymbol) => {
//         const nativeTokenDetails = nativeTokens[network] && nativeTokens[network][tokenSymbol] ? nativeTokens[network][tokenSymbol] : null;
//         const abiDetails = abiFetcher[chainId] && abiFetcher[chainId][protocol] ? abiFetcher[chainId][protocol] : null;
//         // const shareTokenSymbol = tokenToShare[network] && tokenToShare[network][protocol] && tokenToShare[network][protocol][tokenSymbol];
//         // const shareTokenAddress = shareTokenSymbol && tokenAddressByProtocol[network] && tokenAddressByProtocol[network][protocol] && tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];

//         const contractInstance = await getContractInstance(nativeTokenDetails.nativeToken, IERC20, provider);
//         const balance = await getErc20Balanceof(contractInstance, address);


//         lendingTokenInfoObject[tokenSymbol] = {
//             nativeTokenDetails,
//             abiDetails,
//             balance,
//             type: 'Lending'
//         };
//     });

//     return lendingTokenInfoObject;
// }

// async function getAllBorrowTokenInfo(network: string, protocol: string, chainId: string, smartAccount): Record<string, object> | string {
//     const borrowTokens = tokensSupported[network][protocol].Borrow;
//     if (!borrowTokens) {
//         return 'Borrow tokens not found for the specified network and protocol';
//     }

//     const borrowTokenInfoObject: Record<string, object> = {};
//     borrowTokens.forEach(async (tokenSymbol) => {
//         // const tokenSymbol = Object.keys(tokenToShare[network][protocol]).find(key => tokenToShare[network][protocol][key] === shareTokenSymbol);

//         if (tokenSymbol) {
//             const nativeTokenDetails = nativeTokens[network] && nativeTokens[network][tokenSymbol] ? nativeTokens[network][tokenSymbol] : null;
//             const abiDetails = abiFetcher[chainId] && abiFetcher[chainId][protocol] ? abiFetcher[chainId][protocol] : null;
//             // const shareTokenSymbol = tokenToShare[network] && tokenToShare[network][protocol] && tokenToShare[network][protocol][tokenSymbol];
//             // const shareTokenAddress = shareTokenSymbol && tokenAddressByProtocol[network] && tokenAddressByProtocol[network][protocol] && tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol];

//             let abiInterface = new ethers.utils.Interface(poolv3);
//             const to = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
//             const contract = await getContractInstance(to, abiInterface, smartAccount.provider);
//             let balance: any = await contract?.getUserAccountData(smartAccount.address);
//             balance = bg(balance.availableBorrowsBase.toString()).multipliedBy(1e18).div(1e8)

//             const price: any = await fetchPrice(tokenSymbol, smartAccount.provider)
//             console.log('price: --- ', price.answer.toString())
//             const newPrice = bg(price.answer.toString()).multipliedBy(1e18).div(1e8)

//             const userCanBorrow = bg(balance).dividedBy(newPrice)

//             // eth = 2200
//             // balance can borrow = 2.5 usdc
//             // 1eth = 2200 usdc
//             // 2.5 = ?
//             // 2.5*2200/1eth

//             borrowTokenInfoObject[tokenSymbol] = {
//                 nativeTokenDetails,
//                 abiDetails,
//                 // shareTokenSymbol,
//                 // shareTokenAddress,
//                 balance: userCanBorrow,
//                 type: 'Borrow'
//             };
//         }
//     });

//     return borrowTokenInfoObject;
// }

// async function getAllRepayTokenInfo(network: string, protocol: string, chainId: string, address: string): Record<string, object> | string {
//     const repayTokens = tokensSupported[network][protocol].Repay;
//     if (!repayTokens) {
//         return 'Repay tokens not found for the specified network and protocol';
//     }

//     const repayTokenInfoObject: Record<string, object> = {};
//     const provider = await getProvider(chainId);
//     repayTokens.forEach(async (tokenSymbol) => {
//         const nativeTokenDetails = nativeTokens[network] && nativeTokens[network][tokenSymbol] ? nativeTokens[network][tokenSymbol] : null;
//         const abiDetails = abiFetcher[chainId] && abiFetcher[chainId][protocol] ? abiFetcher[chainId][protocol] : null;
//         const shareTokenSymbol = tokenToShare[network] && tokenToShare[network][protocol] && tokenToShare[network][protocol][tokenSymbol];
//         const shareTokenAddress = shareTokenSymbol && tokenAddressByProtocol[network] && tokenAddressByProtocol[network][protocol] && tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol];

//         const contractInstance = await getContractInstance(shareTokenAddress, IERC20, provider);
//         const balance = await getErc20Balanceof(contractInstance, address);

//         repayTokenInfoObject[tokenSymbol] = {
//             nativeTokenDetails,
//             abiDetails,
//             shareTokenSymbol,
//             shareTokenAddress,
//             balance,
//             type: 'Repay'
//         };
//     });

//     return repayTokenInfoObject;
// }

// async function getAllWithdraeTokenInfo(network: string, protocol: string, chainId: string, address: string): Record<string, object> | string {
//     const withdrawTokens = tokensSupported[network][protocol].Withdraw;
//     if (!withdrawTokens) {
//         return 'Repay tokens not found for the specified network and protocol';
//     }

//     const withdrawTokenInfoObject: Record<string, object> = {};
//     const provider = await getProvider(chainId);
//     withdrawTokens.forEach(async (tokenSymbol) => {
//         const nativeTokenDetails = nativeTokens[network] && nativeTokens[network][tokenSymbol] ? nativeTokens[network][tokenSymbol] : null;
//         const abiDetails = abiFetcher[chainId] && abiFetcher[chainId][protocol] ? abiFetcher[chainId][protocol] : null;
//         const shareTokenSymbol = tokenToShare[network] && tokenToShare[network][protocol] && tokenToShare[network][protocol][tokenSymbol];
//         const shareTokenAddress = shareTokenSymbol && tokenAddressByProtocol[network] && tokenAddressByProtocol[network][protocol] && tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];

//         const contractInstance = await getContractInstance(shareTokenAddress, IERC20, provider);
//         const balance = await getErc20Balanceof(contractInstance, address);

//         withdrawTokenInfoObject[tokenSymbol] = {
//             nativeTokenDetails,
//             abiDetails,
//             shareTokenSymbol,
//             shareTokenAddress,
//             balance,
//             type: 'Repay'
//         };
//     });

//     return withdrawTokenInfoObject;
// }


// async function getBalanceForLendingRepayingWithdrawing(nativeTokenDetails, provider, address) {
//     const contractInstance = await getContractInstance(nativeTokenDetails.nativeToken, IERC20, provider);
//     return await getErc20Balanceof(contractInstance, address);
// }

// async function getBorrowBalance(nativeTokenDetails, tokenSymbol, smartAccount) {
//     let abiInterface = new ethers.utils.Interface(poolv3);
//     const to = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
//     const contract = await getContractInstance(to, abiInterface, smartAccount.provider);
//     let balance = await contract?.getUserAccountData(smartAccount.address);
//     balance = bg(balance.availableBorrowsBase.toString()).multipliedBy(1e18).div(1e8);

//     const price = await fetchPrice(tokenSymbol, smartAccount.provider);
//     const newPrice = bg(price.answer.toString()).multipliedBy(1e18).div(1e8);

//     return bg(balance).dividedBy(newPrice);
// }

// async function getAllTokenInfoByAction(network: string, protocol: string, chainId: string, address: string, action: ActionType): Promise<Record<string, object> | string> {
//     const actionTokens = tokensSupported[network][protocol][action];
//     if (!actionTokens) {
//         return `${action} tokens not found for the specified network and protocol`;
//     }

//     const tokenInfoObject: Record<string, object> = {};
//     const provider = await getProvider(chainId);

//     for (const tokenSymbol of actionTokens) {
//         const nativeTokenDetails = nativeTokens[network] && nativeTokens[network][tokenSymbol] ? nativeTokens[network][tokenSymbol] : null;
//         if (!nativeTokenDetails) continue;

//         const abiDetails = abiFetcher[chainId] && abiFetcher[chainId][protocol] ? abiFetcher[chainId][protocol] : null;

//         let balance, shareTokenSymbol, shareTokenAddress;
//         switch (action) {
//             case 'Lending':
//                 balance = await getBalanceForLendingRepayingWithdrawing(nativeTokenDetails, provider, address);
//                 break;
//             case 'Borrowing':
//                 balance = await getBorrowBalance(nativeTokenDetails, tokenSymbol, { address, provider });
//                 break;
//             case 'Repaying':
//             case 'Withdrawing':
//                 shareTokenSymbol = tokenToShare[network][protocol][tokenSymbol];
//                 shareTokenAddress = action === 'Repaying'
//                     ? tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol]
//                     : tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];
//                 balance = await getBalanceForLendingRepayingWithdrawing({nativeToken: shareTokenAddress}, provider, address);
//                 break;
//         }

//         tokenInfoObject[tokenSymbol] = {
//             nativeTokenDetails,
//             abiDetails,
//             shareTokenSymbol,
//             shareTokenAddress,
//             balance,
//             type: action
//         };
//     }

//     return tokenInfoObject;
// }
