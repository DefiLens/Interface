// 109 : Polygon
// 106 : Avalanche
// 110 : Arbitrum
// 111 : Optimism
// 101 : Ethereum

const contractAddressesByNetwork = {
    '109': [
        {
            contractName: "Polygon: AAVE Lending POOL-V3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        },
    ],
    '106': [
        {
            contractName: "Avalanche: AAVE Lending POOL-V3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        },
    ],
    '110': [
        {
            contractName: "Arbitrum: AAVE Lending POOL-V3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        },
    ],
    '111': [
        {
            contractName: "Optimism: AAVE Lending POOL-V3",
            contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        },
    ],
    '101': [
        {
            contractName: "Ethereum: AAVE Lending POOL-V3",
            contractAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
        },
    ]
}
const contractMetaDataByNetwork = {
    '109': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            methodNames: ["supply"],
            amountFieldIndex: [1],
        },
    },
    '106': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            methodNames: ["supply"],
            amountFieldIndex: [1]
        }
    },
    '110': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            methodNames: ["supply", "supply"],
            amountFieldIndex: [1, -1],
        }
    },
    '111': {
        "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
            methodNames: ["supply", "supply"],
            amountFieldIndex: [1, -1],
        }
    },
    '101': {
        "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2": {
            methodNames: ["supply"],
            amountFieldIndex: [1]
        }
    },
}
const tokensByNetwork = {
    '109':  {
        usdc: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    },
    '106':  {
        usdc: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    },
    '110':  {
        usdc: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    },
    '111':  {
        usdc: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    },
    '101':  {
        usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    }

}
const ChainPingByNetwork = {
    '109': '',
    '106': '0x6FE8e3E0c47043f136640dF7972C1e3F144B807F',
    '110': '0xBA821135197bB2614F5Bd8943b5d1607288DC60d',
    '111': '0x934E5421D4ce678ae4c4B136306Fbee91bfDBbC8',
    '101': '',
}
const StarGateROuterByNetwork = {
    '109': '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
    '106': '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
    '110': '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
    '111': '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
    '101': '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
}
