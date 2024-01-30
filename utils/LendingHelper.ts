import { getContractInstance, getErc20Balanceof, getProvider } from "./web3Libs/ethers";
import IERC20 from "../abis/IERC20.json";
import poolv3 from "../abis/aave/poolv3.json";
import { ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
import Ichainlink from "../abis/chainlink.json";
import {
    abiFetcher,
    nativeTokens,
    supportedTokenDetails,
    tokenAddressByProtocol,
    tokenToShare,
    tokensSupported,
} from "./data/LendingSingleTon";
bg.config({ DECIMAL_PLACES: 10 });

export async function fetchPrice(token: string, provider: any) {
    try {
        const priceFeeds = {
            cbETH: {
                feed: "0xd7818272B9e248357d13057AAb0B417aF31E817d",
                decimal: 8,
            },
            WETH: {
                feed: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
                decimal: 8,
            },
            USDC: {
                feed: "0x7e860098F58bBFC8648a4311b374B1D669a2bc6B",
                decimal: 8,
            },
            USDbC: {
                feed: "0x7e860098F58bBFC8648a4311b374B1D669a2bc6B",
                decimal: 8,
            },
            wstETH: {
                feed: "0xa669E5272E60f78299F4824495cE01a3923f4380",
                decimal: 8,
            },
        };

        const priceFeed = await getContractInstance(priceFeeds[token].feed, Ichainlink, provider);
        let roundData = await priceFeed?.latestRoundData();
        console.log("roundData: ", roundData.answer.toString());
        let price = roundData.answer;

        if (token == "wstETH") {
            const priceFeed = await getContractInstance(priceFeeds["WETH"].feed, Ichainlink, provider);
            const ethRoundData = await priceFeed?.latestRoundData();
            console.log("roundData-new: ", ethRoundData.answer.toString());

            let answer = bg(ethRoundData.answer.toString()).multipliedBy(1e10);
            console.log("answer-new-: ", answer.toString());

            let newPrice = bg(roundData.answer.toString()).multipliedBy(answer).div(1e28).toFixed(0);
            console.log("newPrice-new: ", newPrice.toString());
            price = newPrice;
        }
        console.log("price-new: ", price.toString());

        return price;
    } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
    }
}

function getSupportedTokens(network: string, protocol: string, action: string): string[] | string {
    if (tokensSupported[network] && tokensSupported[network][protocol] && tokensSupported[network][protocol][action]) {
        const supportedTokens = tokensSupported[network][protocol][action];
        return supportedTokens;
    } else {
        return "Network, protocol, or action type not supported";
    }
}

async function getBalanceForLendingRepayingWithdrawing(nativeTokenDetails, smartAccount) {
    const contractInstance = await getContractInstance(nativeTokenDetails.nativeToken, IERC20, smartAccount.provider);
    return await getErc20Balanceof(contractInstance, smartAccount.accountAddress);
}

async function getBorrowBalance(nativeTokenDetails, tokenSymbol, smartAccount) {
    let abiInterface = new ethers.utils.Interface(poolv3);
    const to = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
    const contract = await getContractInstance(to, abiInterface, smartAccount.provider);
    let balance = await contract?.getUserAccountData(smartAccount.accountAddress);
    balance = bg(balance.availableBorrowsBase.toString()).multipliedBy(1e18).div(1e8);

    const price = await fetchPrice(tokenSymbol, smartAccount.provider);
    const newPrice = bg(price.toString()).multipliedBy(1e18).div(1e8);

    return bg(balance).dividedBy(newPrice);
}

export async function getAllTokenInfoByAction(
    network: string,
    protocol: string,
    chainId: string,
    smartAccount: any,
    action: string
): Promise<Record<string, object> | string> {
    const actionTokens = tokensSupported[network][protocol][action];
    if (!actionTokens) {
        return `${action} tokens not found for the specified network and protocol`;
    }
    const tokenInfoObject: Record<string, object> = {};
    for (let tokenSymbol of actionTokens) {
        const tokenIndex =
            supportedTokenDetails[network] &&
            supportedTokenDetails[network][protocol] &&
            supportedTokenDetails[network][protocol][tokenSymbol]
                ? supportedTokenDetails[network][protocol][tokenSymbol]
                : "";
        const nativeTokenDetails =
            nativeTokens[chainId] && nativeTokens[chainId][tokenIndex] ? nativeTokens[chainId][tokenIndex] : null;
        if (!nativeTokenDetails) continue;

        const abiDetails = abiFetcher[chainId] && abiFetcher[chainId][protocol] ? abiFetcher[chainId][protocol] : null;

        let balance, shareTokenSymbol, shareTokenAddress, debtTokenSymbol, debtTokenAddress;
        switch (action) {
            case "Lending":
                shareTokenSymbol = tokenToShare[network][protocol][tokenSymbol];
                shareTokenAddress = tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];
                debtTokenAddress = tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol];
                // balance = await getBalanceForLendingRepayingWithdrawing(nativeTokenDetails, smartAccount);
                break;
            case "Borrow":
                shareTokenSymbol = tokenToShare[network][protocol][tokenSymbol];
                shareTokenAddress = tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];
                debtTokenAddress = tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol];
                // balance = await getBorrowBalance(nativeTokenDetails, tokenSymbol, smartAccount);
                break;
            case "Repay":
            case "Withdraw":
                // const tempTokenSymbol = Object.keys(tokenToShare[network][protocol]).find(
                //     (key) => tokenToShare[network][protocol][key] === tokenSymbol
                // );
                shareTokenSymbol = tokenToShare[network][protocol][tokenSymbol];
                shareTokenAddress = tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];
                debtTokenAddress = tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol];
                break;
        }

        tokenInfoObject[tokenSymbol.toLowerCase()] = {
            network,
            chainId,
            nativeTokenDetails,
            abiDetails,
            shareTokenSymbol,
            shareTokenAddress,
            debtTokenAddress,
            balance: "0",
            apy: 3.2,
            HF: 1.2,
            type: action,
            protocol: protocol,
        };
    }
    console.log("tokenInfoObject: ", tokenInfoObject);
    return tokenInfoObject;
}
