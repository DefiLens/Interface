import { email, telegram, twitter, web } from "../assets/images";
import { tSocialHandle } from "../modules/footer/types";
import { batching, portfolio, transferfund } from "../assets/images";

export const metadata = {
    APP_NAME: "DefiLens",
    DESCRIPTION:
        "DefiLens unified Defi trading experience with One-click. DefiLens abstract chains and execute multiple orders in batch across-chains with smart wallet designed platform.",
    KEYWORDS:
        "defi, ethereum, base, arbitrum, polygon, optimism, cross chain, cross-chain, acccount abstraction, smart account, trading, batching, rebalance",
    DOMAIN: "https://app.defilens.tech",
    IMAGE: "https://app.defilens.tech/twitter-cover.png",
    SITE_NAME: "app.defilens.tech",
    USERNAME: "@DefiLensTech",
};

export const NavigationList = [
    {
        title: "Batching",
        route: "/",
        icon: batching,
    },
    {
        title: "Portfolio",
        route: "/portfolio",
        icon: portfolio,
    },
    {
        title: "Transfer Fund",
        route: "/transfer-fund",
        icon: transferfund,
    },
    {
        title: "Batch History",
        route: "/portfolio/batch-history",
        icon: batching,
    },
];

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
        href: "mailto:contact@defilens.com",
    },
    // {
    //     icon: github,
    //     key: "github",
    //     href: "https://github.com/sunnyRK",
    // },
    {
        icon: web,
        key: "web",
        href: "https://defilens.tech/",
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

export const transferText = {
    button: {
        migrate_EOA_SCW: "Send EOA to SmartAccount",
        migrate_SCW_EOA: "Send SmartAccount to EOA",
    },
};

export const batchingText = {
    error: {
        wrongNetwork: "Batching is only supported on Polygon, Base, Arbitrum, and Optimism as of now.",
        insufficientFunds: "You don't have enough funds to complete transaction.",
        noAmount: "Please enter amount to proceed."
    },
};
