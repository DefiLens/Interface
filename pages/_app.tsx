import "../styles/globals.css";
import * as React from "react";
import type { AppProps } from "next/app";
// import $ from 'jquery';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, metamaskWallet, useChain } from "@thirdweb-dev/react";
import "@biconomy/web3-auth/dist/src/style.css";
import { Ethereum, Polygon, Avalanche, Arbitrum, Optimism, Base } from "@thirdweb-dev/chains";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ChainContext from "../Context/ChainContext";

export default function App({ Component, pageProps }: AppProps) {
    const metamaskConfig = metamaskWallet({});
    const [selectedChain, setSelectedChain] = React.useState("");

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // refetchOnWindowFocus: false, // default: true,
                cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        },
    });

    return (
        <>
            {/* @ts-ignore */}
            <ChainContext.Provider value={{ selectedChain, setSelectedChain }}>
                <ThirdwebProvider
                    supportedWallets={[metamaskConfig]}
                    supportedChains={[Polygon, Arbitrum, Avalanche, Ethereum, Base, Optimism]}
                    clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
                    activeChain={selectedChain}
                >
                    <QueryClientProvider client={queryClient}>
                        <Component {...pageProps} />
                    </QueryClientProvider>
                </ThirdwebProvider>
            </ChainContext.Provider>
        </>
    );
}
