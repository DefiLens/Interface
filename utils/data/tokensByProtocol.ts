import { arbitrum, avalanche, ethereum, optimism } from "../../assets/images";

export const tokensByProtocol = {
    polygon: {
        aaveV2: [
            {
                name: "aUSDC",
                icon: ethereum,
            },
            {
                name: "aUSDT",
                icon: optimism,
            },
            {
                name: "aDAI",
                icon: avalanche,
            },
            {
                name: "aWETH",
                icon: ethereum,
            },
            {
                name: "aWMATIC",
                icon: optimism,
            },
            {
                name: "aAAVE",
                icon: avalanche,
            },
            {
                name: "aWBTC",
                icon: optimism,
            },
        ],
        aaveV3: [
            {
                name: "aUSDCv3",
                icon: ethereum,
            },
            {
                name: "aUSDTv3",
                icon: optimism,
            },
            {
                name: "aDAIv3",
                icon: avalanche,
            },
            {
                name: "aWETHv3",
                icon: ethereum,
            },
            {
                name: "aWMATICv3",
                icon: optimism,
            },
            {
                name: "aAAVEv3",
                icon: avalanche,
            },
            {
                name: "aWBTCv3",
                icon: ethereum,
            },
            {
                name: "aBALv3",
                icon: optimism,
            },
        ],
        compoundV3: [
            {
                name: "cUSDC",
                icon: ethereum,
            },
        ],
        dForce: [
            {
                name: "dForceUSDC",
                icon: optimism,
            },
        ],
    },
    avalanche: {
        aaveV3: [
            {
                name: "aUSDT",
                icon: avalanche,
            },
            {
                name: "aUSDC",
                icon: ethereum,
            },
            {
                name: "aWAVAX",
                icon: avalanche,
            },
            {
                name: "aBTCb",
                icon: ethereum,
            },
            {
                name: "aWETHe",
                icon: avalanche,
            },
            {
                name: "aWBTCe",
                icon: ethereum,
            },
            {
                name: "asAVAX",
                icon: avalanche,
            },
            {
                name: "aLINKe",
                icon: ethereum,
            },
            {
                name: "aDAIe",
                icon: avalanche,
            },
            {
                name: "aAAVEe",
                icon: ethereum,
            },
            {
                name: "aMAI",
                icon: avalanche,
            },
            {
                name: "aFRAX",
                icon: ethereum,
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
            },
            {
                name: "aUSDC",
                icon: avalanche,
            },
            {
                name: "aUSDCe",
                icon: avalanche,
            },
            {
                name: "awstETH",
                icon: avalanche,
            },
            {
                name: "aWBTC",
                icon: avalanche,
            },
            {
                name: "aUSDT",
                icon: avalanche,
            },
            {
                name: "aARB",
                icon: avalanche,
            },
            {
                name: "aLINK",
                icon: avalanche,
            },
            {
                name: "aDAI",
                icon: avalanche,
            },
            {
                name: "arETH",
                icon: avalanche,
            },
            {
                name: "aLUSD",
                icon: avalanche,
            },
            {
                name: "aAAVE",
                icon: avalanche,
            },
            {
                name: "aFRAX",
                icon: avalanche,
            },
            {
                name: "aEURS",
                icon: avalanche,
            },
        ],
        compoundV3: [
            {
                name: "cUSDCev3",
                icon: arbitrum,
            },
            {
                name: "cUSDCv3",
                icon: arbitrum,
            },
        ],
    },
    optimism: {
        aaveV3: [
            {
                name: "aDAI",
                icon: optimism,
            },
            {
                name: "aOP",
                icon: optimism,
            },
            {
                name: "aWETH",
                icon: optimism,
            },
            {
                name: "awstETH",
                icon: optimism,
            },
            {
                name: "aWBTC",
                icon: optimism,
            },
            {
                name: "aUSDC",
                icon: optimism,
            },
            {
                name: "aUSDT",
                icon: optimism,
            },
            {
                name: "aLINK",
                icon: optimism,
            },
            {
                name: "asUSD",
                icon: optimism,
            },
            {
                name: "arETH",
                icon: optimism,
            },
            {
                name: "aAAVE",
                icon: optimism,
            },
            {
                name: "aLUSD",
                icon: optimism,
            },
        ],
        sonne: [
            {
                name: "soWETH",
                icon: optimism
            },
            {
                name: "soDAI",
                icon: optimism
            },
            {
                name: "soUSDC.e",
                icon: optimism
            },
            {
                name: "soUSDT",
                icon: optimism
            },
            {
                name: "soOP",
                icon: optimism
            },
            {
                name: "soSUSD",
                icon: optimism
            },
            {
                name: "sSONNE",
                icon: optimism
            },
            {
                name: "soSNX",
                icon: optimism
            },
            {
                name: "soWBTC",
                icon: optimism
            },
            {
                name: "soLUSD",
                icon: optimism
            },
            {
                name: "sowstETH",
                icon: optimism
            },
            {
                name: "soMAI",
                icon: optimism
            },
            {
                name: "soUSDC",
                icon: optimism
            }
        ]
    },
    base: {
        aaveV3: [
            {
                name: "aBasUSDbC",
                icon: avalanche,
            },
            {
                name: "aBasWETH",
                icon: ethereum,
            },
        ],
        compoundV3: [
            {
                name: "cUSDbCv3",
                icon: optimism,
            },
        ],
        seamless: [
            {
                name: "sUSDbC",
                icon: avalanche,
            },
            {
                name: "sWETH",
                icon: avalanche,
            },
            {
                name: "scbETH",
                icon: avalanche,
            },
            {
                name: "sUSDC",
                icon: avalanche,
            },
            {
                name: "sDAI",
                icon: avalanche,
            }
        ],
        moonwell: [
            {
                name: "mDAI",
                icon: avalanche,
            },
            {
                name: "mUSDC",
                icon: avalanche,
            },
            {
                name: "mUSDbC",
                icon: avalanche,
            },
            {
                name: "mWETH",
                icon: avalanche,
            },
            {
                name: "mcbETH",
                icon: avalanche,
            },
            {
                name: "mwstETH",
                icon: avalanche,
            },
            {
                name: "mrETH",
                icon: avalanche,
            }
        ],
        sonne: [
            {
                name: "sobUSDbC",
                icon: avalanche,
            },
            {
                name: "sobUSDC",
                icon: avalanche,
            },
            {
                name: "sobDAI",
                icon: avalanche,
            },
            {
                name: "sobWETH",
                icon: avalanche,
            },
            {
                name: "sobcbETH",
                icon: avalanche,
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
