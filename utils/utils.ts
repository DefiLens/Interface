import { iTokenInfo } from "../modules/trade/types";
import { IPFS_FIX_URL } from "./keys";
import { BigNumber as bg } from "bignumber.js";

export function convertIpfsUrl(ipfsUri: string): string {
    // Check if the input URI starts with 'ipfs://'
    if (ipfsUri.startsWith("ipfs://")) {
        // Remove the 'ipfs://' prefix
        const ipfsHash = ipfsUri.replace("ipfs://", "");
        // Create the Cloudflare IPFS URL
        const cloudflareIpfsUrl = `${IPFS_FIX_URL}${ipfsHash}`;
        return cloudflareIpfsUrl;
    }
    // If the input doesn't start with 'ipfs://', return it as is
    return ipfsUri;
}

export function getTokenListByChainId(chainId: any, tokenList: any): iTokenInfo[] {
    return tokenList.tokens
        .map((token) => {
            if (token.chainId == chainId) {
                return {
                    chainId: token.chainId,
                    address: token.address,
                    name: token.name,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    logoURI: token.logoURI.includes("ipfs") ? convertIpfsUrl(token.logoURI) : token.logoURI,
                };
            }
            return null;
        })
        .filter(Boolean) as iTokenInfo[];
}

export function incresePowerByDecimals(amount: any, decimals: any) {
    return bg(amount.toString()).multipliedBy(bg(10).pow(decimals)).toString();
}

export function decreasePowerByDecimals(amount: any, decimals: any) {
    return bg(amount.toString()).dividedBy(bg(10).pow(decimals)).toString();
}
