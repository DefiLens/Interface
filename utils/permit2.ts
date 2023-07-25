import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, ethers } from 'ethers';
import PERMIT2_COMPILE from '../abis/Permit2.json';
import { chainId } from './constants';

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
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint160' },
        { name: 'expiration', type: 'uint48' },
        { name: 'nonce', type: 'uint48' }
    ],
    PermitSingle: [
        { name: 'details', type: 'PermitDetails' },
        { name: 'spender', type: 'address' },
        { name: 'sigDeadline', type: 'uint256' }
    ]
};

export const PERMIT2_PERMIT_BATCH_TYPE = {
    PermitDetails: [
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint160' },
        { name: 'expiration', type: 'uint48' },
        { name: 'nonce', type: 'uint48' }
    ],
    PermitBatch: [
        { name: 'details', type: 'PermitDetails[]' },
        { name: 'spender', type: 'address' },
        { name: 'sigDeadline', type: 'uint256' }
    ]
};

export const PERMIT2_INTERFACE = new ethers.utils.Interface(
    PERMIT2_COMPILE.abi
);

export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}

const FEE_SIZE = 3;

// v3
export function encodePath(path: string[], fees: any[]): string {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }

    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase();
}

export function encodePathExactInput(tokens: string[], fees: any) {
    return encodePath(tokens, fees);
    // return encodePath(tokens, new Array(tokens.length - 1).fill(3000))
}

export function getEip712Domain(chainId: number, verifyingContract: string) {
    return {
        name: 'Permit2',
        chainId,
        verifyingContract
    };
}

export async function signPermit(
    permit: PermitSingle,
    signer: SignerWithAddress,
    verifyingContract: string
): Promise<string> {
    const eip712Domain = getEip712Domain(chainId, verifyingContract);
    const signature = await signer._signTypedData(
        eip712Domain,
        PERMIT2_PERMIT_TYPE,
        permit
    );
    return signature;
}

export async function getPermitSignature(
    permit: PermitSingle,
    signer: any,
    permit2: any
): Promise<string> {
    // look up the correct nonce for this permit
    const address = await signer.getAddress();
    const nextNonce = (
        await permit2?.call('allowance', [
            address,
            permit.details.token,
            permit.spender
        ])
    ).nonce;
    // const nextNonce = (
    //   await permit2?.callStatic.allowance(address, permit.details.token, permit.spender)
    // ).nonce
    permit.details.nonce = nextNonce;
    return await signPermit(permit, signer, permit2.address);
}

export async function getPermitBatchSignature(
    permit: PermitBatch,
    signer: SignerWithAddress,
    permit2: any
): Promise<string> {
    for (const i in permit.details) {
        const nextNonce = (
            await permit2?.callStatic.allowance(
                signer.address,
                permit.details[i].token,
                permit.spender
            )
        ).nonce;
        permit.details[i].nonce = nextNonce;
    }

    return await signPermitBatch(permit, signer, permit2.address);
}

export async function signPermitBatch(
    permit: PermitBatch,
    signer: SignerWithAddress,
    verifyingContract: string
): Promise<string> {
    const eip712Domain = getEip712Domain(chainId, verifyingContract);
    const signature = await signer._signTypedData(
        eip712Domain,
        PERMIT2_PERMIT_BATCH_TYPE,
        permit
    );
    return signature;
}
