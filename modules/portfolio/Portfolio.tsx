import Image from "next/image";
import { tPortfolio } from "./types";
import { ChainIdDetails } from "../../utils/data/network";
import { defaultBlue } from "../../assets/images";
import { startCase } from "lodash";

const aggregatedData = [
    {
        "tokenAddress": "0x086373fad3447f7f86252fb59d56107e9e0faafa",
        "amount": "100000000000000000",
        "decimals": 18,
        "name": "Yup",
        "symbol": "YUP",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x086373fad3447f7f86252fb59d56107e9e0faafa/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x0b91b07beb67333225a5ba0259d55aee10e3a578",
        "amount": "30000000000000",
        "decimals": 8,
        "name": "Minereum Polygon",
        "symbol": "MNEP",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x0b91b07beb67333225a5ba0259d55aee10e3a578/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x1a13f4ca1d028320a707d99520abfefca3998b7f",
        "amount": "160769602",
        "decimals": 6,
        "name": "Aave Matic Market USDC",
        "subtitle": "amUSDC",
        "apy": 6.21698,
        "protocol": {
            "name": "aave-v2",
            "slug": "aave-v2",
            "logo": "https://icons.llama.fi/aave-v2.png",
            "url": "https://aave.com\r\n",
            "description": "Aave is an Open Source and Non-Custodial protocol to earn interest on deposits and borrow assets",
            "twitter": "aave",
            "category": "Lending",
            "chainIds": [
                137
            ]
        },
        "underlyingTokens": [
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
        ],
        "type": "defiToken"
    },
    {
        "tokenAddress": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        "amount": "20386285",
        "decimals": 6,
        "name": "USD Coin (PoS)",
        "symbol": "USDC_1",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x2791bca1f2de4661ed88a30c99a7a9449aa84174/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x3c0bd2118a5e61c41d2adeebcb8b7567fde1cbaf",
        "amount": "33161032200000",
        "decimals": 18,
        "name": "Cookie",
        "symbol": "CKIE",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x3c0bd2118a5e61c41d2adeebcb8b7567fde1cbaf/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x60d55f02a771d515e077c9c2403a1ef324885cec",
        "amount": "4229668",
        "decimals": 6,
        "name": "Aave Matic Market USDT",
        "subtitle": "amUSDT",
        "apy": 13.86565,
        "protocol": {
            "name": "aave-v2",
            "slug": "aave-v2",
            "logo": "https://icons.llama.fi/aave-v2.png",
            "url": "https://aave.com\r\n",
            "description": "Aave is an Open Source and Non-Custodial protocol to earn interest on deposits and borrow assets",
            "twitter": "aave",
            "category": "Lending",
            "chainIds": [
                137
            ]
        },
        "underlyingTokens": [
            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
        ],
        "type": "defiToken"
    },
    {
        "tokenAddress": "0x625e7708f30ca75bfd92586e17077590c60eb4cd",
        "amount": "10176",
        "decimals": 6,
        "name": "Aave Optimism USDC",
        "subtitle": "aOptUSDC",
        "apy": 9.74859,
        "protocol": {
            "name": "aave-v3",
            "slug": "aave-v3",
            "logo": "https://icons.llama.fi/aave-v3.png",
            "url": "https://aave.com",
            "description": "Earn interest, borrow assets, and build applications",
            "twitter": "aave",
            "category": "Lending",
            "chainIds": [
                10
            ]
        },
        "underlyingTokens": [
            "0x7F5c764cBc14f9669B88837ca1490cCa17c31607"
        ],
        "type": "defiToken"
    },
    {
        "tokenAddress": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        "amount": "53514256860303350",
        "decimals": 18,
        "name": "Ether",
        "symbol": "ETH",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c",
        "amount": "9041758781712624",
        "decimals": 18,
        "name": "Compound",
        "symbol": "COMP",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
        "amount": "15353995500546963000",
        "decimals": 18,
        "name": "(PoS) Dai Stablecoin",
        "symbol": "DAI",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f",
        "amount": "5484829439885322000",
        "decimals": 18,
        "name": "1Inch (PoS)",
        "symbol": "1INCH",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0x9c2c5fd7b07e95ee044ddeba0e97a665f142394f/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        "amount": "1779263",
        "decimals": 6,
        "name": "Tether USD",
        "symbol": "USDT",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0xc2132d05d31c914a87c6611c10748aeb04b58e8f/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
        "amount": "41156060822845430",
        "decimals": 18,
        "name": "Aave",
        "symbol": "AAVE",
        "logoURI": "https://metadata-service.herokuapp.com/api/token/137/0xd6df932a45c0f255f85145f286ea0b292b21c90b/icon",
        "chainId": 137,
        "type": "erc20Token"
    },
    {
        "tokenAddress": "0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171",
        "amount": "186201114116835500",
        "decimals": 18,
        "name": "Curve.fi amDAI/amUSDC/amUSDT",
        "subtitle": "am3CRV",
        "apy": 10.39074,
        "protocol": {
            "name": "curve-dex",
            "slug": "curve-dex",
            "logo": "https://icons.llama.fi/curve.png",
            "url": "https://curve.fi",
            "description": "Curve is a decentralized exchange liquidity pool on Ethereum designed for extremely efficient stablecoin trading",
            "twitter": "CurveFinance",
            "category": "Dexes",
            "chainIds": [
                137
            ]
        },
        "underlyingTokens": [
            "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
            "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
            "0x60D55F02A771d515e077c9C2403a1ef324885CeC"
        ],
        "type": "defiToken"
    }
]

const Portfolio: React.FC<any> = ({}: tPortfolio) => (
    <div className="w-full flex flex-col justify-center items-center gap-10 p-5 sm:p-10 md:p-14 lg:p-20">
        <div className="w-full bg-backgound-500 flex flex-col justify-start items-start gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg p-8">
            <div className="w-full text-lg md:text-xl font-extrabold text-primary-100">
                Wallet:
            </div>
            <div className="w-full flex justify-end items-center gap-2 text-lg md:text-xl font-extrabold text-primary-100 py-1 my-2 border-b border-b-backgound-900">
                <div className="w-full text-start">
                    Asset
                </div>
                <div className="w-[25%] text-center">
                    Price
                </div>
                <div className="w-[25%] text-center">
                    Balance
                </div>
            </div>
            {aggregatedData.length > 0 && aggregatedData.filter((token: any) => token.type === "erc20Token")
            .map((item) => (
                <div
                    key={item.tokenAddress}
                    className="w-full flex justify-end items-center gap-2 text-sm md:text-base font-medium text-primary-100 py-1"
                >
                    <div className="w-full flex justify-start items-center gap-3 text-start">
                        <Image
                            height={100}
                            width={100}
                            src={item.logoURI ? item.logoURI : defaultBlue}
                            alt=""
                            className="h-10 w-10 rounded-full cursor-pointer"
                        />
                        <div className="flex flex-col justify-start items-start gap-1">
                            <div>
                                {item.name}
                            </div>
                            <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                <Image
                                    src={ChainIdDetails[item?.chainId].networkLogo}
                                    alt=""
                                    className="h-4 w-4 rounded-full cursor-pointer"
                                />
                                {startCase(ChainIdDetails[item?.chainId].networkName)}
                            </div>
                        </div>
                    </div>
                    <div className="w-[25%] text-center">
                        {item.chainId}
                    </div>
                    <div className="w-[25%] text-center">
                        {item.type}
                    </div>
                </div>
            ))}
        </div>
        <div className="w-full bg-backgound-500 flex flex-col justify-start items-start gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg p-8">
            <div className="w-full text-lg md:text-xl font-extrabold text-primary-100">
                Defi Tokens:
            </div>
            <div className="w-full flex justify-end items-center gap-2 text-lg md:text-xl font-extrabold text-primary-100 py-1 my-2 border-b border-b-backgound-900">
                <div className="w-full text-start">
                    Asset
                </div>
                <div className="w-[25%] text-center">
                    Category
                </div>
                <div className="w-[25%] text-center">
                    Price
                </div>
                <div className="w-[25%] text-center">
                    Balance
                </div>
            </div>
            {aggregatedData.length > 0 && aggregatedData.filter((token: any) => token.type === "defiToken")
            .map((item) => (
                <div
                    key={item.tokenAddress}
                    className="w-full flex justify-end items-center gap-2 text-sm md:text-base font-medium text-primary-100 py-1"
                >
                    <div className="w-full flex justify-start items-center gap-3 text-start">
                        <Image
                            height={100}
                            width={100}
                            src={item?.protocol?.logo ? item?.protocol?.logo : defaultBlue}
                            alt=""
                            className="h-10 w-10 rounded-full cursor-pointer"
                        />
                        <div className="flex flex-col justify-start items-start gap-1">
                            <div>
                                {item.name}
                            </div>
                            <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                <Image
                                    src={ChainIdDetails[item?.protocol?.chainIds?.[0]].networkLogo}
                                    alt=""
                                    className="h-4 w-4 rounded-full cursor-pointer"
                                />
                                {startCase(ChainIdDetails[item?.protocol?.chainIds?.[0]].networkName)}
                            </div>
                        </div>
                    </div>
                    <div className="w-[25%] text-center">
                        {item?.protocol?.category}
                    </div>
                    <div className="w-[25%] text-center">
                        {item.subtitle}
                    </div>
                    <div className="w-[25%] text-center">
                        {item.type}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default Portfolio;
