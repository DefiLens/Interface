import { BigNumber } from "ethers";
import { ADDRESS_ZERO } from "@uniswap/v3-sdk";
import { dai, ethereum, polygon, usdc, usdt } from "../../assets/images";

export const BIG_ZERO = BigNumber.from(0);
export const implementation_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
export const _functionType = 1;
export const _nonce = 1;
export const BYTES_ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000"
export const ZERO_ADDRESS = ADDRESS_ZERO
export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const ExecutionMethodsList = [
    {
        isEnable: true,
        title: 'Simulate',
        providerName: 'isSimulate',
        icons: [
            {
                name: 'ethereum',
                icon: ethereum,
                style: 'translate-x-5'
            },
            {
                name: 'polygon',
                icon: polygon,
                style: 'z-0 translate-x-2.5'
            },
        ],
    },
    {
        isEnable: true,
        title: 'Pay via Native Tokens',
        providerName: 'isAA',
        icons: [
            {
                name: 'ethereum',
                icon: ethereum,
                style: 'translate-x-5'
            },
            {
                name: 'polygon',
                icon: polygon,
                style: 'z-0 translate-x-2.5'
            },
        ],
    },
    {
        isEnable: false,
        title: 'Pay via ERC20',
        providerName: 'isERC20',
        icons: [
            {
                name: 'dai',
                icon: dai,
                style: 'translate-x-5'
            },
            {
                name: 'usdc',
                icon: usdc,
                style: 'z-0 translate-x-2.5'
            },
            {
                name: 'usdt',
                icon: usdt,
                style: 'z-10'
            },
        ],
    },
]
