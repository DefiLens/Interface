import { BigNumber, ethers } from "ethers"
import { rpscURLS } from "../constants"

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

export const getErc20Balanceof = async (erc20, address): Promise<BigNumber | undefined> => {
    try {
        return await erc20.balanceOf(address)
    } catch (error) {
        console.log("getErc20Balanceof-error", error)
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