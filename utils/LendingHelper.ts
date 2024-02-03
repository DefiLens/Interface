import { getContractInstance, getErc20Balanceof, getProvider } from "./web3Libs/ethers";
import IERC20 from "../abis/IERC20.json";
import poolv3 from "../abis/aave/poolv3.json";
import { ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
import Ichainlink from "../abis/chainlink.json";
import { abiFetcher, nativeTokens, supportedTokenDetails, tokenAddressByProtocol, tokenToShare, tokensSupported } from "./data/LendingSingleTon";
import { tokenPriceFeeds, tokenPriceFeedsInETH } from "./data/ConstantInfo/priceFeed";
bg.config({ DECIMAL_PLACES: 10 });

export async function fetchPrice(chainId, token: string, provider: any) {
    try {
        const priceFeeds = tokenPriceFeeds;
        const priceFeed = await getContractInstance(priceFeeds[chainId][token].feed, Ichainlink, provider);
        let roundData = await priceFeed?.latestRoundData();
        let price = roundData.answer;
        if (token == "wstETH" && chainId == "8453") {
            const priceFeed = await getContractInstance(priceFeeds["WETH"].feed, Ichainlink, provider);
            const ethRoundData = await priceFeed?.latestRoundData();
            let answer = bg(ethRoundData.answer.toString()).multipliedBy(1e10);
            let newPrice = bg(roundData.answer.toString()).multipliedBy(answer).div(1e28).toFixed(0);
            price = newPrice;
        }
        if (token == "rETH" && chainId == "10") {
            const priceFeed = await getContractInstance(priceFeeds["WETH"].feed, Ichainlink, provider);
            const ethRoundData = await priceFeed?.latestRoundData();
            let answer = bg(ethRoundData.answer.toString()).multipliedBy(1e10);
            let newPrice = bg(roundData.answer.toString()).multipliedBy(answer).div(1e28).toFixed(0);
            price = newPrice;
        }
        return price;
    } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
    }
}

export async function fetchPriceForETH(chainId, token: string, provider: any) {
    try {
        const priceFeeds = tokenPriceFeedsInETH;
        const priceFeed = await getContractInstance(priceFeeds[chainId][token].feed, Ichainlink, provider);
        let roundData = await priceFeed?.latestRoundData();
        let price = roundData.answer;
        // if (token == "wstETH" && chainId == "8453") {
        //     const priceFeed = await getContractInstance(priceFeeds["WETH"].feed, Ichainlink, provider);
        //     const ethRoundData = await priceFeed?.latestRoundData();
        //     let answer = bg(ethRoundData.answer.toString()).multipliedBy(1e10);
        //     let newPrice = bg(roundData.answer.toString()).multipliedBy(answer).div(1e28).toFixed(0);
        //     price = newPrice;
        // }
        // if (token == "rETH" && chainId == "10") {
        //     const priceFeed = await getContractInstance(priceFeeds["WETH"].feed, Ichainlink, provider);
        //     const ethRoundData = await priceFeed?.latestRoundData();
        //     let answer = bg(ethRoundData.answer.toString()).multipliedBy(1e10);
        //     let newPrice = bg(roundData.answer.toString()).multipliedBy(answer).div(1e28).toFixed(0);
        //     price = newPrice;
        // }
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

async function getBorrowBalance(to, nativeTokenDetails, tokenSymbol, smartAccount) {
    let abiInterface = new ethers.utils.Interface(poolv3);
    const contract = await getContractInstance(to, abiInterface, smartAccount.provider);
    let balance = await contract?.getUserAccountData(smartAccount.accountAddress);
    balance = bg(balance.availableBorrowsBase.toString()).multipliedBy(1e18).div(1e8);
    const price = await fetchPrice(smartAccount.chainId, tokenSymbol, smartAccount.provider);
    const newPrice = bg(price.toString()).multipliedBy(1e18).div(1e8);
    return bg(balance).dividedBy(newPrice).multipliedBy(bg(10).pow(nativeTokenDetails.decimals));
}

async function getBorrowBalanceInETH(to, nativeTokenDetails, tokenSymbol, smartAccount) {
    let abiInterface = new ethers.utils.Interface(poolv3);
    const contract = await getContractInstance(to, abiInterface, smartAccount.provider);
    let balance = await contract?.getUserAccountData(smartAccount.accountAddress);
    console.log('balance===++', balance, to)
    balance = bg(balance.availableBorrowsBase.toString());
    console.log('balance===', tokenSymbol, balance.toString())
    if (tokenSymbol != "WETH" && tokenSymbol != "ETH" && tokenSymbol != "weth" && tokenSymbol && "eth") {
        console.log('tokenSymbol===', tokenSymbol, balance.toString())
        const price = await fetchPriceForETH(smartAccount.chainId, tokenSymbol, smartAccount.provider);
        console.log('balance price===', price.toString())
        const newPrice = bg(price.toString());
        console.log('balance newPrice===', newPrice.toString())
        return bg(balance).dividedBy(newPrice).multipliedBy(bg(10).pow(nativeTokenDetails.decimals));
    } else {
        console.log('tokenSymbol===+++', tokenSymbol, balance.toString())
        return bg(balance);
    }
}

export async function getAllTokenInfoByAction(network: string, protocol: string, chainId: string, smartAccount: any, action: string): Promise<Record<string, object> | string> {
    const actionTokens = tokensSupported[network][protocol][action];
    // console.log('actionTokens', actionTokens, network, protocol, action)
    if (!actionTokens) {
        return `${action} tokens not found for the specified network and protocol`;
    }
    const tokenInfoObject: Record<string, object> = {};
    for (let tokenSymbol of actionTokens) {
        // console.log('supportedTokenDetails[network]-1', supportedTokenDetails[network][protocol])

        const tokenIndex = supportedTokenDetails[network] && supportedTokenDetails[network][protocol] && supportedTokenDetails[network][protocol][tokenSymbol] ? supportedTokenDetails[network][protocol][tokenSymbol] : "";
        // console.log('tokenIndex-1', tokenIndex)

        const nativeTokenDetails = nativeTokens[chainId] && nativeTokens[chainId][tokenIndex] ? nativeTokens[chainId][tokenIndex] : null;
        // console.log('nativeTokenDetails-1', nativeTokenDetails)
        if (!nativeTokenDetails) continue;
        // console.log('nativeTokenDetails', nativeTokenDetails)

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
                // const tempTokenSymbol = Object.keys(tokenToShare[network][protocol]).find(
                //     (key) => tokenToShare[network][protocol][key] === tokenSymbol
                // );
                // console.log('tempTokenSymbol: ', tempTokenSymbol, tokenSymbol)
                shareTokenSymbol = tokenToShare[network][protocol][tokenSymbol];
                shareTokenAddress = tokenAddressByProtocol[network][protocol].lendAssets[shareTokenSymbol];
                debtTokenAddress = tokenAddressByProtocol[network][protocol].borrowAssets[shareTokenSymbol];
                break;
            case "Withdraw":
                const tempTokenSymbol = Object.keys(tokenToShare[network][protocol]).find(
                    (key) => tokenToShare[network][protocol][key] === tokenSymbol
                );
                tokenSymbol = tempTokenSymbol
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
            tokenSymbol
        };
    }
    console.log("tokenInfoObject: ", tokenInfoObject);
    return tokenInfoObject;
}

export async function getActionBalance(actionObject, action, smartAccount) {
    try {
        const provider = smartAccount.provider;
        const nativeToken = actionObject.nativeTokenDetails.nativeToken;
        const shareToken = actionObject.shareTokenAddress;
        const debtToken = actionObject.debtTokenAddress;
        if (action == "Lending") {
            const erc20 = await getContractInstance(nativeToken, IERC20, provider);
            const balance = await getErc20Balanceof(erc20, smartAccount.accountAddress);
            return balance;
        } else if (action == "Withdraw") {
            const erc20 = await getContractInstance(shareToken, IERC20, provider);
            const balance = await getErc20Balanceof(erc20, smartAccount.accountAddress);
            return balance;
        } else if (action == "Borrow") {
            let balance
            console.log('actionObject ' + actionObject.protocol)
            if (actionObject.protocol == "aaveV2"){
                console.log('actionObject ', actionObject.tokenSymbol + " " + actionObject.protocol)
                balance = await getBorrowBalanceInETH(actionObject.abiDetails.contractAddress, actionObject.nativeTokenDetails, actionObject.tokenSymbol, smartAccount)
                console.log('actionObject ',balance)
            } else {
                balance = await getBorrowBalance(actionObject.abiDetails.contractAddress, actionObject.nativeTokenDetails, actionObject.tokenSymbol, smartAccount)
            }
            return balance;
        } else if (action == "Repay") {
            const erc20 = await getContractInstance(debtToken, IERC20, provider);
            const balance = await getErc20Balanceof(erc20, smartAccount.accountAddress);
            return balance;
        }
    } catch (error) {
        console.log("getActionBalance:error: ", error);
    }
}

export async function getHF(protocol, smartAccount, chainId) {
    try {
        if (protocol == "aaveV3") {
            let abiInterface = new ethers.utils.Interface(poolv3);
            let to
            if (chainId == "137") {
                to = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
            } else if(chainId == "8453") {
                to = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
            } else if(chainId == "10") {
                to = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
            }
            const contract = await getContractInstance(to, abiInterface, smartAccount.provider);
            let userData = await contract?.getUserAccountData(smartAccount.accountAddress);
            let hf = bg(userData.healthFactor.toString()).div(1e18);
            // console.log('userData: ', userData)
            return hf
        }
    } catch (error) {
        console.log("getActionBalance:error: ", error);
    }
}

