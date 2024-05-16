import toast from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import IERC20 from "../../abis/IERC20.json";
import { ChainIdDetails } from "../data/network";

export const getProvider = async (chainId): Promise<ethers.providers.JsonRpcProvider | undefined> => {
    try {
        const newprovider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(ChainIdDetails[chainId].rpcURL);
        return newprovider;
    } catch (error) {
        console.error("getProvider-error", error);
        return;
    }
};

export const getContractInstance = async (address, abi, provider): Promise<ethers.Contract | undefined> => {
    try {
        const instance = await new ethers.Contract(address, abi, provider);
        return instance;
    } catch (error) {
        console.error("getContractInstance-error", error);
        return;
    }
};

export async function getErc20Data(token, address, spender, provider) {
    try {
        if (!address || !spender) {
            toast.error("Invalid addresses");
            return;
        }
        const erc20: any = await getContractInstance(token, IERC20, provider);

        const [name, symbol, decimals, totalSupply, balance, allowance] = await Promise.all([
            erc20.name(),
            erc20.symbol(),
            erc20.decimals(),
            erc20.totalSupply(),
            erc20.balanceOf(address),
            erc20.allowance(address, spender),
        ]);
        return { name, symbol, decimals, totalSupply, balance, allowance };
    } catch (error) {
        console.error("ERC20Data-error", error);
    }
}

export const getErc20Balanceof = async (erc20: ethers.Contract, address: string): Promise<BigNumber | undefined> => {
    try {
        return await erc20.balanceOf(address);
    } catch (error) {
        console.error("getErc20Balanceof-error", error);
        return;
    }
};

export const getErc20Decimals = async (erc20): Promise<number | undefined> => {
    try {
        return await erc20.decimals();
    } catch (error) {
        console.error("getErc20Decimals-error", error);
        return;
    }
};

export const getErc20Allownace = async (erc20, from, spender): Promise<BigNumber | undefined> => {
    try {
        return await erc20.allowance(from, spender);
    } catch (error) {
        console.error("getErc20Allownace-error", error);
        return;
    }
};
