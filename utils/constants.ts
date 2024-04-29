import { email, github, telegram, twitter, web } from "../assets/images";
import { tSocialHandle } from "../modules/footer/types";

export const metadata = {
    title: "DefiLens",
    description:
        "DefiLens unified Defi trading experience with One-click. DefiLens abstract chains and execute multiple orders in batch across-chains with smart wallet designed platform.",
    keywords:
        "defi, ethereum, base, arbitrum, polygon, optimism, cross chain, cross-chain, acccount abstraction, smart account, trading, batching, rebalance",
    url: "https://defilens.tech",
    image: "https://defilens.tech/twitter-cover.png",
    SITE_NAME: "defilens.tech",
    APP_NAME: "DefiLens",
    username: "@DefiLensTech",
};

export const socialHandles: tSocialHandle[] = [
    {
        icon: telegram,
        key: "telegram",
        href: "https://t.me/defilenscommunity",
    },
    {
        icon: twitter,
        key: "twitter",
        href: "https://twitter.com/DefiLensTech",
    },
    {
        icon: email,
        key: "email",
        href: "mailto:radadiyasunny970@gmail.com",
    },
    {
        icon: github,
        key: "github",
        href: "https://github.com/sunnyRK",
    },
    {
        icon: web,
        key: "web",
        href: metadata.url,
    },
];

export const walletInfo = {
    buttonTitle: "Connect Wallet",
    modalTitle: "Choose your wallet",
    welcomeScreen: {
        title: "Welcome to DefiLens",
        subtitle:
            "Connecting your wallet is like “logging in” to Web3. Select your wallet from the options to get started.",
    },
    error: {
        notConnected: "Please connect your wallet to proceed.",
    },
};
