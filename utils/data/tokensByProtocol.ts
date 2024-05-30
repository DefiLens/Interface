import { arbitrum, avalanche, ethereum, optimism } from "../../assets/images";

export const tokensByProtocol = {
    polygon: {
        aaveV2: [
            {
                name: "aUSDC",
                icon: ethereum,
                image: "https://token-icons.s3.amazonaws.com/0xbcca60bb61934080951369a648fb03df4f96263c.png",
            },
            {
                name: "aUSDT",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x3ed3b47dd13ec9a98b44e6204a523e766b225811.png",
            },
            {
                name: "aDAI",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x028171bca77440897b824ca71d1c56cac55b68a3.png",
            },
            {
                name: "aWETH",
                icon: ethereum,
                image: "https://token-icons.s3.amazonaws.com/0x030ba81f1c18d280636f32af80b9aad02cf0854e.png",
            },
            {
                name: "aWMATIC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
            },
            {
                name: "aAAVE",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xffc97d72e13e01096502cb8eb52dee56f74dad7b.png",
            },
            {
                name: "aWBTC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656.png",
            },
        ],
        aaveV3: [
            {
                name: "aUSDCv3",
                icon: ethereum,
                image: "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
            },
            {
                name: "aUSDTv3",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
            },
            {
                name: "aDAIv3",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
            },
            {
                name: "aWETHv3",
                icon: ethereum,
                image: "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            },
            {
                name: "aWMATICv3",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
            },
            {
                name: "aAAVEv3",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
            },
            {
                name: "aWBTCv3",
                icon: ethereum,
                image: "https://token-icons.s3.amazonaws.com/0xfc4b8ed459e00e5400be803a9bb3954234fd50e3.png",
            },
            {
                name: "aBALv3",
                icon: optimism,
                image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
            },
        ],
        compoundV3: [
            {
                name: "cUSDC",
                icon: ethereum,
                image: "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
            },
        ],
        dForce: [
            {
                name: "dForceUSDC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
        ],
    },
    avalanche: {
        aaveV3: [
            {
                name: "aUSDT",
                icon: avalanche,
                image: "",
            },
            {
                name: "aUSDC",
                icon: ethereum,
                image: "",
            },
            {
                name: "aWAVAX",
                icon: avalanche,
                image: "",
            },
            {
                name: "aBTCb",
                icon: ethereum,
                image: "",
            },
            {
                name: "aWETHe",
                icon: avalanche,
                image: "",
            },
            {
                name: "aWBTCe",
                icon: ethereum,
                image: "",
            },
            {
                name: "asAVAX",
                icon: avalanche,
                image: "",
            },
            {
                name: "aLINKe",
                icon: ethereum,
                image: "",
            },
            {
                name: "aDAIe",
                icon: avalanche,
                image: "",
            },
            {
                name: "aAAVEe",
                icon: ethereum,
                image: "",
            },
            {
                name: "aMAI",
                icon: avalanche,
                image: "",
            },
            {
                name: "aFRAX",
                icon: ethereum,
                image: "",
            },
        ],
        benqi: [
            // {
            //     name: "qiAVAX",
            //     icon: avalanche,
            // },
            {
                name: "qisAVAX",
                icon: avalanche,
            },
            {
                name: "qiBTCb",
                icon: avalanche,
            },
            {
                name: "qiBTC",
                icon: avalanche,
            },
            {
                name: "qiETH",
                icon: avalanche,
            },
            {
                name: "qiLINK",
                icon: avalanche,
            },
            {
                name: "qiUSDT",
                icon: avalanche,
            },
            {
                name: "qiUSDC",
                icon: avalanche,
            },
            {
                name: "qiUSDTn",
                icon: avalanche,
            },
            {
                name: "qiUSDCn",
                icon: avalanche,
            },
            {
                name: "qiDAI",
                icon: avalanche,
            },
        ]
    },
    arbitrum: {
        aaveV3: [
            {
                name: "aWETH",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            },
            {
                name: "aUSDC",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
            },
            {
                name: "aUSDCe",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
            },
            {
                name: "awstETH",
                icon: avalanche,
                image: "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
            },
            {
                name: "aWBTC",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",

            },
            {
                name: "aUSDT",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
            },
            {
                name: "aARB",
                icon: avalanche,
                image: "",
            },
            {
                name: "aLINK",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84.png",
            },
            {
                name: "aDAI",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
            },
            {
                name: "arETH",
                icon: avalanche,
                image: "",
            },
            {
                name: "aLUSD",
                icon: avalanche,
                image: "",

            },
            {
                name: "aAAVE",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
            },
            {
                name: "aFRAX",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0x853d955acef822db058eb8505911ed77f175b99e.png",

            },
            {
                name: "aEURS",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xdb25f211ab05b1c97d595516f45794528a807ad8.png",

            },
        ],
        compoundV3: [
            {
                name: "cUSDCev3",
                icon: arbitrum,
                image: "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",

            },
            {
                name: "cUSDCv3",
                icon: arbitrum,
                image: "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",

            },
        ],
        radiant: [
            {
                name: "rWBTC",
                icon: arbitrum,
                image: "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",

            },
            {
                name: "rUSDT",
                icon: arbitrum,
                image: "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",

            },
            {
                name: "rUSDC.e",
                icon: arbitrum,
                image: "https://token-icons.s3.amazonaws.com/faa2e9db-03cd-47d5-847b-3add52239107.png",

            },
            {
                name: "rDAI",
                icon: arbitrum,
                image: "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png",

            },
            {
                name: "rWETH",
                icon: arbitrum,
                image: "",

            },
            {
                name: "rwstETH",
                icon: arbitrum,
                image: "",

            },
            {
                name: "rARB",
                icon: arbitrum,
                image: "",

            },
            {
                name: "rUSDC",
                icon: arbitrum,
                image: "",

            },
        ],

    },
    optimism: {
        aaveV3: [
            {
                name: "aDAI",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
            },
            {
                name: "aOP",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png",
            },
            {
                name: "aWETH",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            },
            {
                name: "awstETH",
                icon: optimism,
                image: "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
            },
            {
                name: "aWBTC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
            },
            {
                name: "aUSDC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
            },
            {
                name: "aUSDT",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
            },
            {
                name: "aLINK",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84.png",
            },
            {
                name: "asUSD",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x625ae63000f46200499120b906716420bd059240.png",
            },
            {
                name: "arETH",
                icon: optimism,
                image: "",
            },
            {
                name: "aAAVE",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
            },
            {
                name: "aLUSD",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png",
            },
        ],
        sonne: [
            {
                name: "soWETH",
                icon: optimism,
                image: "",
            },
            {
                name: "soDAI",
                icon: optimism,
                image: "",
            },
            {
                name: "soUSDC.e",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            {
                name: "soUSDT",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/559c040c-6d7f-48d9-b7b0-843411d653e0.png",
            },
            {
                name: "soOP",
                icon: optimism,
                image: "",
            },
            {
                name: "soSUSD",
                icon: optimism,
                image: "",
            },
            {
                name: "sSONNE",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/3f06218d-a77b-4705-83c9-46b63a776756.png",
            },
            {
                name: "soSNX",
                icon: optimism,
                image: "",
            },
            {
                name: "soWBTC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
            },
            {
                name: "soLUSD",
                icon: optimism,
                image: "",
            },
            {
                name: "sowstETH",
                icon: optimism,
                image: "",
            },
            {
                name: "soMAI",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa3fa99a148fa48d14ed51d610c367c61876997f1.png",
            },
            {
                name: "soUSDC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            }
        ],
        exactly: [
            {
                name: "exaOP",
                icon: optimism,
                image: "",
            },
            {
                name: "exaUSDC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",

            },
            {
                name: "exaWBTC",
                icon: optimism,
                image: "",
            },
            {
                name: "exaWETH",
                icon: optimism,
                image: "",
            },
            {
                name: "exawstETH",
                icon: optimism,
                image: "",
            },
        ],
        granary: [
            {
                name: "grainDAI",
                icon: optimism,
                image: "",
            },
            {
                name: "grainUSDC",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
            },
            {
                name: "grainUSDT",
                icon: optimism,
                image: "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
            },
            {
                name: "grainWBTC",
                icon: optimism,
                image: "",
            },
            {
                name: "grainWETH",
                icon: optimism,
                image: "",
            },
            {
                name: "grainOP",
                icon: optimism,
                image: "",
            },
            {
                name: "grainSUSD",
                icon: optimism,
                image: "",
            },
            {
                name: "grainBAL",
                icon: optimism,
                image: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
            },
            {
                name: "grainSNX",
                icon: optimism,
                image: "",

            },
            {
                name: "grainWSTETH",
                icon: optimism,
                image: "",

            },
        ]
    },
    base: {
        aaveV3: [
            {
                name: "aBasUSDbC",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/6c8eaf54-30fe-41ff-b1b3-17b16875cc95.png",
            },
            {
                name: "aBasWETH",
                icon: ethereum,
                image: "",
            },
        ],
        compoundV3: [
            {
                name: "cUSDbCv3",
                icon: optimism,
                image: "",
            },
        ],
        seamless: [
            {
                name: "sUSDbC",
                icon: avalanche,
                image: "",
            },
            {
                name: "sWETH",
                icon: avalanche,
                image: "",
            },
            {
                name: "scbETH",
                icon: avalanche,
                image: "",
            },
            {
                name: "sUSDC",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/6c8eaf54-30fe-41ff-b1b3-17b16875cc95.png",
            },
            {
                name: "sDAI",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
            }
        ],
        moonwell: [
            {
                name: "mDAI",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
            },
            {
                name: "mUSDC",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/3a31b65e-8ca1-449d-9488-e843f70a6905.png",
            },
            {
                name: "mUSDbC",
                icon: avalanche,
                image: "",
            },
            {
                name: "mWETH",
                icon: avalanche,
                image: "",
            },
            {
                name: "mcbETH",
                icon: avalanche,
                image: "",
            },
            {
                name: "mwstETH",
                icon: avalanche,
                image: "",
            },
            {
                name: "mrETH",
                icon: avalanche,
                image: "",
            }
        ],
        sonne: [
            {
                name: "sobUSDbC",
                icon: avalanche,
                image: "",
            },
            {
                name: "sobUSDC",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/3a31b65e-8ca1-449d-9488-e843f70a6905.png",
            },
            {
                name: "sobDAI",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
            },
            {
                name: "sobWETH",
                icon: avalanche,
                image: "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            },
            {
                name: "sobcbETH",
                icon: avalanche,
                image: "",
            },
        ]
    },
};

export const tokenAddressByProtocol = {
    polygon: {
        aaveV2: {
            aUSDC: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
            aUSDT: "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
            aDAI: "0x27F8D03b3a2196956ED754baDc28D73be8830A6e",
            aWETH: "0x28424507fefb6f7f8E9D3860F56504E4e5f5f390",
            aWMATIC: "0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4",
            aAAVE: "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360",
            aWBTC: "0x5c2ed810328349100A66B82b78a1791B101C9D61",
        },
        aaveV3: {
            aUSDCv3: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            aUSDTv3: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aDAIv3: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            aWETHv3: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            aWMATICv3: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
            aAAVEv3: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aWBTCv3: "0x078f358208685046a11C85e8ad32895DED33A249",
            aBALv3: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
        },
        compoundV3: {
            cUSDC: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
        },
        dForce: {
            dForceUSDC: "0x5268b3c4afb0860D365a093C184985FCFcb65234",
        },
    },
    avalanche: {
        aaveV3: {
            aUSDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aUSDC: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            aWAVAX: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
            aBTCb: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
            aWETHe: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            aWBTCe: "0x078f358208685046a11C85e8ad32895DED33A249",
            asAVAX: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf",
            aLINKe: "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530",
            aDAIe: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            aAAVEe: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aMAI: "0x8Eb270e296023E9D92081fdF967dDd7878724424",
            aFRAX: "0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA",
        },
        benqi: {
            qiAVAX: "0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c",
            qisAVAX: "0xF362feA9659cf036792c9cb02f8ff8198E21B4cB",
            qiBTCb: "0x89a415b3D20098E6A6C8f7a59001C67BD3129821",
            qiBTC: "0xe194c4c5aC32a3C9ffDb358d9Bfd523a0B6d1568",
            qiETH: "0x334AD834Cd4481BB02d09615E7c11a00579A7909",
            qiLINK: "0x4e9f683A27a6BdAD3FC2764003759277e93696e6",
            qiUSDT: "0xc9e5999b8e75C3fEB117F6f73E664b9f3C8ca65C",
            qiUSDC: "0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F",
            qiUSDTn: "0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF",
            qiUSDCn: "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C",
            qiDAI: "0x835866d37AFB8CB8F8334dCCdaf66cf01832Ff5D",
        },
    },
    arbitrum: {
        aaveV3: {
            aWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            aUSDC: "0x724dc807b04555b71ed48a6896b6F41593b8C637",
            aUSDCe: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            awstETH: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf",
            aWBTC: "0x078f358208685046a11C85e8ad32895DED33A249",
            aUSDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aARB: "0x6533afac2E7BCCB20dca161449A13A32D391fb00",
            aLINK: "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530",
            aDAI: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            arETH: "0x8Eb270e296023E9D92081fdF967dDd7878724424",
            aLUSD: "0x8ffDf2DE812095b1D19CB146E4c004587C0A0692",
            aAAVE: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aFRAX: "0x38d693cE1dF5AaDF7bC62595A37D667aD57922e5",
            aEURS: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
        },
        compoundV3: {
            cUSDCev3: "0xA5EDBDD9646f8dFF606d7448e414884C7d905dCA",
            cUSDCv3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
        },
        radiant: {
            rWBTC: "0x727354712BDFcd8596a3852Fd2065b3C34F4F770",
            rUSDT: "0xd69D402D1bDB9A2b8c3d88D98b9CEaf9e4Cd72d9",
            "rUSDC.e": "0x48a29E756CC1C097388f3B2f3b570ED270423b3d",
            rDAI: "0x0D914606f3424804FA1BbBE56CCC3416733acEC6",
            rWETH: "0x0dF5dfd95966753f01cb80E76dc20EA958238C46",
            rwstETH: "0x42C248D137512907048021B30d9dA17f48B5b7B2",
            rARB: "0x2dADe5b7df9DA3a7e1c9748d169Cd6dFf77e3d01",
            rUSDC: "0x3a2d44e354f2d88EF6DA7A5A4646fd70182A7F55",
        },
    },
    optimism: {
        aaveV3: {
            aDAI: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
            aOP: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf",
            aWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
            awstETH: "0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA",
            aWBTC: "0x078f358208685046a11C85e8ad32895DED33A249",
            aUSDC: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
            aUSDT: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
            aLINK: "0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530",
            asUSD: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
            arETH: "0x724dc807b04555b71ed48a6896b6F41593b8C637",
            aAAVE: "0xf329e36C7bF6E5E86ce2150875a84Ce77f477375",
            aLUSD: "0x8Eb270e296023E9D92081fdF967dDd7878724424",
        },
        sonne: {
            soWETH: "0xf7B5965f5C117Eb1B5450187c9DcFccc3C317e8E",
            soDAI: "0x5569b83de187375d43FBd747598bfe64fC8f6436",
            "soUSDC.e": "0xEC8FEa79026FfEd168cCf5C627c7f486D77b765F",
            soUSDT: "0x5Ff29E4470799b982408130EFAaBdeeAE7f66a10",
            soOP: "0x8cD6b19A07d754bF36AdEEE79EDF4F2134a8F571",
            soSUSD: "0xd14451E0Fa44B18f08aeB1E4a4d092B823CaCa68",
            sSONNE: "0xdc05d85069dc4aba65954008ff99f2d73ff12618",
            soSNX: "0xD7dAabd899D1fAbbC3A9ac162568939CEc0393Cc",
            soWBTC: "0x33865E09A572d4F1CC4d75Afc9ABcc5D3d4d867D",
            soLUSD: "0xAFdf91f120DEC93c65fd63DBD5ec372e5dcA5f82",
            sowstETH: "0x26AaB17f27CD1c8d06a0Ad8E4a1Af8B1032171d5",
            soMAI: "0xE7De932d50EfC9ea0a7a409Fc015B4f71443528e",
            soUSDC: "0x1AfD1fF9E441973B7D34c7B8AbE91d94F1B23ce0"
        },
        exactly: {
            "exaOP": "0xa430A427bd00210506589906a71B54d6C256CEdb",
            "exaUSDC": "0x81C9A7B55A4df39A9B7B5F781ec0e53539694873",
            "exaWBTC": "0x6f748FD65d7c71949BA6641B3248C4C191F3b322",
            "exaWETH": "0xc4d4500326981eacD020e20A81b1c479c161c7EF",
            "exawstETH": "0x22ab31Cd55130435b5efBf9224b6a9d5EC36533F",
        },
        granary: {
            "grainDAI": "0x18D2b18Af9A1f379025f46b8aeB4aF75f6642c9F",
            "grainUSDC": "0x7A0FDDBA78FF45D353B1630B77f4D175A00df0c0",
            "grainUSDT": "0x4e7849f846f8cdDAF37c72065b65Ec22cecEE109",
            "grainWBTC": "0xbd3dbf914f3e9c3133a815b04a4d0E5930957cB9",
            "grainWETH": "0xfF94cc8E2c4B17e3CC65d7B83c7e8c643030D936",
            "grainOP": "0x30091e843deb234ebb45c7e1da4bbc4c33b3f0b4",
            "grainSUSD": "0x8AaA9d29305D331aE67AD65495B9e22cf98f9035",
            "grainBAL": "0x7fB37AE8BE7F6177F265E3Ff6d6731672779eb0B",
            "grainSNX": "0xa73b7C26eF3221BF9eA7E5981840519427f7dCaF",
            "grainWSTETH": "0x1a7450AACc67d90afB9e2C056229973354cc8987",
        }
    },
    ethereum: {},
    base: {
        aaveV3: {
            aBasUSDbC: "0x0a1d576f3eFeF75b330424287a95A366e8281D54",
            aBasWETH: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
        },
        compoundV3: {
            cUSDbCv3: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
        },
        seamless: {
            sUSDbC: "0x13A13869B814Be8F13B86e9875aB51bda882E391",
            sWETH: "0x48bf8fCd44e2977c8a9A744658431A8e6C0d866c",
            scbETH: "0x2c159A183d9056E29649Ce7E56E59cA833D32624",
            sUSDC: "0x53E240C0F985175dA046A62F26D490d1E259036e",
            sDAI: "0x37eF72fAC21904EDd7e69f7c7AC98172849efF8e"
        },
        moonwell: {
            mDAI: "0x73b06D8d18De422E269645eaCe15400DE7462417",
            mUSDC: "0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22",
            mUSDbC: "0x703843C3379b52F9FF486c9f5892218d2a065cC8",
            mWETH: "0x628ff693426583D9a7FB391E54366292F509D457",
            mcbETH: "0x3bf93770f2d4a794c3d9EBEfBAeBAE2a8f09A5E5",
            mwstETH: "0x627Fe393Bc6EdDA28e99AE648fD6fF362514304b",
            mrETH: "0xCB1DaCd30638ae38F2B94eA64F066045B7D45f44"
        },
        sonne: {
            sobUSDbC: "0x225886C9beb5eeE254F79d58bbD80cf9F200D4d0",
            sobUSDC: "0xfd68F92B45b633bbe0f475294C1A86aecD62985A",
            sobDAI: "0xb864BA2aab1f53BC3af7AE49a318202dD3fd54C2",
            sobWETH: "0x5F5c479fe590cD4442A05aE4a941dd991A633B8E",
            sobcbETH: "0x6C91bEECEEDda2089307fAb818E12757948BF489",
        }
    },
};
