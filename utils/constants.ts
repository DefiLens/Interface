import { BigNumber, ethers } from "ethers";

export const chainId = 137;
export const network_name = "polygon";
export const ADDRESS_ZERO: string =
  "0x0000000000000000000000000000000000000000";
export const MSG_SENDER: string = "0x0000000000000000000000000000000000000001";
export const ADDRESS_THIS: string =
  "0x0000000000000000000000000000000000000002";

// Tokens
export const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // polygon
export const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // polygon
export const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"; // polygon
export const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // polygon
export const WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; // polygon
export const AAVE = "0xD6DF932A45C0f255f85145f286eA0b292B21C90B"; // polygon

export const tokensArray = [
  "USDT",
  "USDC",
  "DAI",
  "WETH",
  "WMATIC",
  "AAVE",
  "WBTC",
];

export const aTokensArray = [
  "aUSDT",
  "aUSDC",
  "aDAI",
  "aWETH",
  "aWMATIC",
  "aAAVE",
  "aWBTC",
];

export const aTokensArrayDecimal = [6, 6, 18, 18, 18, 18, 8];

export const nativeCtokensArray = ["USDC"];

export const cTokensArray = ["cUSDCv3"];

export const cTokensArrayDecimal = [6];

// Uniswap
export const Permit2Address = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // polygon
export const UniV3FactoryAddress: string =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// Dex
export const UniversalRouter = "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5"; // polygon
export const V3_SWAP_ROUTER_ADDRESS =
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

// Lending
export const compoundContractAddress =
  "0xF25212E676D1F7F89Cd72fFEe66158f541246445";
export const aaveContractAddress = "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf";

export enum CommandType {
  V3_SWAP_EXACT_IN = 0x00,
  V3_SWAP_EXACT_OUT = 0x01,
  PERMIT2_TRANSFER_FROM = 0x02,
  PERMIT2_PERMIT_BATCH = 0x03,
  SWEEP = 0x04,
  TRANSFER = 0x05,
  PAY_PORTION = 0x06,

  V2_SWAP_EXACT_IN = 0x08,
  V2_SWAP_EXACT_OUT = 0x09,
  PERMIT2_PERMIT = 0x0a,
  WRAP_ETH = 0x0b,
  UNWRAP_WETH = 0x0c,
  PERMIT2_TRANSFER_FROM_BATCH = 0x0d,
  BALANCE_CHECK_ERC20 = 0x0e,

  // NFT-related command types
  SEAPORT = 0x10,
  LOOKS_RARE_721 = 0x11,
  NFTX = 0x12,
  CRYPTOPUNKS = 0x13,
  LOOKS_RARE_1155 = 0x14,
  OWNER_CHECK_721 = 0x15,
  OWNER_CHECK_1155 = 0x16,
  SWEEP_ERC721 = 0x17,

  X2Y2_721 = 0x18,
  SUDOSWAP = 0x19,
  NFT20 = 0x1a,
  X2Y2_1155 = 0x1b,
  FOUNDATION = 0x1c,
  SWEEP_ERC1155 = 0x1d,
  ELEMENT_MARKET = 0x1e,

  EXECUTE_SUB_PLAN = 0x20,
  SEAPORT_V1_4 = 0x21,
  APPROVE_ERC20 = 0x22,
}

export const ALLOW_REVERT_FLAG = 0x80;

export const REVERTIBLE_COMMANDS = new Set<CommandType>([
  CommandType.SEAPORT,
  CommandType.SEAPORT_V1_4,
  CommandType.NFTX,
  CommandType.LOOKS_RARE_721,
  CommandType.LOOKS_RARE_1155,
  CommandType.X2Y2_721,
  CommandType.X2Y2_1155,
  CommandType.FOUNDATION,
  CommandType.SUDOSWAP,
  CommandType.NFT20,
  CommandType.EXECUTE_SUB_PLAN,
  CommandType.CRYPTOPUNKS,
  CommandType.ELEMENT_MARKET,
]);

const PERMIT_STRUCT =
  "((address token,uint160 amount,uint48 expiration,uint48 nonce) details, address spender, uint256 sigDeadline)";

const PERMIT_BATCH_STRUCT =
  "((address token,uint160 amount,uint48 expiration,uint48 nonce)[] details, address spender, uint256 sigDeadline)";

const PERMIT2_TRANSFER_FROM_STRUCT =
  "(address from,address to,uint160 amount,address token)";
const PERMIT2_TRANSFER_FROM_BATCH_STRUCT = PERMIT2_TRANSFER_FROM_STRUCT + "[]";

export const ABI_DEFINITION: { [key in CommandType]: string[] } = {
  // Batch Reverts
  [CommandType.EXECUTE_SUB_PLAN]: ["bytes", "bytes[]"],

  // Permit2 Actions
  [CommandType.PERMIT2_PERMIT]: [PERMIT_STRUCT, "bytes"],
  [CommandType.PERMIT2_PERMIT_BATCH]: [PERMIT_BATCH_STRUCT, "bytes"],
  [CommandType.PERMIT2_TRANSFER_FROM]: ["address", "address", "uint160"],
  [CommandType.PERMIT2_TRANSFER_FROM_BATCH]: [
    PERMIT2_TRANSFER_FROM_BATCH_STRUCT,
  ],

  // Uniswap Actions
  [CommandType.V3_SWAP_EXACT_IN]: [
    "address",
    "uint256",
    "uint256",
    "bytes",
    "bool",
  ],
  [CommandType.V3_SWAP_EXACT_OUT]: [
    "address",
    "uint256",
    "uint256",
    "bytes",
    "bool",
  ],
  [CommandType.V2_SWAP_EXACT_IN]: [
    "address",
    "uint256",
    "uint256",
    "address[]",
    "bool",
  ],
  [CommandType.V2_SWAP_EXACT_OUT]: [
    "address",
    "uint256",
    "uint256",
    "address[]",
    "bool",
  ],

  // Token Actions and Checks
  [CommandType.WRAP_ETH]: ["address", "uint256"],
  [CommandType.UNWRAP_WETH]: ["address", "uint256"],
  [CommandType.SWEEP]: ["address", "address", "uint256"],
  [CommandType.SWEEP_ERC721]: ["address", "address", "uint256"],
  [CommandType.SWEEP_ERC1155]: ["address", "address", "uint256", "uint256"],
  [CommandType.TRANSFER]: ["address", "address", "uint256"],
  [CommandType.PAY_PORTION]: ["address", "address", "uint256"],
  [CommandType.BALANCE_CHECK_ERC20]: ["address", "address", "uint256"],
  [CommandType.OWNER_CHECK_721]: ["address", "address", "uint256"],
  [CommandType.OWNER_CHECK_1155]: ["address", "address", "uint256", "uint256"],
  [CommandType.APPROVE_ERC20]: ["address", "uint256"],

  // NFT Markets
  [CommandType.SEAPORT]: ["uint256", "bytes"],
  [CommandType.SEAPORT_V1_4]: ["uint256", "bytes"],
  [CommandType.NFTX]: ["uint256", "bytes"],
  [CommandType.LOOKS_RARE_721]: [
    "uint256",
    "bytes",
    "address",
    "address",
    "uint256",
  ],
  [CommandType.LOOKS_RARE_1155]: [
    "uint256",
    "bytes",
    "address",
    "address",
    "uint256",
    "uint256",
  ],
  [CommandType.X2Y2_721]: ["uint256", "bytes", "address", "address", "uint256"],
  [CommandType.X2Y2_1155]: [
    "uint256",
    "bytes",
    "address",
    "address",
    "uint256",
    "uint256",
  ],
  [CommandType.FOUNDATION]: [
    "uint256",
    "bytes",
    "address",
    "address",
    "uint256",
  ],
  [CommandType.SUDOSWAP]: ["uint256", "bytes"],
  [CommandType.NFT20]: ["uint256", "bytes"],
  [CommandType.CRYPTOPUNKS]: ["uint256", "address", "uint256"],
  [CommandType.ELEMENT_MARKET]: ["uint256", "bytes"],
};

export const swapCodes: any = {
  "00": "V3_SWAP_EXACT_IN",
  "01": "V3_SWAP_EXACT_OUT",
  "08": "V2_SWAP_EXACT_IN",
  "09": "V2_SWAP_EXACT_OUT",
  "0a": "PERMIT2_PERMIT",
  "0b": "WRAP_ETH",
  "0c": "UNWRAP_WETH",
};

export type RouterCommand = {
  type: CommandType;
  encodedInput: string;
};

// Permit2 Constants

export type PermitDetails = {
  token: string;
  amount: number | BigNumber;
  expiration: number | BigNumber;
  nonce: number | BigNumber;
};

export type PermitSingle = {
  details: PermitDetails;
  spender: string;
  sigDeadline: number | BigNumber;
};

export type PermitBatch = {
  details: PermitDetails[];
  spender: string;
  sigDeadline: number | BigNumber;
};

export type TransferDetail = {
  from: string;
  to: string;
  amount: number | BigNumber;
  token: string;
};

export const PERMIT2_PERMIT_TYPE = {
  PermitDetails: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint160" },
    { name: "expiration", type: "uint48" },
    { name: "nonce", type: "uint48" },
  ],
  PermitSingle: [
    { name: "details", type: "PermitDetails" },
    { name: "spender", type: "address" },
    { name: "sigDeadline", type: "uint256" },
  ],
};

export const PERMIT2_PERMIT_BATCH_TYPE = {
  PermitDetails: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint160" },
    { name: "expiration", type: "uint48" },
    { name: "nonce", type: "uint48" },
  ],
  PermitBatch: [
    { name: "details", type: "PermitDetails[]" },
    { name: "spender", type: "address" },
    { name: "sigDeadline", type: "uint256" },
  ],
};

export declare enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

const FEE_SIZE = 3;
