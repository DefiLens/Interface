import { MAINNET_INFURA } from "./keys"

export const avaxRPCUrl = `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`

export const implementation_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

export const _functionType = 1
export const _nonce = 1

export const polygonUSDTAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
export const polygonUSDCAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
export const polygonDAIAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"

export const avaxUSDTAddress = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7" // avax mainnet usdt
export const avaxUSDCAddress = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"

export const polygonStargateRouter = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd"

export const ChainPingToContractAddress = "0x6FE8e3E0c47043f136640dF7972C1e3F144B807F" // CHainPing Contract Address on Avalanche Network

export const contractDataByNetwork = [
    {
        // avax stargate chainId
        106: {
            "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
                methodNames: ["supply", "repay"],
                amountFieldIndex: [1, 1],
                contractName: "AAVE Lending POOL-V3",
                network: "Avalanche",
            },
        },
    },
]

export const avaxContracts = [
    {
        contractName: "AAVE Lending POOL-V3",
        contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
]