import { BigNumber, ethers } from "ethers"
import { rpscURLS } from "../constants"
import IERC20 from "../../abis/IERC20.json";

export const getProvider = async (toChainId) => {
    try {
        const newprovider = new ethers.providers.JsonRpcProvider(rpscURLS[toChainId])
        return newprovider
    } catch (error) {
        console.log("getProvider-error", error)
        return
    }
}

export const getContractInstance = async (address, abi, provider) : Promise<ethers.Contract | undefined> => {
    try {
        const instance = await new ethers.Contract(address, abi, provider)
        return instance
    } catch (error) {
        console.log("getContractInstance-error", error)
        return
    }
}

export async function getErc20Data(token, address, spender, provider) {
    try {
    console.log('getErc20Data', token, address, spender);
      if (!address || !spender) throw 'Invalid addresses';
      console.log('getErc20Data', token, address, spender);
      const erc20: any = await getContractInstance(token, IERC20, provider);
      console.log('getErc20Data', erc20);

      const [name, symbol, decimals, totalSupply, balance, allowance] =
        await Promise.all([
          erc20.name(),
          erc20.symbol(),
          erc20.decimals(),
          erc20.totalSupply(),
          erc20.balanceOf(address),
          erc20.allowance(address, spender),
        ]);
      return { name, symbol, decimals, totalSupply, balance, allowance };
    } catch (error) {
      console.log('ERC20Data-error', error);
    }
  }

export const getErc20Balanceof = async (erc20, address): Promise<BigNumber | undefined> => {
    try {
        return await erc20.balanceOf(address)
    } catch (error) {
        console.log("getErc20Balanceof-error", error)
        return
    }
}

export const getErc20Decimals = async (erc20): Promise<BigNumber | undefined> => {
    try {
        return await erc20.decimals()
    } catch (error) {
        console.log("getErc20Decimals-error", error)
        return
    }
}

export const getErc20Allownace = async (erc20, from, spender): Promise<BigNumber | undefined> => {
    try {
        return await erc20.allowance(from, spender)
    } catch (error) {
        console.log("getErc20Allownace-error", error)
        return
    }
}

// export const getProvider3 = async () => {
//     try {

//     } catch (error) {
//         console.log("getProvider3-error", error)
//     }
// }