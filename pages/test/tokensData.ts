import { arbitrum, avalanche, base, ethereum, optimism, polygon } from "../../assets/images";
import { tokenAddressByProtocol, tokensByProtocol } from "../../utils/data/tokensByProtocol";

export const NETWORK_LIST = [
    {
        key: "Polygon",
        chainName: "polygon",
        chainId: "137",
        icon: polygon,
    },
    {
        key: "Arbitrum",
        chainName: "arbitrum",
        chainId: "42161",
        icon: arbitrum,
    },
    {
        key: "Optimism",
        chainName: "optimism",
        chainId: "10",
        icon: optimism,
    },
    {
        key: "Base",
        chainName: "base",
        chainId: "8453",
        icon: base,
    },
];

export const erc20ByNetwork = {
    "polygon": [
        {
            "chainId": 137,
            "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "name": "MATIC",
            "symbol": "MATIC",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png"
        },
        {
            "chainId": 137,
            "address": "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
            "name": "1inch",
            "symbol": "1INCH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x111111111117dc0aa78b770fa6a738034120c302.png"
        },
        {
            "chainId": 137,
            "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
            "name": "Aave",
            "symbol": "AAVE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110"
        },
        {
            "chainId": 137,
            "address": "0xdDa7b23D2D72746663E7939743f929a3d85FC975",
            "name": "Ambire AdEx",
            "symbol": "ADX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/847/thumb/Ambire_AdEx_Symbol_color.png?1655432540"
        },
        {
            "chainId": 137,
            "address": "0x6a6bD53d677F8632631662C48bD47b1D4D6524ee",
            "name": "Adventure Gold",
            "symbol": "AGLD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/18125/thumb/lpgblc4h_400x400.jpg?1630570955"
        },
        {
            "chainId": 137,
            "address": "0xe2341718c6C0CbFa8e6686102DD8FbF4047a9e9B",
            "name": "AIOZ Network",
            "symbol": "AIOZ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14631/thumb/aioz_logo.png?1617413126"
        },
        {
            "chainId": 137,
            "address": "0x95c300e7740D2A88a44124B424bFC1cB2F9c3b89",
            "name": "Alchemix",
            "symbol": "ALCX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14113/thumb/Alchemix.png?1614409874"
        },
        {
            "chainId": 137,
            "address": "0x82dCf1Df86AdA26b2dCd9ba6334CeDb8c2448e9e",
            "name": "Aleph im",
            "symbol": "ALEPH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11676/thumb/Monochram-aleph.png?1608483725"
        },
        {
            "chainId": 137,
            "address": "0xbFc70507384047Aa74c29Cdc8c5Cb88D0f7213AC",
            "name": "Alethea Artificial Liquid Intelligence",
            "symbol": "ALI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/22062/thumb/alethea-logo-transparent-colored.png?1642748848"
        },
        {
            "chainId": 137,
            "address": "0x50858d870FAF55da2fD90FB6DF7c34b5648305C6",
            "name": "My Neighbor Alice",
            "symbol": "ALICE",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/14375/thumb/alice_logo.jpg?1615782968"
        },
        {
            "chainId": 137,
            "address": "0x3AE490db48d74B1bC626400135d4616377D0109f",
            "name": "Alpha Venture DAO",
            "symbol": "ALPHA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12738/thumb/AlphaToken_256x256.png?1617160876"
        },
        {
            "chainId": 137,
            "address": "0x0621d647cecbFb64b79E44302c1933cB4f27054d",
            "name": "Amp",
            "symbol": "AMP",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12409/thumb/amp-200x200.png?1599625397"
        },
        {
            "chainId": 137,
            "address": "0x101A023270368c0D50BFfb62780F4aFd4ea79C35",
            "name": "Ankr",
            "symbol": "ANKR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4324/thumb/U85xTl2.png?1608111978"
        },
        {
            "chainId": 137,
            "address": "0x2b8504ab5eFc246d0eC5Ec7E74565683227497de",
            "name": "Aragon",
            "symbol": "ANT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/681/thumb/JelZ58cv_400x400.png?1601449653"
        },
        {
            "chainId": 137,
            "address": "0xB7b31a6BC18e48888545CE79e83E06003bE70930",
            "name": "ApeCoin",
            "symbol": "APE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg?1647476455"
        },
        {
            "chainId": 137,
            "address": "0x45C27821E80F8789b60Fd8B600C73815d34DDa6C",
            "name": "API3",
            "symbol": "API3",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13256/thumb/api3.jpg?1606751424"
        },
        {
            "chainId": 137,
            "address": "0xEE800B277A96B0f490a1A732e1D6395FAD960A26",
            "name": "ARPA Chain",
            "symbol": "ARPA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/8506/thumb/9u0a23XY_400x400.jpg?1559027357"
        },
        {
            "chainId": 137,
            "address": "0x04bEa9FCE76943E90520489cCAb84E84C0198E29",
            "name": "AirSwap",
            "symbol": "AST",
            "decimals": 4,
            "image": "https://assets.coingecko.com/coins/images/1019/thumb/Airswap.png?1630903484"
        },
        {
            "chainId": 137,
            "address": "0x0df0f72EE0e5c9B7ca761ECec42754992B2Da5BF",
            "name": "Automata",
            "symbol": "ATA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15985/thumb/ATA.jpg?1622535745"
        },
        {
            "chainId": 137,
            "address": "0x5eB8D998371971D01954205c7AFE90A7AF6a95AC",
            "name": "Audius",
            "symbol": "AUDIO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12913/thumb/AudiusCoinLogo_2x.png?1603425727"
        },
        {
            "chainId": 137,
            "address": "0x61BDD9C7d4dF4Bf47A4508c0c8245505F2Af5b7b",
            "name": "Axie Infinity",
            "symbol": "AXS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13029/thumb/axie_infinity_logo.png?1604471082"
        },
        {
            "chainId": 137,
            "address": "0x1FcbE5937B0cc2adf69772D228fA4205aCF4D9b2",
            "name": "Badger DAO",
            "symbol": "BADGER",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13287/thumb/badger_dao_logo.jpg?1607054976"
        },
        {
            "chainId": 137,
            "address": "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
            "name": "Balancer",
            "symbol": "BAL",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xA8b1E0764f85f53dfe21760e8AfE5446D82606ac",
            "name": "Band Protocol",
            "symbol": "BAND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9545/thumb/band-protocol.png?1568730326"
        },
        {
            "chainId": 137,
            "address": "0x3Cef98bb43d732E2F285eE605a8158cDE967D219",
            "name": "Basic Attention Token",
            "symbol": "BAT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427"
        },
        {
            "chainId": 137,
            "address": "0x91c89A94567980f0e9723b487b0beD586eE96aa7",
            "name": "Biconomy",
            "symbol": "BICO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/21061/thumb/biconomy_logo.jpg?1638269749"
        },
        {
            "chainId": 137,
            "address": "0x438B28C5AA5F00a817b7Def7cE2Fb3d5d1970974",
            "name": "Bluzelle",
            "symbol": "BLZ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2848/thumb/ColorIcon_3x.png?1622516510"
        },
        {
            "chainId": 137,
            "address": "0xc26D47d5c33aC71AC5CF9F776D63Ba292a4F7842",
            "name": "Bancor Network Token",
            "symbol": "BNT",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xa4B2B20b2C73c7046ED19AC6bfF5E5285c58F20a",
            "name": "Boba Network",
            "symbol": "BOBA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/20285/thumb/BOBA.png?1636811576"
        },
        {
            "chainId": 137,
            "address": "0xA041544fe2BE56CCe31Ebb69102B965E06aacE80",
            "name": "BarnBridge",
            "symbol": "BOND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853"
        },
        {
            "chainId": 137,
            "address": "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7",
            "name": "Binance USD",
            "symbol": "BUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766"
        },
        {
            "chainId": 137,
            "address": "0x91a4635F620766145C099E15889Bd2766906A559",
            "name": "Celer Network",
            "symbol": "CELR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4379/thumb/Celr.png?1554705437"
        },
        {
            "chainId": 137,
            "address": "0x594C984E3318e91313f881B021A0C4203fF5E59F",
            "name": "Chromia",
            "symbol": "CHR",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/5000/thumb/Chromia.png?1559038018"
        },
        {
            "chainId": 137,
            "address": "0xf1938Ce12400f9a761084E7A80d37e732a4dA056",
            "name": "Chiliz",
            "symbol": "CHZ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/8834/thumb/Chiliz.png?1561970540"
        },
        {
            "chainId": 137,
            "address": "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c",
            "name": "Compound",
            "symbol": "COMP",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x93B0fF1C8828F6eB039D345Ff681eD735086d925",
            "name": "Covalent",
            "symbol": "CQT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14168/thumb/covalent-cqt.png?1624545218"
        },
        {
            "chainId": 137,
            "address": "0xAdA58DF0F643D959C2A47c9D4d4c1a4deFe3F11C",
            "name": "Cronos",
            "symbol": "CRO",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/7310/thumb/oCw2s3GI_400x400.jpeg?1645172042"
        },
        {
            "chainId": 137,
            "address": "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
            "name": "Curve DAO Token",
            "symbol": "CRV",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x2727Ab1c2D22170ABc9b595177B2D5C6E1Ab7B7B",
            "name": "Cartesi",
            "symbol": "CTSI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11038/thumb/cartesi.png?1592288021"
        },
        {
            "chainId": 137,
            "address": "0x8c208BC2A808a088a78398fed8f2640cab0b6EDb",
            "name": "Cryptex Finance",
            "symbol": "CTX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14932/thumb/glossy_icon_-_C200px.png?1619073171"
        },
        {
            "chainId": 137,
            "address": "0x276C9cbaa4BDf57d7109a41e67BD09699536FA3d",
            "name": "Somnium Space CUBEs",
            "symbol": "CUBE",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/10687/thumb/CUBE_icon.png?1617026861"
        },
        {
            "chainId": 137,
            "address": "0x66Dc5A08091d1968e08C16aA5b27BAC8398b02Be",
            "name": "Civic",
            "symbol": "CVC",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/788/thumb/civic.png?1547034556"
        },
        {
            "chainId": 137,
            "address": "0x4257EA7637c355F81616050CbB6a9b709fd72683",
            "name": "Convex Finance",
            "symbol": "CVX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15585/thumb/convex.png?1621256328"
        },
        {
            "chainId": 137,
            "address": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x26f5FB1e6C8a65b3A873fF0a213FA16EFF5a7828",
            "name": "DerivaDAO",
            "symbol": "DDX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13453/thumb/ddx_logo.png?1608741641"
        },
        {
            "chainId": 137,
            "address": "0xff835562C761205659939B64583dd381a6AA4D92",
            "name": "DexTools",
            "symbol": "DEXT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11603/thumb/dext.png?1605790188"
        },
        {
            "chainId": 137,
            "address": "0x993f2CafE9dbE525243f4A78BeBC69DAc8D36000",
            "name": "DIA",
            "symbol": "DIA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11955/thumb/image.png?1646041751"
        },
        {
            "chainId": 137,
            "address": "0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369",
            "name": "DeFi Pulse Index",
            "symbol": "DPI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12465/thumb/defi_pulse_index_set.png?1600051053"
        },
        {
            "chainId": 137,
            "address": "0x4C3bF0a3DE9524aF68327d1D2558a3B70d17D42a",
            "name": "dYdX",
            "symbol": "DYDX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17500/thumb/hjnIm9bV.jpg?1628009360"
        },
        {
            "chainId": 137,
            "address": "0xE0339c80fFDE91F3e20494Df88d4206D86024cdF",
            "name": "Dogelon Mars",
            "symbol": "ELON",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"
        },
        {
            "chainId": 137,
            "address": "0x7eC26842F195c852Fa843bB9f6D8B583a274a157",
            "name": "Enjin Coin",
            "symbol": "ENJ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078"
        },
        {
            "chainId": 137,
            "address": "0xbD7A5Cf51d22930B8B3Df6d834F9BCEf90EE7c4f",
            "name": "Ethereum Name Service",
            "symbol": "ENS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg?1635850140"
        },
        {
            "chainId": 137,
            "address": "0x0E50BEA95Fe001A370A4F1C220C49AEdCB982DeC",
            "name": "Ethernity Chain",
            "symbol": "ERN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14238/thumb/LOGO_HIGH_QUALITY.png?1647831402"
        },
        {
            "chainId": 137,
            "address": "0x8a037dbcA8134FFc72C362e394e35E0Cad618F85",
            "name": "Euro Coin",
            "symbol": "EUROC",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/26045/thumb/euro-coin.png?1655394420"
        },
        {
            "chainId": 137,
            "address": "0x176f5AB638cf4Ff3B6239Ba609C3fadAA46ef5B0",
            "name": "Harvest Finance",
            "symbol": "FARM",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xa0246c9032bc3a600820415ae600c6388619a14d.png"
        },
        {
            "chainId": 137,
            "address": "0x7583FEDDbceFA813dc18259940F76a02710A8905",
            "name": "Fetch ai",
            "symbol": "FET",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/5681/thumb/Fetch.jpg?1572098136"
        },
        {
            "chainId": 137,
            "address": "0x7A7B94F18EF6AD056CDa648588181CDA84800f94",
            "name": "Stafi",
            "symbol": "FIS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12423/thumb/stafi_logo.jpg?1599730991"
        },
        {
            "chainId": 137,
            "address": "0x9ff62d1FC52A907B6DCbA8077c2DDCA6E6a9d3e1",
            "name": "Forta",
            "symbol": "FORT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/25060/thumb/Forta_lgo_%281%29.png?1655353696"
        },
        {
            "chainId": 137,
            "address": "0x5eCbA59DAcc1ADc5bDEA35f38A732823fc3dE977",
            "name": "Ampleforth Governance Token",
            "symbol": "FORTH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14917/thumb/photo_2021-04-22_00.00.03.jpeg?1619020835"
        },
        {
            "chainId": 137,
            "address": "0x65A05DB8322701724c197AF82C9CaE41195B0aA8",
            "name": "ShapeShift FOX Token",
            "symbol": "FOX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9988/thumb/FOX.png?1574330622"
        },
        {
            "chainId": 137,
            "address": "0x104592a158490a9228070E0A8e5343B499e125D0",
            "name": "Frax",
            "symbol": "FRAX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13422/thumb/frax_logo.png?1608476506"
        },
        {
            "chainId": 137,
            "address": "0xC9c1c1c20B3658F8787CC2FD702267791f224Ce1",
            "name": "Fantom",
            "symbol": "FTM",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016"
        },
        {
            "chainId": 137,
            "address": "0x3e121107F6F22DA4911079845a470757aF4e1A1b",
            "name": "Frax Share",
            "symbol": "FXS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13423/thumb/frax_share.png?1608478989"
        },
        {
            "chainId": 137,
            "address": "0x09E1943Dd2A4e82032773594f50CF54453000b97",
            "name": "Gala",
            "symbol": "GALA",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/12493/thumb/GALA-COINGECKO.png?1600233435"
        },
        {
            "chainId": 137,
            "address": "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
            "name": "Aavegotchi",
            "symbol": "GHST",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12467/thumb/ghst_200.png?1600750321"
        },
        {
            "chainId": 137,
            "address": "0x0B220b82F3eA3B7F6d9A1D8ab58930C064A2b5Bf",
            "name": "Golem",
            "symbol": "GLM",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/542/thumb/Golem_Submark_Positive_RGB.png?1606392013"
        },
        {
            "chainId": 137,
            "address": "0x5FFD62D3C3eE2E81C00A7b9079FB248e7dF024A8",
            "name": "Gnosis Token",
            "symbol": "GNO",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xF88fc6b493eda7650E4bcf7A290E8d108F677CfE",
            "name": "Gods Unchained",
            "symbol": "GODS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17139/thumb/10631.png?1635718182"
        },
        {
            "chainId": 137,
            "address": "0x5fe2B58c013d7601147DcdD68C143A77499f5531",
            "name": "The Graph",
            "symbol": "GRT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566"
        },
        {
            "chainId": 137,
            "address": "0xdb95f9188479575F3F718a245EcA1B3BF74567EC",
            "name": "Gitcoin",
            "symbol": "GTC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15810/thumb/gitcoin.png?1621992929"
        },
        {
            "chainId": 137,
            "address": "0xC8A94a3d3D2dabC3C1CaffFFDcA6A7543c3e3e65",
            "name": "Gemini Dollar",
            "symbol": "GUSD",
            "decimals": 2,
            "image": "https://assets.coingecko.com/coins/images/5992/thumb/gemini-dollar-gusd.png?1536745278"
        },
        {
            "chainId": 137,
            "address": "0x482bc619eE7662759CDc0685B4E78f464Da39C73",
            "name": "GYEN",
            "symbol": "GYEN",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/14191/thumb/icon_gyen_200_200.png?1614843343"
        },
        {
            "chainId": 137,
            "address": "0x6cCBF3627b2C83AFEF05bf2F035E7f7B210Fe30D",
            "name": "HOPR",
            "symbol": "HOPR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14061/thumb/Shared_HOPR_logo_512px.png?1614073468"
        },
        {
            "chainId": 137,
            "address": "0x9Cb74C8032b007466865f060ad2c46145d45553D",
            "name": "IDEX",
            "symbol": "IDEX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2565/thumb/logomark-purple-286x286.png?1638362736"
        },
        {
            "chainId": 137,
            "address": "0xFA46dAf9909e116DBc40Fe1cC95fC0Bb1f452aBE",
            "name": "Illuvium",
            "symbol": "ILV",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14468/large/ILV.JPG"
        },
        {
            "chainId": 137,
            "address": "0x183070C90B34A63292cC908Ce1b263Cb56D49A7F",
            "name": "Immutable X",
            "symbol": "IMX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17233/thumb/imx.png?1636691817"
        },
        {
            "chainId": 137,
            "address": "0xfBd8A3b908e764dBcD51e27992464B4432A1132b",
            "name": "Index Cooperative",
            "symbol": "INDEX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12729/thumb/index.png?1634894321"
        },
        {
            "chainId": 137,
            "address": "0x4E8dc2149EaC3f3dEf36b1c281EA466338249371",
            "name": "Injective",
            "symbol": "INJ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12882/thumb/Secondary_Symbol.png?1628233237"
        },
        {
            "chainId": 137,
            "address": "0xF18Ac368001b0DdC80aA6a8374deb49e868EFDb8",
            "name": "Inverse Finance",
            "symbol": "INV",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14205/thumb/inverse_finance.jpg?1614921871"
        },
        {
            "chainId": 137,
            "address": "0xf6372cDb9c1d3674E83842e3800F2A62aC9F3C66",
            "name": "IoTeX",
            "symbol": "IOTX",
            "decimals": 18,
            "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/2777.png"
        },
        {
            "chainId": 137,
            "address": "0xb87f5c1E81077FfcfE821dA240fd20C99c533aF1",
            "name": "JasmyCoin",
            "symbol": "JASMY",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13876/thumb/JASMY200x200.jpg?1612473259"
        },
        {
            "chainId": 137,
            "address": "0x42f37A1296b2981F7C3cAcEd84c5096b2Eb0C72C",
            "name": "Keep Network",
            "symbol": "KEEP",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3373/thumb/IuNzUb5b_400x400.jpg?1589526336"
        },
        {
            "chainId": 137,
            "address": "0x324b28d6565f784d596422B0F2E5aB6e9CFA1Dc7",
            "name": "Kyber Network Crystal",
            "symbol": "KNC",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdd974D5C2e2928deA5F71b9825b8b646686BD200/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x53AEc293212E3B792563Bc16f1be26956adb12e9",
            "name": "Keep3rV1",
            "symbol": "KP3R",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12966/thumb/kp3r_logo.jpg?1607057458"
        },
        {
            "chainId": 137,
            "address": "0xE8A51D0dD1b4525189ddA2187F90ddF0932b5482",
            "name": "LCX",
            "symbol": "LCX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9985/thumb/zRPSu_0o_400x400.jpg?1574327008"
        },
        {
            "chainId": 137,
            "address": "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756",
            "name": "Lido DAO",
            "symbol": "LDO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png?1609873644"
        },
        {
            "chainId": 137,
            "address": "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
            "name": "ChainLink Token",
            "symbol": "LINK",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x465b67CB20A7E8bC4c51b4C7DA591C1945b41427",
            "name": "League of Kingdoms",
            "symbol": "LOKA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/22572/thumb/loka_64pix.png?1642643271"
        },
        {
            "chainId": 137,
            "address": "0x66EfB7cC647e0efab02eBA4316a2d2941193F6b3",
            "name": "Loom Network",
            "symbol": "LOOM",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x3962F4A0A0051DccE0be73A7e09cEf5756736712",
            "name": "Livepeer",
            "symbol": "LPT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/7137/thumb/logo-circle-green.png?1619593365"
        },
        {
            "chainId": 137,
            "address": "0x8Ab2Fec94d17ae69FB90E7c773f2C85Ed1802c01",
            "name": "Liquity",
            "symbol": "LQTY",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14665/thumb/200-lqty-icon.png?1617631180"
        },
        {
            "chainId": 137,
            "address": "0x84e1670F61347CDaeD56dcc736FB990fBB47ddC1",
            "name": "LoopringCoin V2",
            "symbol": "LRC",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x23001f892c0C82b79303EDC9B9033cD190BB21c7",
            "name": "Liquity USD",
            "symbol": "LUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327"
        },
        {
            "chainId": 137,
            "address": "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4",
            "name": "Decentraland",
            "symbol": "MANA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745"
        },
        {
            "chainId": 137,
            "address": "0x2B9E7ccDF0F4e5B24757c1E1a80e311E34Cb10c7",
            "name": "Mask Network",
            "symbol": "MASK",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14051/thumb/Mask_Network.jpg?1614050316"
        },
        {
            "chainId": 137,
            "address": "0x347ACCAFdA7F8c5BdeC57fa34a5b663CBd1aeca7",
            "name": "MATH",
            "symbol": "MATH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11335/thumb/2020-05-19-token-200.png?1589940590"
        },
        {
            "chainId": 137,
            "address": "0x0000000000000000000000000000000000001010",
            "name": "Polygon",
            "symbol": "MATIC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912"
        },
        {
            "chainId": 137,
            "address": "0xAa7DbD1598251f856C12f63557A4C4397c253Cea",
            "name": "Moss Carbon Credit",
            "symbol": "MCO2",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14414/thumb/ENtxnThA_400x400.jpg?1615948522"
        },
        {
            "chainId": 137,
            "address": "0x1B9D40715E757Bdb9bdEC3215B898E46d8a3b71a",
            "name": "Metis",
            "symbol": "METIS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15595/thumb/metis.jpeg?1660285312"
        },
        {
            "chainId": 137,
            "address": "0x01288e04435bFcd4718FF203D6eD18146C17Cd4b",
            "name": "Magic Internet Money",
            "symbol": "MIM",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/16786/thumb/mimlogopng.png?1624979612"
        },
        {
            "chainId": 137,
            "address": "0x1C5cccA2CB59145A4B25F452660cbA6436DDce9b",
            "name": "Mirror Protocol",
            "symbol": "MIR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13295/thumb/mirror_logo_transparent.png?1611554658"
        },
        {
            "chainId": 137,
            "address": "0x6f7C932e7684666C9fd1d44527765433e01fF61d",
            "name": "Maker",
            "symbol": "MKR",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xa9f37D84c856fDa3812ad0519Dad44FA0a3Fe207",
            "name": "Melon",
            "symbol": "MLN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/605/thumb/melon.png?1547034295"
        },
        {
            "chainId": 137,
            "address": "0x6968105460f67c3BF751bE7C15f92F5286Fd0CE5",
            "name": "Monavale",
            "symbol": "MONA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13298/thumb/monavale_logo.jpg?1607232721"
        },
        {
            "chainId": 137,
            "address": "0xA3c322Ad15218fBFAEd26bA7f616249f7705D945",
            "name": "GensoKishi Metaverse",
            "symbol": "MV",
            "decimals": 18,
            "image": "https://s2.coinmarketcap.com/static/img/coins/64x64/17704.png"
        },
        {
            "chainId": 137,
            "address": "0x4985E0B13554fB521840e893574D3848C10Fcc6f",
            "name": "PolySwarm",
            "symbol": "NCT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2843/thumb/ImcYCVfX_400x400.jpg?1628519767"
        },
        {
            "chainId": 137,
            "address": "0x0Bf519071b02F22C17E7Ed5F4002ee1911f46729",
            "name": "Numeraire",
            "symbol": "NMR",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x282d8efCe846A88B159800bd4130ad77443Fa1A1",
            "name": "Ocean Protocol",
            "symbol": "OCEAN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686"
        },
        {
            "chainId": 137,
            "address": "0xa63Beffd33AB3a2EfD92a39A7D2361CEE14cEbA8",
            "name": "Origin Protocol",
            "symbol": "OGN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3296/thumb/op.jpg?1547037878"
        },
        {
            "chainId": 137,
            "address": "0x62414D03084EeB269E18C970a21f45D2967F0170",
            "name": "OMG Network",
            "symbol": "OMG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/776/thumb/OMG_Network.jpg?1591167168"
        },
        {
            "chainId": 137,
            "address": "0x0EE392bA5ef1354c9bd75a98044667d307C0e773",
            "name": "Orion Protocol",
            "symbol": "ORN",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/11841/thumb/orion_logo.png?1594943318"
        },
        {
            "chainId": 137,
            "address": "0x9880e3dDA13c8e7D4804691A45160102d31F6060",
            "name": "Orchid",
            "symbol": "OXT",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4575f41308EC1483f3d399aa9a2826d74Da13Deb/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x553d3D295e0f695B9228246232eDF400ed3560B5",
            "name": "PAX Gold",
            "symbol": "PAXG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9519/thumb/paxg.PNG?1568542565"
        },
        {
            "chainId": 137,
            "address": "0x263534a4Fe3cb249dF46810718B7B612a30ebbff",
            "name": "Perpetual Protocol",
            "symbol": "PERP",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12381/thumb/60d18e06844a844ad75901a9_mark_only_03.png?1628674771"
        },
        {
            "chainId": 137,
            "address": "0x8765f05ADce126d70bcdF1b0a48Db573316662eB",
            "name": "PlayDapp",
            "symbol": "PLA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14316/thumb/54023228.png?1615366911"
        },
        {
            "chainId": 137,
            "address": "0x7dc0cb65EC6019330a6841e9c274f2EE57A6CA6C",
            "name": "Pluton",
            "symbol": "PLU",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/1241/thumb/pluton.png?1548331624"
        },
        {
            "chainId": 137,
            "address": "0x8dc302e2141DA59c934d900886DbF1518Fd92cd4",
            "name": "Polkastarter",
            "symbol": "POLS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12648/thumb/polkastarter.png?1609813702"
        },
        {
            "chainId": 137,
            "address": "0xcB059C5573646047D6d88dDdb87B745C18161d3b",
            "name": "Polymath",
            "symbol": "POLY",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2784/thumb/inKkF01.png?1605007034"
        },
        {
            "chainId": 137,
            "address": "0x73580A2416A57f1C4b6391DBA688A9e4f7DBECE0",
            "name": "Marlin",
            "symbol": "POND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/8903/thumb/POND_200x200.png?1622515451"
        },
        {
            "chainId": 137,
            "address": "0x0AaB8DC887D34f00D50E19aee48371a941390d14",
            "name": "Power Ledger",
            "symbol": "POWR",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/1104/thumb/power-ledger.png?1547035082"
        },
        {
            "chainId": 137,
            "address": "0x82FFdFD1d8699E8886a4e77CeFA9dd9710a7FefD",
            "name": "Propy",
            "symbol": "PRO",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/869/thumb/propy.png?1548332100"
        },
        {
            "chainId": 137,
            "address": "0x9377Eeb7419486FD4D485671d50baa4BF77c2222",
            "name": "PARSIQ",
            "symbol": "PRQ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11973/thumb/DsNgK0O.png?1596590280"
        },
        {
            "chainId": 137,
            "address": "0x36B77a184bE8ee56f5E81C56727B20647A42e28E",
            "name": "Quant",
            "symbol": "QNT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3370/thumb/5ZOu7brX_400x400.jpg?1612437252"
        },
        {
            "chainId": 137,
            "address": "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
            "name": "Quickswap",
            "symbol": "QUICK",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13970/thumb/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659"
        },
        {
            "chainId": 137,
            "address": "0x2f81e176471CC57fDC76f7d332FB4511bF2bebDD",
            "name": "Radicle",
            "symbol": "RAD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14013/thumb/radicle.png?1614402918"
        },
        {
            "chainId": 137,
            "address": "0x00e5646f60AC6Fb446f621d146B6E1886f002905",
            "name": "Rai Reflex Index",
            "symbol": "RAI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14004/thumb/RAI-logo-coin.png?1613592334"
        },
        {
            "chainId": 137,
            "address": "0x780053837cE2CeEaD2A90D9151aA21FC89eD49c2",
            "name": "Rarible",
            "symbol": "RARI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11845/thumb/Rari.png?1594946953"
        },
        {
            "chainId": 137,
            "address": "0xc3cFFDAf8F3fdF07da6D5e3A89B8723D5E385ff8",
            "name": "Rubic",
            "symbol": "RBC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12629/thumb/200x200.png?1607952509"
        },
        {
            "chainId": 137,
            "address": "0x19782D3Dc4701cEeeDcD90f0993f0A9126ed89d0",
            "name": "Republic Token",
            "symbol": "REN",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x6563c1244820CfBd6Ca8820FBdf0f2847363F733",
            "name": "Reputation Augur v2",
            "symbol": "REPv2",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x221657776846890989a759BA2973e427DfF5C9bB/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xAdf2F2Ed91755eA3f4bcC9107a494879f633ae7C",
            "name": "Request",
            "symbol": "REQ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/1031/thumb/Request_icon_green.png?1643250951"
        },
        {
            "chainId": 137,
            "address": "0x70c006878a5A50Ed185ac4C87d837633923De296",
            "name": "REVV",
            "symbol": "REVV",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12373/thumb/REVV_TOKEN_Refined_2021_%281%29.png?1627652390"
        },
        {
            "chainId": 137,
            "address": "0x3b9dB434F08003A89554CDB43b3e0b1f8734BdE7",
            "name": "Rari Governance Token",
            "symbol": "RGT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12900/thumb/Rari_Logo_Transparent.png?1613978014"
        },
        {
            "chainId": 137,
            "address": "0xbe662058e00849C3Eef2AC9664f37fEfdF2cdbFE",
            "name": "iExec RLC",
            "symbol": "RLC",
            "decimals": 9,
            "image": "https://assets.coingecko.com/coins/images/646/thumb/pL1VuXm.png?1604543202"
        },
        {
            "chainId": 137,
            "address": "0x76b8D57e5ac6afAc5D415a054453d1DD2c3C0094",
            "name": "Rally",
            "symbol": "RLY",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12843/thumb/image.png?1611212077"
        },
        {
            "chainId": 137,
            "address": "0x61299774020dA444Af134c82fa83E3810b309991",
            "name": "Render Token",
            "symbol": "RNDR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11636/thumb/rndr.png?1638840934"
        },
        {
            "chainId": 137,
            "address": "0xF92501c8213da1D6C74A76372CCc720Dc8818407",
            "name": "Rook",
            "symbol": "ROOK",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13005/thumb/keeper_dao_logo.jpg?1604316506"
        },
        {
            "chainId": 137,
            "address": "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
            "name": "The Sandbox",
            "symbol": "SAND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942"
        },
        {
            "chainId": 137,
            "address": "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
            "name": "Shiba Inu",
            "symbol": "SHIB",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11939/thumb/shiba.png?1622619446"
        },
        {
            "chainId": 137,
            "address": "0x0C7304fBAf2A320a1c50c46FE03752722F729946",
            "name": "Smooth Love Potion",
            "symbol": "SLP",
            "decimals": 0,
            "image": "https://assets.coingecko.com/coins/images/10366/thumb/SLP.png?1578640057"
        },
        {
            "chainId": 137,
            "address": "0x50B728D8D964fd00C2d0AAD81718b71311feF68a",
            "name": "Synthetix Network Token",
            "symbol": "SNX",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xcdB3C70CD25FD15307D84C4F9D37d5C043B33Fb2",
            "name": "Spell Token",
            "symbol": "SPELL",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15861/thumb/abracadabra-3.png?1622544862"
        },
        {
            "chainId": 137,
            "address": "0xd72357dAcA2cF11A5F155b9FF7880E595A3F5792",
            "name": "Storj Token",
            "symbol": "STORJ",
            "decimals": 8,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xB36e3391B22a970d31A9b620Ae1A414C6c256d2a",
            "name": "Stox",
            "symbol": "STX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/1230/thumb/stox-token.png?1547035256"
        },
        {
            "chainId": 137,
            "address": "0x60Ea918FC64360269Da4efBDA11d8fC6514617C6",
            "name": "SUKU",
            "symbol": "SUKU",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11969/thumb/UmfW5S6f_400x400.jpg?1596602238"
        },
        {
            "chainId": 137,
            "address": "0xa1428174F516F527fafdD146b883bB4428682737",
            "name": "SuperFarm",
            "symbol": "SUPER",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14040/thumb/6YPdWn6.png?1613975899"
        },
        {
            "chainId": 137,
            "address": "0xF81b4Bec6Ca8f9fe7bE01CA734F55B2b6e03A7a0",
            "name": "Synth sUSD",
            "symbol": "sUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1616150765"
        },
        {
            "chainId": 137,
            "address": "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
            "name": "Sushi",
            "symbol": "SUSHI",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x8798249c2e607446efb7ad49ec89dd1865ff4272.png"
        },
        {
            "chainId": 137,
            "address": "0x6aBB753C1893194DE4a83c6e8B4EadFc105Fd5f5",
            "name": "Swipe",
            "symbol": "SXP",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9368/thumb/swipe.png?1566792311"
        },
        {
            "chainId": 137,
            "address": "0xe1708AbDE4847B4929b70547E5197F1Ba1db2250",
            "name": "Tokemak",
            "symbol": "TOKE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17495/thumb/tokemak-avatar-200px-black.png?1628131614"
        },
        {
            "chainId": 137,
            "address": "0xA7b98d63a137bF402b4570799ac4caD0BB1c4B1c",
            "name": "OriginTrail",
            "symbol": "TRAC",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f.png"
        },
        {
            "chainId": 137,
            "address": "0xE3322702BEdaaEd36CdDAb233360B939775ae5f1",
            "name": "Tellor",
            "symbol": "TRB",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9644/thumb/Blk_icon_current.png?1584980686"
        },
        {
            "chainId": 137,
            "address": "0x8676815789211E799a6DC86d02748ADF9cF86836",
            "name": "Tribe",
            "symbol": "TRIBE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14575/thumb/tribe.PNG?1617487954"
        },
        {
            "chainId": 137,
            "address": "0x5b77bCA482bd3E7958b1103d123888EfCCDaF803",
            "name": "TrueFi",
            "symbol": "TRU",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/13180/thumb/truefi_glyph_color.png?1617610941"
        },
        {
            "chainId": 137,
            "address": "0x5667dcC0ab74D1b1355C3b2061893399331B57e2",
            "name": "The Virtua Kolect",
            "symbol": "TVK",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13330/thumb/virtua_original.png?1656043619"
        },
        {
            "chainId": 137,
            "address": "0x3066818837c5e6eD6601bd5a91B0762877A6B731",
            "name": "UMA Voting Token v1",
            "symbol": "UMA",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
            "name": "Uniswap",
            "symbol": "UNI",
            "decimals": 18,
            "image": "https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
        },
        {
            "chainId": 137,
            "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            "name": "USDCoin",
            "symbol": "USDC",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            "name": "Tether USD",
            "symbol": "USDT",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
        },
        {
            "chainId": 137,
            "address": "0xd0258a3fD00f38aa8090dfee343f10A9D4d30D3F",
            "name": "Voxies",
            "symbol": "VOXEL",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/21260/large/voxies.png"
        },
        {
            "chainId": 137,
            "address": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            "name": "Wrapped BTC",
            "symbol": "WBTC",
            "decimals": 8,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x90bb6fEB70A9a43CfAaA615F856BA309FD759A90",
            "name": "Wrapped Centrifuge",
            "symbol": "WCFG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17106/thumb/WCFG.jpg?1626266462"
        },
        {
            "chainId": 137,
            "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            "name": "Wrapped Ether",
            "symbol": "WETH",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
        },
        {
            "chainId": 137,
            "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            "name": "Wrapped Matic",
            "symbol": "WMATIC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912"
        },
        {
            "chainId": 137,
            "address": "0x1B815d120B3eF02039Ee11dC2d33DE7aA4a8C603",
            "name": "WOO Network",
            "symbol": "WOO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12921/thumb/w2UiemF__400x400.jpg?1603670367"
        },
        {
            "chainId": 137,
            "address": "0xd2507e7b5794179380673870d88B22F94da6abe0",
            "name": "XYO Network",
            "symbol": "XYO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4519/thumb/XYO_Network-logo.png?1547039819"
        },
        {
            "chainId": 137,
            "address": "0xDA537104D6A5edd53c6fBba9A898708E465260b6",
            "name": "yearn finance",
            "symbol": "YFI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330"
        },
        {
            "chainId": 137,
            "address": "0xb8cb8a7F4C2885C03e57E973C74827909Fdc2032",
            "name": "DFI money",
            "symbol": "YFII",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11902/thumb/YFII-logo.78631676.png?1598677348"
        },
        {
            "chainId": 137,
            "address": "0x82617aA52dddf5Ed9Bb7B370ED777b3182A30fd1",
            "name": "Yield Guild Games",
            "symbol": "YGG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17358/thumb/le1nzlO6_400x400.jpg?1632465691"
        },
        {
            "chainId": 137,
            "address": "0x5559Edb74751A0edE9DeA4DC23aeE72cCA6bE3D5",
            "name": "0x Protocol Token",
            "symbol": "ZRX",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png"
        }
    ],
    "arbitrum": [
        {
            "chainId": 42161,
            "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "name": "ETH",
            "symbol": "ETH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/eth.png"
        },
        {
            "chainId": 42161,
            "address": "0x6314C31A7a1652cE482cffe247E9CB7c3f4BB9aF",
            "name": "1inch",
            "symbol": "1INCH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x111111111117dc0aa78b770fa6a738034120c302.png"
        },
        {
            "chainId": 42161,
            "address": "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
            "name": "Aave",
            "symbol": "AAVE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110"
        },
        {
            "chainId": 42161,
            "address": "0xb7910E8b16e63EFD51d5D1a093d56280012A3B9C",
            "name": "Adventure Gold",
            "symbol": "AGLD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/18125/thumb/lpgblc4h_400x400.jpg?1630570955"
        },
        {
            "chainId": 42161,
            "address": "0xeC76E8fe6e2242e6c2117caA244B9e2DE1569923",
            "name": "AIOZ Network",
            "symbol": "AIOZ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14631/thumb/aioz_logo.png?1617413126"
        },
        {
            "chainId": 42161,
            "address": "0xe7dcD50836d0A28c959c72D72122fEDB8E245A6C",
            "name": "Aleph im",
            "symbol": "ALEPH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11676/thumb/Monochram-aleph.png?1608483725"
        },
        {
            "chainId": 42161,
            "address": "0xeF6124368c0B56556667e0de77eA008DfC0a71d1",
            "name": "Alethea Artificial Liquid Intelligence",
            "symbol": "ALI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/22062/thumb/alethea-logo-transparent-colored.png?1642748848"
        },
        {
            "chainId": 42161,
            "address": "0xC9CBf102c73fb77Ec14f8B4C8bd88e050a6b2646",
            "name": "Alpha Venture DAO",
            "symbol": "ALPHA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12738/thumb/AlphaToken_256x256.png?1617160876"
        },
        {
            "chainId": 42161,
            "address": "0x1bfc5d35bf0f7B9e15dc24c78b8C02dbC1e95447",
            "name": "Ankr",
            "symbol": "ANKR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4324/thumb/U85xTl2.png?1608111978"
        },
        {
            "chainId": 42161,
            "address": "0x74885b4D524d497261259B38900f54e6dbAd2210",
            "name": "ApeCoin",
            "symbol": "APE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg?1647476455"
        },
        {
            "chainId": 42161,
            "address": "0xF01dB12F50D0CDF5Fe360ae005b9c52F92CA7811",
            "name": "API3",
            "symbol": "API3",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13256/thumb/api3.jpg?1606751424"
        },
        {
            "chainId": 42161,
            "address": "0x912CE59144191C1204E64559FE8253a0e49E6548",
            "name": "Arbitrum",
            "symbol": "ARB",
            "decimals": 18,
            "image": "https://arbitrum.foundation/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xAC9Ac2C17cdFED4AbC80A53c5553388575714d03",
            "name": "Automata",
            "symbol": "ATA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15985/thumb/ATA.jpg?1622535745"
        },
        {
            "chainId": 42161,
            "address": "0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f",
            "name": "Axelar",
            "symbol": "AXL",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/27277/large/V-65_xQ1_400x400.jpeg"
        },
        {
            "chainId": 42161,
            "address": "0xe88998Fb579266628aF6a03e3821d5983e5D0089",
            "name": "Axie Infinity",
            "symbol": "AXS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13029/thumb/axie_infinity_logo.png?1604471082"
        },
        {
            "chainId": 42161,
            "address": "0xBfa641051Ba0a0Ad1b0AcF549a89536A0D76472E",
            "name": "Badger DAO",
            "symbol": "BADGER",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13287/thumb/badger_dao_logo.jpg?1607054976"
        },
        {
            "chainId": 42161,
            "address": "0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8",
            "name": "Balancer",
            "symbol": "BAL",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x3450687EF141dCd6110b77c2DC44B008616AeE75",
            "name": "Basic Attention Token",
            "symbol": "BAT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/677/thumb/basic-attention-token.png?1547034427"
        },
        {
            "chainId": 42161,
            "address": "0xa68Ec98D7ca870cF1Dd0b00EBbb7c4bF60A8e74d",
            "name": "Biconomy",
            "symbol": "BICO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/21061/thumb/biconomy_logo.jpg?1638269749"
        },
        {
            "chainId": 42161,
            "address": "0x406C8dB506653D882295875F633bEC0bEb921C2A",
            "name": "BitDAO",
            "symbol": "BIT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17627/thumb/rI_YptK8.png?1653983088"
        },
        {
            "chainId": 42161,
            "address": "0xEf171a5BA71348eff16616fd692855c2Fe606EB2",
            "name": "Blur",
            "symbol": "BLUR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/28453/large/blur.png?1670745921"
        },
        {
            "chainId": 42161,
            "address": "0x0D81E50bC677fa67341c44D7eaA9228DEE64A4e1",
            "name": "BarnBridge",
            "symbol": "BOND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853"
        },
        {
            "chainId": 42161,
            "address": "0x31190254504622cEFdFA55a7d3d272e6462629a2",
            "name": "Binance USD",
            "symbol": "BUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766"
        },
        {
            "chainId": 42161,
            "address": "0x1DEBd73E752bEaF79865Fd6446b0c970EaE7732f",
            "name": "Coinbase Wrapped Staked ETH",
            "symbol": "cbETH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/27008/large/cbeth.png"
        },
        {
            "chainId": 42161,
            "address": "0x3a8B787f78D775AECFEEa15706D4221B40F345AB",
            "name": "Celer Network",
            "symbol": "CELR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4379/thumb/Celr.png?1554705437"
        },
        {
            "chainId": 42161,
            "address": "0x354A6dA3fcde098F8389cad84b0182725c6C91dE",
            "name": "Compound",
            "symbol": "COMP",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x6FE14d3CC2f7bDdffBa5CdB3BBE7467dd81ea101",
            "name": "COTI",
            "symbol": "COTI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2962/thumb/Coti.png?1559653863"
        },
        {
            "chainId": 42161,
            "address": "0x8ea3156f834A0dfC78F1A5304fAC2CdA676F354C",
            "name": "Cronos",
            "symbol": "CRO",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/7310/thumb/oCw2s3GI_400x400.jpeg?1645172042"
        },
        {
            "chainId": 42161,
            "address": "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
            "name": "Curve DAO Token",
            "symbol": "CRV",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x319f865b287fCC10b30d8cE6144e8b6D1b476999",
            "name": "Cartesi",
            "symbol": "CTSI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11038/thumb/cartesi.png?1592288021"
        },
        {
            "chainId": 42161,
            "address": "0x84F5c2cFba754E76DD5aE4fB369CfC920425E12b",
            "name": "Cryptex Finance",
            "symbol": "CTX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14932/thumb/glossy_icon_-_C200px.png?1619073171"
        },
        {
            "chainId": 42161,
            "address": "0x9DfFB23CAd3322440bCcFF7aB1C58E781dDBF144",
            "name": "Civic",
            "symbol": "CVC",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/788/thumb/civic.png?1547034556"
        },
        {
            "chainId": 42161,
            "address": "0xaAFcFD42c9954C6689ef1901e03db742520829c5",
            "name": "Convex Finance",
            "symbol": "CVX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15585/thumb/convex.png?1621256328"
        },
        {
            "chainId": 42161,
            "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x3Be7cB2e9413Ef8F42b4A202a0114EB59b64e227",
            "name": "DexTools",
            "symbol": "DEXT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11603/thumb/dext.png?1605790188"
        },
        {
            "chainId": 42161,
            "address": "0xca642467C6Ebe58c13cB4A7091317f34E17ac05e",
            "name": "DIA",
            "symbol": "DIA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11955/thumb/image.png?1646041751"
        },
        {
            "chainId": 42161,
            "address": "0xE3696a02b2C9557639E29d829E9C45EFa49aD47A",
            "name": "district0x",
            "symbol": "DNT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/849/thumb/district0x.png?1547223762"
        },
        {
            "chainId": 42161,
            "address": "0x4667cf53C4eDF659E402B733BEA42B18B68dd74c",
            "name": "DeFi Pulse Index",
            "symbol": "DPI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12465/thumb/defi_pulse_index_set.png?1600051053"
        },
        {
            "chainId": 42161,
            "address": "0x51863cB90Ce5d6dA9663106F292fA27c8CC90c5a",
            "name": "dYdX",
            "symbol": "DYDX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17500/thumb/hjnIm9bV.jpg?1628009360"
        },
        {
            "chainId": 42161,
            "address": "0x3e4Cff6E50F37F731284A92d44AE943e17077fD4",
            "name": "Dogelon Mars",
            "symbol": "ELON",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413"
        },
        {
            "chainId": 42161,
            "address": "0x7fa9549791EFc9030e1Ed3F25D18014163806758",
            "name": "Enjin Coin",
            "symbol": "ENJ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/1102/thumb/enjin-coin-logo.png?1547035078"
        },
        {
            "chainId": 42161,
            "address": "0xfeA31d704DEb0975dA8e77Bf13E04239e70d7c28",
            "name": "Ethereum Name Service",
            "symbol": "ENS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg?1635850140"
        },
        {
            "chainId": 42161,
            "address": "0x2354c8e9Ea898c751F1A15Addeb048714D667f96",
            "name": "Ethernity Chain",
            "symbol": "ERN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14238/thumb/LOGO_HIGH_QUALITY.png?1647831402"
        },
        {
            "chainId": 42161,
            "address": "0x863708032B5c328e11aBcbC0DF9D79C71Fc52a48",
            "name": "Euro Coin",
            "symbol": "EUROC",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/26045/thumb/euro-coin.png?1655394420"
        },
        {
            "chainId": 42161,
            "address": "0x8553d254Cb6934b16F87D2e486b64BbD24C83C70",
            "name": "Harvest Finance",
            "symbol": "FARM",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xa0246c9032bc3a600820415ae600c6388619a14d.png"
        },
        {
            "chainId": 42161,
            "address": "0x4BE87C766A7CE11D5Cc864b6C3Abb7457dCC4cC9",
            "name": "Fetch ai",
            "symbol": "FET",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/5681/thumb/Fetch.jpg?1572098136"
        },
        {
            "chainId": 42161,
            "address": "0x849B40AB2469309117Ed1038c5A99894767C7282",
            "name": "Stafi",
            "symbol": "FIS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12423/thumb/stafi_logo.jpg?1599730991"
        },
        {
            "chainId": 42161,
            "address": "0x3A1429d50E0cBBc45c997aF600541Fe1cc3D2923",
            "name": "Forta",
            "symbol": "FORT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/25060/thumb/Forta_lgo_%281%29.png?1655353696"
        },
        {
            "chainId": 42161,
            "address": "0xf929de51D91C77E42f5090069E0AD7A09e513c73",
            "name": "ShapeShift FOX Token",
            "symbol": "FOX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9988/thumb/FOX.png?1574330622"
        },
        {
            "chainId": 42161,
            "address": "0x7468a5d8E02245B00E8C0217fCE021C70Bc51305",
            "name": "Frax",
            "symbol": "FRAX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13422/thumb/frax_logo.png?1608476506"
        },
        {
            "chainId": 42161,
            "address": "0xd42785D323e608B9E99fa542bd8b1000D4c2Df37",
            "name": "Fantom",
            "symbol": "FTM",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4001/thumb/Fantom.png?1558015016"
        },
        {
            "chainId": 42161,
            "address": "0xd9f9d2Ee2d3EFE420699079f16D9e924affFdEA4",
            "name": "Frax Share",
            "symbol": "FXS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13423/thumb/frax_share.png?1608478989"
        },
        {
            "chainId": 42161,
            "address": "0x2Ed5C8fA0D7Ad71025638aFe5fd72E4fbc5A2667",
            "name": "Gala",
            "symbol": "GALA",
            "decimals": 8,
            "image": "https://assets.coingecko.com/coins/images/12493/thumb/GALA-COINGECKO.png?1600233435"
        },
        {
            "chainId": 42161,
            "address": "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
            "name": "GMX",
            "symbol": "GMX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/18323/large/arbit.png?1631532468"
        },
        {
            "chainId": 42161,
            "address": "0xa0b862F60edEf4452F25B4160F177db44DeB6Cf1",
            "name": "Gnosis Token",
            "symbol": "GNO",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x9623063377AD1B27544C965cCd7342f7EA7e88C7",
            "name": "The Graph",
            "symbol": "GRT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566"
        },
        {
            "chainId": 42161,
            "address": "0x7f9a7DB853Ca816B9A138AEe3380Ef34c437dEe0",
            "name": "Gitcoin",
            "symbol": "GTC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15810/thumb/gitcoin.png?1621992929"
        },
        {
            "chainId": 42161,
            "address": "0x589d35656641d6aB57A545F08cf473eCD9B6D5F7",
            "name": "GYEN",
            "symbol": "GYEN",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/14191/thumb/icon_gyen_200_200.png?1614843343"
        },
        {
            "chainId": 42161,
            "address": "0xd12Eeb0142D4Efe7Af82e4f29E5Af382615bcEeA",
            "name": "Highstreet",
            "symbol": "HIGH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/18973/thumb/logosq200200Coingecko.png?1634090470"
        },
        {
            "chainId": 42161,
            "address": "0x177F394A3eD18FAa85c1462Ae626438a70294EF7",
            "name": "HOPR",
            "symbol": "HOPR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14061/thumb/Shared_HOPR_logo_512px.png?1614073468"
        },
        {
            "chainId": 42161,
            "address": "0x61cA9D186f6b9a793BC08F6C79fd35f205488673",
            "name": "Illuvium",
            "symbol": "ILV",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14468/large/ILV.JPG"
        },
        {
            "chainId": 42161,
            "address": "0x3cFD99593a7F035F717142095a3898e3Fca7783e",
            "name": "Immutable X",
            "symbol": "IMX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/17233/thumb/imx.png?1636691817"
        },
        {
            "chainId": 42161,
            "address": "0x2A2053cb633CAD465B4A8975eD3d7f09DF608F80",
            "name": "Injective",
            "symbol": "INJ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12882/thumb/Secondary_Symbol.png?1628233237"
        },
        {
            "chainId": 42161,
            "address": "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
            "name": "Lido DAO",
            "symbol": "LDO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png?1609873644"
        },
        {
            "chainId": 42161,
            "address": "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
            "name": "ChainLink Token",
            "symbol": "LINK",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x289ba1701C2F088cf0faf8B3705246331cB8A839",
            "name": "Livepeer",
            "symbol": "LPT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/7137/thumb/logo-circle-green.png?1619593365"
        },
        {
            "chainId": 42161,
            "address": "0xfb9E5D956D889D91a82737B9bFCDaC1DCE3e1449",
            "name": "Liquity",
            "symbol": "LQTY",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14665/thumb/200-lqty-icon.png?1617631180"
        },
        {
            "chainId": 42161,
            "address": "0x46d0cE7de6247b0A95f67b43B589b4041BaE7fbE",
            "name": "LoopringCoin V2",
            "symbol": "LRC",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x93b346b6BC2548dA6A1E7d98E9a421B42541425b",
            "name": "Liquity USD",
            "symbol": "LUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327"
        },
        {
            "chainId": 42161,
            "address": "0x442d24578A564EF628A65e6a7E3e7be2a165E231",
            "name": "Decentraland",
            "symbol": "MANA",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png?1550108745"
        },
        {
            "chainId": 42161,
            "address": "0x533A7B414CD1236815a5e09F1E97FC7d5c313739",
            "name": "Mask Network",
            "symbol": "MASK",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14051/thumb/Mask_Network.jpg?1614050316"
        },
        {
            "chainId": 42161,
            "address": "0x99F40b01BA9C469193B360f72740E416B17Ac332",
            "name": "MATH",
            "symbol": "MATH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11335/thumb/2020-05-19-token-200.png?1589940590"
        },
        {
            "chainId": 42161,
            "address": "0x561877b6b3DD7651313794e5F2894B2F18bE0766",
            "name": "Polygon",
            "symbol": "MATIC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912"
        },
        {
            "chainId": 42161,
            "address": "0x7F728F3595db17B0B359f4FC47aE80FAd2e33769",
            "name": "Metis",
            "symbol": "METIS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15595/thumb/metis.jpeg?1660285312"
        },
        {
            "chainId": 42161,
            "address": "0xB20A02dfFb172C474BC4bDa3fD6f4eE70C04daf2",
            "name": "Magic Internet Money",
            "symbol": "MIM",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/16786/thumb/mimlogopng.png?1624979612"
        },
        {
            "chainId": 42161,
            "address": "0x2e9a6Df78E42a30712c10a9Dc4b1C8656f8F2879",
            "name": "Maker",
            "symbol": "MKR",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x8f5c1A99b1df736Ad685006Cb6ADCA7B7Ae4b514",
            "name": "Melon",
            "symbol": "MLN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/605/thumb/melon.png?1547034295"
        },
        {
            "chainId": 42161,
            "address": "0x29024832eC3baBF5074D4F46102aA988097f0Ca0",
            "name": "Maple",
            "symbol": "MPL",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14097/thumb/photo_2021-05-03_14.20.41.jpeg?1620022863"
        },
        {
            "chainId": 42161,
            "address": "0x91b468Fe3dce581D7a6cFE34189F1314b6862eD6",
            "name": "MXC",
            "symbol": "MXC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/4604/thumb/mxc.png?1655534336"
        },
        {
            "chainId": 42161,
            "address": "0x53236015A675fcB937485F1AE58040e4Fb920d5b",
            "name": "PolySwarm",
            "symbol": "NCT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2843/thumb/ImcYCVfX_400x400.jpg?1628519767"
        },
        {
            "chainId": 42161,
            "address": "0xBE06ca305A5Cb49ABf6B1840da7c42690406177b",
            "name": "NKN",
            "symbol": "NKN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3375/thumb/nkn.png?1548329212"
        },
        {
            "chainId": 42161,
            "address": "0x597701b32553b9fa473e21362D480b3a6B569711",
            "name": "Numeraire",
            "symbol": "NMR",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x933d31561e470478079FEB9A6Dd2691fAD8234DF",
            "name": "Ocean Protocol",
            "symbol": "OCEAN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3687/thumb/ocean-protocol-logo.jpg?1547038686"
        },
        {
            "chainId": 42161,
            "address": "0x6FEb262FEb0f775B5312D2e009923f7f58AE423E",
            "name": "Origin Protocol",
            "symbol": "OGN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3296/thumb/op.jpg?1547037878"
        },
        {
            "chainId": 42161,
            "address": "0xd962C1895c46AC0378C502c207748b7061421e8e",
            "name": "OMG Network",
            "symbol": "OMG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/776/thumb/OMG_Network.jpg?1591167168"
        },
        {
            "chainId": 42161,
            "address": "0xfEb4DfC8C4Cf7Ed305bb08065D08eC6ee6728429",
            "name": "PAX Gold",
            "symbol": "PAXG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9519/thumb/paxg.PNG?1568542565"
        },
        {
            "chainId": 42161,
            "address": "0x35E6A59F786d9266c7961eA28c7b768B33959cbB",
            "name": "Pepe",
            "symbol": "PEPE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725"
        },
        {
            "chainId": 42161,
            "address": "0x753D224bCf9AAFaCD81558c32341416df61D3DAC",
            "name": "Perpetual Protocol",
            "symbol": "PERP",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12381/thumb/60d18e06844a844ad75901a9_mark_only_03.png?1628674771"
        },
        {
            "chainId": 42161,
            "address": "0xeeeB5EaC2dB7A7Fc28134aA3248580d48b016b64",
            "name": "Polkastarter",
            "symbol": "POLS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12648/thumb/polkastarter.png?1609813702"
        },
        {
            "chainId": 42161,
            "address": "0xE12F29704F635F4A6E7Ae154838d21F9B33809e9",
            "name": "Polymath",
            "symbol": "POLY",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/2784/thumb/inKkF01.png?1605007034"
        },
        {
            "chainId": 42161,
            "address": "0xdA0a57B710768ae17941a9Fa33f8B720c8bD9ddD",
            "name": "Marlin",
            "symbol": "POND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/8903/thumb/POND_200x200.png?1622515451"
        },
        {
            "chainId": 42161,
            "address": "0x4e91F2AF1ee0F84B529478f19794F5AFD423e4A6",
            "name": "Power Ledger",
            "symbol": "POWR",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/1104/thumb/power-ledger.png?1547035082"
        },
        {
            "chainId": 42161,
            "address": "0x8d8e1b6ffc6832E8D2eF0DE8a3d957cAE7ac5067",
            "name": "Prime",
            "symbol": "PRIME",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/29053/large/PRIMELOGOOO.png?1676976222"
        },
        {
            "chainId": 42161,
            "address": "0x82164a8B646401a8776F9dC5c8Cba35DcAf60Cd2",
            "name": "PARSIQ",
            "symbol": "PRQ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11973/thumb/DsNgK0O.png?1596590280"
        },
        {
            "chainId": 42161,
            "address": "0xC7557C73e0eCa2E1BF7348bB6874Aee63C7eFF85",
            "name": "Quant",
            "symbol": "QNT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/3370/thumb/5ZOu7brX_400x400.jpg?1612437252"
        },
        {
            "chainId": 42161,
            "address": "0xaeF5bbcbFa438519a5ea80B4c7181B4E78d419f2",
            "name": "Rai Reflex Index",
            "symbol": "RAI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14004/thumb/RAI-logo-coin.png?1613592334"
        },
        {
            "chainId": 42161,
            "address": "0xCF8600347Dc375C5f2FdD6Dab9BB66e0b6773cd7",
            "name": "Rarible",
            "symbol": "RARI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11845/thumb/Rari.png?1594946953"
        },
        {
            "chainId": 42161,
            "address": "0x2E9AE8f178d5Ea81970C7799A377B3985cbC335F",
            "name": "Rubic",
            "symbol": "RBC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12629/thumb/200x200.png?1607952509"
        },
        {
            "chainId": 42161,
            "address": "0x9fA891e1dB0a6D1eEAC4B929b5AAE1011C79a204",
            "name": "Republic Token",
            "symbol": "REN",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x1Cb5bBc64e148C5b889E3c667B49edF78BB92171",
            "name": "Request",
            "symbol": "REQ",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/1031/thumb/Request_icon_green.png?1643250951"
        },
        {
            "chainId": 42161,
            "address": "0xef888bcA6AB6B1d26dbeC977C455388ecd794794",
            "name": "Rari Governance Token",
            "symbol": "RGT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12900/thumb/Rari_Logo_Transparent.png?1613978014"
        },
        {
            "chainId": 42161,
            "address": "0xC8a4EeA31E9B6b61c406DF013DD4FEc76f21E279",
            "name": "Render Token",
            "symbol": "RNDR",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11636/thumb/rndr.png?1638840934"
        },
        {
            "chainId": 42161,
            "address": "0xd1318eb19DBF2647743c720ed35174efd64e3DAC",
            "name": "The Sandbox",
            "symbol": "SAND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942"
        },
        {
            "chainId": 42161,
            "address": "0x5033833c9fe8B9d3E09EEd2f73d2aaF7E3872fd1",
            "name": "Shiba Inu",
            "symbol": "SHIB",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11939/thumb/shiba.png?1622619446"
        },
        {
            "chainId": 42161,
            "address": "0x4F9b7DEDD8865871dF65c5D26B1c2dD537267878",
            "name": "SKALE",
            "symbol": "SKL",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13245/thumb/SKALE_token_300x300.png?1606789574"
        },
        {
            "chainId": 42161,
            "address": "0x707F635951193dDaFBB40971a0fCAAb8A6415160",
            "name": "Status",
            "symbol": "SNT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/779/thumb/status.png?1548610778"
        },
        {
            "chainId": 42161,
            "address": "0xcBA56Cd8216FCBBF3fA6DF6137F3147cBcA37D60",
            "name": "Synthetix Network Token",
            "symbol": "SNX",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xb2BE52744a804Cc732d606817C2572C5A3B264e7",
            "name": "Unisocks",
            "symbol": "SOCKS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/10717/thumb/qFrcoiM.png?1582525244"
        },
        {
            "chainId": 42161,
            "address": "0xb74Da9FE2F96B9E0a5f4A3cf0b92dd2bEC617124",
            "name": "SOL Wormhole ",
            "symbol": "SOL",
            "decimals": 9,
            "image": "https://assets.coingecko.com/coins/images/22876/thumb/SOL_wh_small.png?1644224316"
        },
        {
            "chainId": 42161,
            "address": "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
            "name": "Spell Token",
            "symbol": "SPELL",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15861/thumb/abracadabra-3.png?1622544862"
        },
        {
            "chainId": 42161,
            "address": "0xe018C7a3d175Fb0fE15D70Da2c874d3CA16313EC",
            "name": "Stargate Finance",
            "symbol": "STG",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/24413/thumb/STG_LOGO.png?1647654518"
        },
        {
            "chainId": 42161,
            "address": "0xE6320ebF209971b4F4696F7f0954b8457Aa2FCC2",
            "name": "Storj Token",
            "symbol": "STORJ",
            "decimals": 8,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x7f9cf5a2630a0d58567122217dF7609c26498956",
            "name": "SuperFarm",
            "symbol": "SUPER",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14040/thumb/6YPdWn6.png?1613975899"
        },
        {
            "chainId": 42161,
            "address": "0xA970AF1a584579B618be4d69aD6F73459D112F95",
            "name": "Synth sUSD",
            "symbol": "sUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1616150765"
        },
        {
            "chainId": 42161,
            "address": "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A",
            "name": "Sushi",
            "symbol": "SUSHI",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x8798249c2e607446efb7ad49ec89dd1865ff4272.png"
        },
        {
            "chainId": 42161,
            "address": "0x1bCfc0B4eE1471674cd6A9F6B363A034375eAD84",
            "name": "Synapse",
            "symbol": "SYN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/18024/thumb/syn.png?1635002049"
        },
        {
            "chainId": 42161,
            "address": "0x0945Cae3ae47cb384b2d47BC448Dc6A9dEC21F55",
            "name": "Threshold Network",
            "symbol": "T",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/22228/thumb/nFPNiSbL_400x400.jpg?1641220340"
        },
        {
            "chainId": 42161,
            "address": "0x7E2a1eDeE171C5B19E6c54D73752396C0A572594",
            "name": "tBTC",
            "symbol": "tBTC",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x18084fbA666a33d37592fA2633fD49a74DD93a88/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xd58D345Fd9c82262E087d2D0607624B410D88242",
            "name": "Tellor",
            "symbol": "TRB",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9644/thumb/Blk_icon_current.png?1584980686"
        },
        {
            "chainId": 42161,
            "address": "0xBfAE6fecD8124ba33cbB2180aAb0Fe4c03914A5A",
            "name": "Tribe",
            "symbol": "TRIBE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14575/thumb/tribe.PNG?1617487954"
        },
        {
            "chainId": 42161,
            "address": "0xd693Ec944A85eeca4247eC1c3b130DCa9B0C3b22",
            "name": "UMA Voting Token v1",
            "symbol": "UMA",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
            "name": "Uniswap",
            "symbol": "UNI",
            "decimals": 18,
            "image": "https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
        },
        {
            "chainId": 42161,
            "address": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            "name": "USDCoin",
            "symbol": "USDC",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            "name": "Bridged USDC",
            "symbol": "USDC.e",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            "name": "Tether USD",
            "symbol": "USDT",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x1c8Ec4DE3c2BFD3050695D89853EC6d78AE650bb",
            "name": "Wrapped Ampleforth",
            "symbol": "WAMPL",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xd46ba6d942050d489dbd938a2c909a5d5039a161.png"
        },
        {
            "chainId": 42161,
            "address": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
            "name": "Wrapped BTC",
            "symbol": "WBTC",
            "decimals": 8,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            "name": "Wrapped Ether",
            "symbol": "WETH",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
        },
        {
            "chainId": 42161,
            "address": "0xcAFcD85D8ca7Ad1e1C6F82F651fA15E33AEfD07b",
            "name": "WOO Network",
            "symbol": "WOO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12921/thumb/w2UiemF__400x400.jpg?1603670367"
        },
        {
            "chainId": 42161,
            "address": "0x58BbC087e36Db40a84b22c1B93a042294deEAFEd",
            "name": "Chain",
            "symbol": "XCN",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/24210/thumb/Chain_icon_200x200.png?1646895054"
        },
        {
            "chainId": 42161,
            "address": "0x82e3A8F066a6989666b031d916c43672085b1582",
            "name": "yearn finance",
            "symbol": "YFI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11849/thumb/yfi-192x192.png?1598325330"
        },
        {
            "chainId": 42161,
            "address": "0xBD591Bd4DdB64b77B5f76Eab8f03d02519235Ae2",
            "name": "0x Protocol Token",
            "symbol": "ZRX",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png"
        }
    ],
    "optimism": [
        {
            "chainId": 10,
            "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "name": "ETH",
            "symbol": "ETH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/eth.png"
        },
        {
            "chainId": 10,
            "address": "0xAd42D013ac31486B73b6b059e748172994736426",
            "name": "1inch",
            "symbol": "1INCH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x111111111117dc0aa78b770fa6a738034120c302.png"
        },
        {
            "chainId": 10,
            "address": "0x76FB31fb4af56892A25e32cFC43De717950c9278",
            "name": "Aave",
            "symbol": "AAVE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110"
        },
        {
            "chainId": 10,
            "address": "0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921",
            "name": "Balancer",
            "symbol": "BAL",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x3e7eF8f50246f725885102E8238CBba33F276747",
            "name": "BarnBridge",
            "symbol": "BOND",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12811/thumb/barnbridge.jpg?1602728853"
        },
        {
            "chainId": 10,
            "address": "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39",
            "name": "Binance USD",
            "symbol": "BUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766"
        },
        {
            "chainId": 10,
            "address": "0xadDb6A0412DE1BA0F936DCaeb8Aaa24578dcF3B2",
            "name": "Coinbase Wrapped Staked ETH",
            "symbol": "cbETH",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/27008/large/cbeth.png"
        },
        {
            "chainId": 10,
            "address": "0x0994206dfE8De6Ec6920FF4D779B0d950605Fb53",
            "name": "Curve DAO Token",
            "symbol": "CRV",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png"
        },
        {
            "chainId": 10,
            "address": "0xEc6adef5E1006bb305bB1975333e8fc4071295bf",
            "name": "Cartesi",
            "symbol": "CTSI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11038/thumb/cartesi.png?1592288021"
        },
        {
            "chainId": 10,
            "address": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x65559aA14915a70190438eF90104769e5E890A00",
            "name": "Ethereum Name Service",
            "symbol": "ENS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg?1635850140"
        },
        {
            "chainId": 10,
            "address": "0xD8737CA46aa6285dE7B8777a8e3db232911baD41",
            "name": "Stafi",
            "symbol": "FIS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12423/thumb/stafi_logo.jpg?1599730991"
        },
        {
            "chainId": 10,
            "address": "0xF1a0DA3367BC7aa04F8D94BA57B862ff37CeD174",
            "name": "ShapeShift FOX Token",
            "symbol": "FOX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9988/thumb/FOX.png?1574330622"
        },
        {
            "chainId": 10,
            "address": "0x2E3D870790dC77A83DD1d18184Acc7439A53f475",
            "name": "Frax",
            "symbol": "FRAX",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13422/thumb/frax_logo.png?1608476506"
        },
        {
            "chainId": 10,
            "address": "0x67CCEA5bb16181E7b4109c9c2143c24a1c2205Be",
            "name": "Frax Share",
            "symbol": "FXS",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13423/thumb/frax_share.png?1608478989"
        },
        {
            "chainId": 10,
            "address": "0x1EBA7a6a72c894026Cd654AC5CDCF83A46445B08",
            "name": "Gitcoin",
            "symbol": "GTC",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/15810/thumb/gitcoin.png?1621992929"
        },
        {
            "chainId": 10,
            "address": "0x589d35656641d6aB57A545F08cf473eCD9B6D5F7",
            "name": "GYEN",
            "symbol": "GYEN",
            "decimals": 6,
            "image": "https://assets.coingecko.com/coins/images/14191/thumb/icon_gyen_200_200.png?1614843343"
        },
        {
            "chainId": 10,
            "address": "0xFdb794692724153d1488CcdBE0C56c252596735F",
            "name": "Lido DAO",
            "symbol": "LDO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png?1609873644"
        },
        {
            "chainId": 10,
            "address": "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
            "name": "ChainLink Token",
            "symbol": "LINK",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png"
        },
        {
            "chainId": 10,
            "address": "0xFEaA9194F9F8c1B65429E31341a103071464907E",
            "name": "LoopringCoin V2",
            "symbol": "LRC",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD/logo.png"
        },
        {
            "chainId": 10,
            "address": "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
            "name": "Liquity USD",
            "symbol": "LUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14666/thumb/Group_3.png?1617631327"
        },
        {
            "chainId": 10,
            "address": "0x3390108E913824B8eaD638444cc52B9aBdF63798",
            "name": "Mask Network",
            "symbol": "MASK",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14051/thumb/Mask_Network.jpg?1614050316"
        },
        {
            "chainId": 10,
            "address": "0xab7bAdEF82E9Fe11f6f33f87BC9bC2AA27F2fCB5",
            "name": "Maker",
            "symbol": "MKR",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x4200000000000000000000000000000000000042",
            "name": "Optimism",
            "symbol": "OP",
            "decimals": 18,
            "image": "https://ethereum-optimism.github.io/data/OP/logo.png"
        },
        {
            "chainId": 10,
            "address": "0xC1c167CC44f7923cd0062c4370Df962f9DDB16f5",
            "name": "Pepe",
            "symbol": "PEPE",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725"
        },
        {
            "chainId": 10,
            "address": "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
            "name": "Perpetual Protocol",
            "symbol": "PERP",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12381/thumb/60d18e06844a844ad75901a9_mark_only_03.png?1628674771"
        },
        {
            "chainId": 10,
            "address": "0x7FB688CCf682d58f86D7e38e03f9D22e7705448B",
            "name": "Rai Reflex Index",
            "symbol": "RAI",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/14004/thumb/RAI-logo-coin.png?1613592334"
        },
        {
            "chainId": 10,
            "address": "0xB548f63D4405466B36C0c0aC3318a22fDcec711a",
            "name": "Rari Governance Token",
            "symbol": "RGT",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12900/thumb/Rari_Logo_Transparent.png?1613978014"
        },
        {
            "chainId": 10,
            "address": "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
            "name": "Synthetix Network Token",
            "symbol": "SNX",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png"
        },
        {
            "chainId": 10,
            "address": "0xba1Cf949c382A32a09A17B2AdF3587fc7fA664f1",
            "name": "SOL Wormhole ",
            "symbol": "SOL",
            "decimals": 9,
            "image": "https://assets.coingecko.com/coins/images/22876/thumb/SOL_wh_small.png?1644224316"
        },
        {
            "chainId": 10,
            "address": "0xEf6301DA234fC7b0545c6E877D3359FE0B9E50a4",
            "name": "SUKU",
            "symbol": "SUKU",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/11969/thumb/UmfW5S6f_400x400.jpg?1596602238"
        },
        {
            "chainId": 10,
            "address": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
            "name": "Synth sUSD",
            "symbol": "sUSD",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/5013/thumb/sUSD.png?1616150765"
        },
        {
            "chainId": 10,
            "address": "0x3eaEb77b03dBc0F6321AE1b72b2E9aDb0F60112B",
            "name": "Sushi",
            "symbol": "SUSHI",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x8798249c2e607446efb7ad49ec89dd1865ff4272.png"
        },
        {
            "chainId": 10,
            "address": "0x747e42Eb0591547a0ab429B3627816208c734EA7",
            "name": "Threshold Network",
            "symbol": "T",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/22228/thumb/nFPNiSbL_400x400.jpg?1641220340"
        },
        {
            "chainId": 10,
            "address": "0xaf8cA653Fa2772d58f4368B0a71980e9E3cEB888",
            "name": "Tellor",
            "symbol": "TRB",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/9644/thumb/Blk_icon_current.png?1584980686"
        },
        {
            "chainId": 10,
            "address": "0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea",
            "name": "UMA Voting Token v1",
            "symbol": "UMA",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
            "name": "Uniswap",
            "symbol": "UNI",
            "decimals": 18,
            "image": "https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg"
        },
        {
            "chainId": 10,
            "address": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            "name": "USDCoin",
            "symbol": "USDC",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            "name": "Tether USD",
            "symbol": "USDT",
            "decimals": 6,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
            "name": "Wrapped BTC",
            "symbol": "WBTC",
            "decimals": 8,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x4200000000000000000000000000000000000006",
            "name": "Wrapped Ether",
            "symbol": "WETH",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
        },
        {
            "chainId": 10,
            "address": "0x871f2F2ff935FD1eD867842FF2a7bfD051A5E527",
            "name": "WOO Network",
            "symbol": "WOO",
            "decimals": 18,
            "image": "https://assets.coingecko.com/coins/images/12921/thumb/w2UiemF__400x400.jpg?1603670367"
        },
        {
            "chainId": 10,
            "address": "0xD1917629B3E6A72E6772Aab5dBe58Eb7FA3C2F33",
            "name": "0x Protocol Token",
            "symbol": "ZRX",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png"
        }
    ],
    "base": [
        {
            "chainId": 8453,
            "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            "name": "ETH",
            "symbol": "ETH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/eth.png"
        },
        {
            "chainId": 8453,
            "address": "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE",
            "name": "1inch",
            "symbol": "1INCH",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x111111111117dc0aa78b770fa6a738034120c302.png"
        },
        {
            "chainId": 8453,
            "address": "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1",
            "name": "Balancer",
            "symbol": "BAL",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png"
        },
        {
            "chainId": 8453,
            "address": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
            "name": "Coinbase Wrapped Staked ETH",
            "symbol": "cbETH",
            "decimals": 18,
            "image": "https://ethereum-optimism.github.io/data/cbETH/logo.svg"
        },
        {
            "chainId": 8453,
            "address": "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
            "name": "Compound",
            "symbol": "COMP",
            "decimals": 18,
            "image": "https://ethereum-optimism.github.io/data/COMP/logo.svg"
        },
        {
            "chainId": 8453,
            "address": "0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415",
            "name": "Curve DAO Token",
            "symbol": "CRV",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png"
        },
        {
            "chainId": 8453,
            "address": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "image": "https://ethereum-optimism.github.io/data/DAI/logo.svg"
        },
        {
            "chainId": 8453,
            "address": "0xD08a2917653d4E460893203471f0000826fb4034",
            "name": "Harvest Finance",
            "symbol": "FARM",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xa0246c9032bc3a600820415ae600c6388619a14d.png"
        },
        {
            "chainId": 8453,
            "address": "0x7D49a065D17d6d4a55dc13649901fdBB98B2AFBA",
            "name": "Sushi",
            "symbol": "SUSHI",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0x8798249c2e607446efb7ad49ec89dd1865ff4272.png"
        },
        {
            "chainId": 8453,
            "address": "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
            "name": "tBTC",
            "symbol": "tBTC",
            "decimals": 18,
            "image": "https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/0x18084fbA666a33d37592fA2633fD49a74DD93a88/logo.png"
        },
        {
            "chainId": 8453,
            "address": "0xA81a52B4dda010896cDd386C7fBdc5CDc835ba23",
            "name": "OriginTrail",
            "symbol": "TRAC",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f.png"
        },
        {
            "chainId": 8453,
            "address": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
            "name": "USD Base Coin",
            "symbol": "USDbC",
            "decimals": 6,
            "image": "https://ethereum-optimism.github.io/data/USDC/logo.png"
        },
        {
            "chainId": 8453,
            "address": "0x489fe42C267fe0366B16b0c39e7AEEf977E841eF",
            "name": "Wrapped Ampleforth",
            "symbol": "WAMPL",
            "decimals": 18,
            "image": "https://token-icons.s3.amazonaws.com/0xd46ba6d942050d489dbd938a2c909a5d5039a161.png"
        },
        {
            "chainId": 8453,
            "address": "0x4200000000000000000000000000000000000006",
            "name": "Wrapped Ether",
            "symbol": "WETH",
            "decimals": 18,
            "image": "https://ethereum-optimism.github.io/data/WETH/logo.png"
        },
        {
            "chainId": 8453,
            "address": "0x3bB4445D30AC020a84c1b5A8A2C6248ebC9779D0",
            "name": "0x Protocol Token",
            "symbol": "ZRX",
            "decimals": 18,
            "image": "https://ethereum-optimism.github.io/data/ZRX/logo.png"
        }
    ]
}

export const tokenData = {
    "polygon": {
        "aaveV2": [
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xbcca60bb61934080951369a648fb03df4f96263c.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x3ed3b47dd13ec9a98b44e6204a523e766b225811.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x028171bca77440897b824ca71d1c56cac55b68a3.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aWETH",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x030ba81f1c18d280636f32af80b9aad02cf0854e.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aWMATIC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    "symbol": "wmatic",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/ef4dfcc9-4a7e-4a92-a538-df3d6f53e517.png"
                }
            },
            {
                "name": "aAAVE",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xffc97d72e13e01096502cb8eb52dee56f74dad7b.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            }
        ],
        "aaveV3": [
            {
                "name": "aUSDCv3",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDTv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aDAIv3",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aWETHv3",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aWMATICv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    "symbol": "wmatic",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/ef4dfcc9-4a7e-4a92-a538-df3d6f53e517.png"
                }
            },
            {
                "name": "aAAVEv3",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aWBTCv3",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc4b8ed459e00e5400be803a9bb3954234fd50e3.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aBALv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
                    "symbol": "bal",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xba100000625a3754423978a60c9317c58a424e3d.png"
                }
            }
        ],
        "compoundV3": [
            {
                "name": "cUSDC",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "dForce": [
            {
                "name": "dForceUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["polygon"]
    },
    "arbitrum": {
        "aaveV3": [
            {
                "name": "aWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDCe",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "symbol": "usdc.e",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "awstETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x5979D7b546E38E414F7E9822514be443A4800529",
                    "symbol": "wstETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "aWBTC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aARB",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x912CE59144191C1204E64559FE8253a0e49E6548",
                    "symbol": "arb",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png"
                }
            },
            {
                "name": "aLINK",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84.png",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
                    "symbol": "link",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x514910771af9ca656af840dff83e8264ecf986ca.png"
                }
            },
            {
                "name": "aDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "arETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "10",
                "nativeTokenData": {
                    "nativeToken": "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
                    "symbol": "rETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xae78736cd615f374d3085123a210448e74fc6393.png"
                }
            },
            {
                "name": "aLUSD",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "11",
                "nativeTokenData": {
                    "nativeToken": "0x93b346b6BC2548dA6A1E7d98E9a421B42541425b",
                    "symbol": "lusd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png"
                }
            },
            {
                "name": "aAAVE",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aFRAX",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x853d955acef822db058eb8505911ed77f175b99e.png",
                "nativeTokenNumber": "13",
                "nativeTokenData": {
                    "nativeToken": "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
                    "symbol": "frax",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x853d955acef822db058eb8505911ed77f175b99e.png"
                }
            },
            {
                "name": "aEURS",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xdb25f211ab05b1c97d595516f45794528a807ad8.png",
                "nativeTokenNumber": "14",
                "nativeTokenData": {
                    "nativeToken": "0xD22a58f79e9481D1a88e00c343885A588b34b68B",
                    "symbol": "eurs",
                    "decimals": 2,
                    "image": "https://token-icons.s3.amazonaws.com/0xdb25f211ab05b1c97d595516f45794528a807ad8.png"
                }
            }
        ],
        "compoundV3": [
            {
                "name": "cUSDCev3",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "symbol": "usdc.e",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "cUSDCv3",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "radiant": [
            {
                "name": "rWBTC",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "rUSDT",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "rUSDC.e",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/faa2e9db-03cd-47d5-847b-3add52239107.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "symbol": "usdc.e",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "rDAI",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "rWETH",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "rwstETH",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x5979D7b546E38E414F7E9822514be443A4800529",
                    "symbol": "wstETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "rARB",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x912CE59144191C1204E64559FE8253a0e49E6548",
                    "symbol": "arb",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png"
                }
            },
            {
                "name": "rUSDC",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["arbitrum"]
    },
    "optimism": {
        "aaveV3": [
            {
                "name": "aDAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "aWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "awstETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "aWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aLINK",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84.png",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
                    "symbol": "link",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x514910771af9ca656af840dff83e8264ecf986ca.png"
                }
            },
            {
                "name": "asUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x625ae63000f46200499120b906716420bd059240.png",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
                    "symbol": "susd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png"
                }
            },
            {
                "name": "arETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "10",
                "nativeTokenData": {
                    "nativeToken": "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D",
                    "symbol": "reth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xae78736cd615f374d3085123a210448e74fc6393.png"
                }
            },
            {
                "name": "aAAVE",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
                "nativeTokenNumber": "11",
                "nativeTokenData": {
                    "nativeToken": "0x76FB31fb4af56892A25e32cFC43De717950c9278",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aLUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
                    "symbol": "lusd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png"
                }
            }
        ],
        "sonne": [
            {
                "name": "soWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "soDAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "soUSDC.e",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "soUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/559c040c-6d7f-48d9-b7b0-843411d653e0.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "soOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "soSUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
                    "symbol": "susd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png"
                }
            },
            {
                "name": "sSONNE",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/3f06218d-a77b-4705-83c9-46b63a776756.png",
                "nativeTokenNumber": "16",
                "nativeTokenData": {
                    "nativeToken": "0x1DB2466d9F5e10D7090E7152B68d62703a2245F0",
                    "symbol": "sonne",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/3f06218d-a77b-4705-83c9-46b63a776756.png"
                }
            },
            {
                "name": "soSNX",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "15",
                "nativeTokenData": {
                    "nativeToken": "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
                    "symbol": "snx",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png"
                }
            },
            {
                "name": "soWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "soLUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
                    "symbol": "lusd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png"
                }
            },
            {
                "name": "sowstETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "soMAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa3fa99a148fa48d14ed51d610c367c61876997f1.png",
                "nativeTokenNumber": "14",
                "nativeTokenData": {
                    "nativeToken": "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
                    "symbol": "mai",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xa3fa99a148fa48d14ed51d610c367c61876997f1.png"
                }
            },
            {
                "name": "soUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "13",
                "nativeTokenData": {
                    "nativeToken": "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "exactly": [
            {
                "name": "exaOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "exaUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "exaWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "exaWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "exawstETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            }
        ],
        "granary": [
            {
                "name": "grainDAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "grainUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "grainUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "grainWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "grainWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "grainOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "grainSUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
                    "symbol": "susd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png"
                }
            },
            {
                "name": "grainBAL",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
                "nativeTokenNumber": "17",
                "nativeTokenData": {
                    "nativeToken": "0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921",
                    "symbol": "bal",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xba100000625a3754423978a60c9317c58a424e3d.png"
                }
            },
            {
                "name": "grainSNX",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "15",
                "nativeTokenData": {
                    "nativeToken": "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
                    "symbol": "snx",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png"
                }
            },
            {
                "name": "grainWSTETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["optimism"]
    },
    "base": {
        "aaveV3": [
            {
                "name": "aBasUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/6c8eaf54-30fe-41ff-b1b3-17b16875cc95.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aBasWETH",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            }
        ],
        "compoundV3": [
            {
                "name": "cUSDbCv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "seamless": [
            {
                "name": "sUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "scbETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
                    "symbol": "cbeth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xbe9895146f7af43049ca1c1ae358b0541ea49704.png"
                }
            },
            {
                "name": "sUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/6c8eaf54-30fe-41ff-b1b3-17b16875cc95.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            }
        ],
        "moonwell": [
            {
                "name": "mDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "mUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/3a31b65e-8ca1-449d-9488-e843f70a6905.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "mUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "mWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "mcbETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
                    "symbol": "cbeth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xbe9895146f7af43049ca1c1ae358b0541ea49704.png"
                }
            },
            {
                "name": "mwstETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
                    "symbol": "wstETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/c7e7a185-d512-499b-977d-ebc48a9e6245.png"
                }
            },
            {
                "name": "mrETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",
                    "symbol": "rETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xae78736cd615f374d3085123a210448e74fc6393.png"
                }
            }
        ],
        "sonne": [
            {
                "name": "sobUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sobUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/3a31b65e-8ca1-449d-9488-e843f70a6905.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sobDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "sobWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "sobcbETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
                    "symbol": "cbeth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xbe9895146f7af43049ca1c1ae358b0541ea49704.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["base"]
    }
};

export const tokenDataNew = {
    "polygon": {
        "aaveV2": [
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xbcca60bb61934080951369a648fb03df4f96263c.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x3ed3b47dd13ec9a98b44e6204a523e766b225811.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x028171bca77440897b824ca71d1c56cac55b68a3.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aWETH",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x030ba81f1c18d280636f32af80b9aad02cf0854e.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aWMATIC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    "symbol": "wmatic",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/ef4dfcc9-4a7e-4a92-a538-df3d6f53e517.png"
                }
            },
            {
                "name": "aAAVE",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xffc97d72e13e01096502cb8eb52dee56f74dad7b.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ff58f4ffb29fa2266ab25e75e2a8b3503311656.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            }
        ],
        "aaveV3": [
            {
                "name": "aUSDCv3",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDTv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aDAIv3",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aWETHv3",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aWMATICv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    "symbol": "wmatic",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/ef4dfcc9-4a7e-4a92-a538-df3d6f53e517.png"
                }
            },
            {
                "name": "aAAVEv3",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aWBTCv3",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc4b8ed459e00e5400be803a9bb3954234fd50e3.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aBALv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
                    "symbol": "bal",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xba100000625a3754423978a60c9317c58a424e3d.png"
                }
            }
        ],
        "compoundV3": [
            {
                "name": "cUSDC",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "dForce": [
            {
                "name": "dForceUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["polygon"]
    },
    "avalanche": {
        "aaveV3": [
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aWAVAX",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
                    "symbol": "wavax",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png"
                }
            },
            {
                "name": "aBTCb",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
                    "symbol": "btc.b",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aWETHe",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
                    "symbol": "weth.e",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aWBTCe",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x50b7545627a5162F82A992c33b87aDc75187B218",
                    "symbol": "wbtc.3",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "asAVAX",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
                    "symbol": "savax",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png"
                }
            },
            {
                "name": "aLINKe",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0x5947BB275c521040051D82396192181b413227A3",
                    "symbol": "link.e",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x514910771af9ca656af840dff83e8264ecf986ca.png"
                }
            },
            {
                "name": "aDAIe",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
                    "symbol": "dai.e",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aAAVEe",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "10",
                "nativeTokenData": {
                    "nativeToken": "0x63a72806098Bd3D9520cC43356dD78afe5D386D9",
                    "symbol": "aave.e",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aMAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "11",
                "nativeTokenData": {
                    "nativeToken": "0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b",
                    "symbol": "mai",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xa3fa99a148fa48d14ed51d610c367c61876997f1.png"
                }
            },
            {
                "name": "aFRAX",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64",
                    "symbol": "frax",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x853d955acef822db058eb8505911ed77f175b99e.png"
                }
            }
        ],
        "benqi": [
            {
                "name": "qisAVAX",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
                    "symbol": "savax",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png"
                }
            },
            {
                "name": "qiBTCb",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
                    "symbol": "btc.b",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "qiBTC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x50b7545627a5162F82A992c33b87aDc75187B218",
                    "symbol": "wbtc.3",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "qiETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
                    "symbol": "weth.e",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "qiLINK",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0x5947BB275c521040051D82396192181b413227A3",
                    "symbol": "link.e",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x514910771af9ca656af840dff83e8264ecf986ca.png"
                }
            },
            {
                "name": "qiUSDT",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "13",
                "nativeTokenData": {
                    "nativeToken": "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
                    "symbol": "usdt.e",
                    "decimal": 6,
                    "image": "https://token-icons.s3.amazonaws.com/be5db576-5c03-4e85-951a-01fe784a8364.png"
                }
            },
            {
                "name": "qiUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "14",
                "nativeTokenData": {
                    "nativeToken": "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
                    "symbol": "usdc.e",
                    "decimal": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "qiUSDTn",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "qiUSDCn",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "qiDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
                    "symbol": "dai.e",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["avalanche"]
    },
    "arbitrum": {
        "aaveV3": [
            {
                "name": "aWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDCe",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "symbol": "usdc.e",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "awstETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x5979D7b546E38E414F7E9822514be443A4800529",
                    "symbol": "wstETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "aWBTC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aARB",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x912CE59144191C1204E64559FE8253a0e49E6548",
                    "symbol": "arb",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png"
                }
            },
            {
                "name": "aLINK",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84.png",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
                    "symbol": "link",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x514910771af9ca656af840dff83e8264ecf986ca.png"
                }
            },
            {
                "name": "aDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "arETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "10",
                "nativeTokenData": {
                    "nativeToken": "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8",
                    "symbol": "rETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xae78736cd615f374d3085123a210448e74fc6393.png"
                }
            },
            {
                "name": "aLUSD",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "11",
                "nativeTokenData": {
                    "nativeToken": "0x93b346b6BC2548dA6A1E7d98E9a421B42541425b",
                    "symbol": "lusd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png"
                }
            },
            {
                "name": "aAAVE",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aFRAX",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x853d955acef822db058eb8505911ed77f175b99e.png",
                "nativeTokenNumber": "13",
                "nativeTokenData": {
                    "nativeToken": "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
                    "symbol": "frax",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x853d955acef822db058eb8505911ed77f175b99e.png"
                }
            },
            {
                "name": "aEURS",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xdb25f211ab05b1c97d595516f45794528a807ad8.png",
                "nativeTokenNumber": "14",
                "nativeTokenData": {
                    "nativeToken": "0xD22a58f79e9481D1a88e00c343885A588b34b68B",
                    "symbol": "eurs",
                    "decimals": 2,
                    "image": "https://token-icons.s3.amazonaws.com/0xdb25f211ab05b1c97d595516f45794528a807ad8.png"
                }
            }
        ],
        "compoundV3": [
            {
                "name": "cUSDCev3",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "symbol": "usdc.e",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "cUSDCv3",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x39aa39c021dfbae8fac545936693ac917d5e7563.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "radiant": [
            {
                "name": "rWBTC",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "rUSDT",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "rUSDC.e",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/faa2e9db-03cd-47d5-847b-3add52239107.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
                    "symbol": "usdc.e",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "rDAI",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "rWETH",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "rwstETH",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x5979D7b546E38E414F7E9822514be443A4800529",
                    "symbol": "wstETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "rARB",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x912CE59144191C1204E64559FE8253a0e49E6548",
                    "symbol": "arb",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png"
                }
            },
            {
                "name": "rUSDC",
                "icon": {
                    "src": "/_next/static/media/arbitrum.9234cebb.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["arbitrum"]
    },
    "optimism": {
        "aaveV3": [
            {
                "name": "aDAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "aOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "aWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "awstETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://assets.coingecko.com/coins/images/18834/standard/wstETH.png?1696518295",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "aWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "aUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x9ba00d6856a4edf4665bca2c2309936572473b7e.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x71fc860f7d3a592a4a98740e39db31d25db65ae8.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "aLINK",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84.png",
                "nativeTokenNumber": "8",
                "nativeTokenData": {
                    "nativeToken": "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
                    "symbol": "link",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x514910771af9ca656af840dff83e8264ecf986ca.png"
                }
            },
            {
                "name": "asUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x625ae63000f46200499120b906716420bd059240.png",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
                    "symbol": "susd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png"
                }
            },
            {
                "name": "arETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "10",
                "nativeTokenData": {
                    "nativeToken": "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D",
                    "symbol": "reth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xae78736cd615f374d3085123a210448e74fc6393.png"
                }
            },
            {
                "name": "aAAVE",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
                "nativeTokenNumber": "11",
                "nativeTokenData": {
                    "nativeToken": "0x76FB31fb4af56892A25e32cFC43De717950c9278",
                    "symbol": "aave",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png"
                }
            },
            {
                "name": "aLUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
                    "symbol": "lusd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png"
                }
            }
        ],
        "sonne": [
            {
                "name": "soWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "soDAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "soUSDC.e",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "soUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/559c040c-6d7f-48d9-b7b0-843411d653e0.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "soOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "soSUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
                    "symbol": "susd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png"
                }
            },
            {
                "name": "sSONNE",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/3f06218d-a77b-4705-83c9-46b63a776756.png",
                "nativeTokenNumber": "16",
                "nativeTokenData": {
                    "nativeToken": "0x1DB2466d9F5e10D7090E7152B68d62703a2245F0",
                    "symbol": "sonne",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/3f06218d-a77b-4705-83c9-46b63a776756.png"
                }
            },
            {
                "name": "soSNX",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "15",
                "nativeTokenData": {
                    "nativeToken": "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
                    "symbol": "snx",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png"
                }
            },
            {
                "name": "soWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "soLUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "12",
                "nativeTokenData": {
                    "nativeToken": "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
                    "symbol": "lusd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x5f98805a4e8be255a32880fdec7f6728c6568ba0.png"
                }
            },
            {
                "name": "sowstETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            },
            {
                "name": "soMAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa3fa99a148fa48d14ed51d610c367c61876997f1.png",
                "nativeTokenNumber": "14",
                "nativeTokenData": {
                    "nativeToken": "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
                    "symbol": "mai",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xa3fa99a148fa48d14ed51d610c367c61876997f1.png"
                }
            },
            {
                "name": "soUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "13",
                "nativeTokenData": {
                    "nativeToken": "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "exactly": [
            {
                "name": "exaOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "exaUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "exaWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "exaWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "exawstETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            }
        ],
        "granary": [
            {
                "name": "grainDAI",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "grainUSDC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "grainUSDT",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
                    "symbol": "usdt",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                }
            },
            {
                "name": "grainWBTC",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
                    "symbol": "wbtc",
                    "decimals": 8,
                    "image": "https://token-icons.s3.amazonaws.com/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                }
            },
            {
                "name": "grainWETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "grainOP",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000042",
                    "symbol": "op",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x4200000000000000000000000000000000000042.png"
                }
            },
            {
                "name": "grainSUSD",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "9",
                "nativeTokenData": {
                    "nativeToken": "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
                    "symbol": "susd",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png"
                }
            },
            {
                "name": "grainBAL",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
                "nativeTokenNumber": "17",
                "nativeTokenData": {
                    "nativeToken": "0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921",
                    "symbol": "bal",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xba100000625a3754423978a60c9317c58a424e3d.png"
                }
            },
            {
                "name": "grainSNX",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "15",
                "nativeTokenData": {
                    "nativeToken": "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
                    "symbol": "snx",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png"
                }
            },
            {
                "name": "grainWSTETH",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
                    "symbol": "wsteth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["optimism"]
    },
    "base": {
        "aaveV3": [
            {
                "name": "aBasUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/6c8eaf54-30fe-41ff-b1b3-17b16875cc95.png",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "aBasWETH",
                "icon": {
                    "src": "/_next/static/media/ethereum.335f2dc8.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            }
        ],
        "compoundV3": [
            {
                "name": "cUSDbCv3",
                "icon": {
                    "src": "/_next/static/media/optimism.853c2353.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            }
        ],
        "seamless": [
            {
                "name": "sUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "scbETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
                    "symbol": "cbeth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xbe9895146f7af43049ca1c1ae358b0541ea49704.png"
                }
            },
            {
                "name": "sUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/6c8eaf54-30fe-41ff-b1b3-17b16875cc95.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            }
        ],
        "moonwell": [
            {
                "name": "mDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "mUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/3a31b65e-8ca1-449d-9488-e843f70a6905.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "mUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "mWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "mcbETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
                    "symbol": "cbeth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xbe9895146f7af43049ca1c1ae358b0541ea49704.png"
                }
            },
            {
                "name": "mwstETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "6",
                "nativeTokenData": {
                    "nativeToken": "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
                    "symbol": "wstETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/c7e7a185-d512-499b-977d-ebc48a9e6245.png"
                }
            },
            {
                "name": "mrETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "7",
                "nativeTokenData": {
                    "nativeToken": "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",
                    "symbol": "rETH",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xae78736cd615f374d3085123a210448e74fc6393.png"
                }
            }
        ],
        "sonne": [
            {
                "name": "sobUSDbC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "1",
                "nativeTokenData": {
                    "nativeToken": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sobUSDC",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/3a31b65e-8ca1-449d-9488-e843f70a6905.png",
                "nativeTokenNumber": "4",
                "nativeTokenData": {
                    "nativeToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "symbol": "usdc",
                    "decimals": 6,
                    "image": "https://token-icons.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                }
            },
            {
                "name": "sobDAI",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d.png",
                "nativeTokenNumber": "5",
                "nativeTokenData": {
                    "nativeToken": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
                    "symbol": "dai",
                    "decimals": 18,
                    "image": "https://s3.amazonaws.com/token-icons/0x6b175474e89094c44da98b954eedeac495271d0f.png"
                }
            },
            {
                "name": "sobWETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
                "nativeTokenNumber": "2",
                "nativeTokenData": {
                    "nativeToken": "0x4200000000000000000000000000000000000006",
                    "symbol": "weth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png"
                }
            },
            {
                "name": "sobcbETH",
                "icon": {
                    "src": "/_next/static/media/avalanche.3415fe31.svg",
                    "height": 32,
                    "width": 32,
                    "blurWidth": 0,
                    "blurHeight": 0
                },
                "image": "",
                "nativeTokenNumber": "3",
                "nativeTokenData": {
                    "nativeToken": "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
                    "symbol": "cbeth",
                    "decimals": 18,
                    "image": "https://token-icons.s3.amazonaws.com/0xbe9895146f7af43049ca1c1ae358b0541ea49704.png"
                }
            }
        ],
        "erc20": erc20ByNetwork["base"]
    }
};

