import "../styles/globals.css"
import 'react-tabs/style/react-tabs.css';
import * as React from 'react';
import type {AppProps} from "next/app"
// import $ from 'jquery';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ThirdwebProvider, metamaskWallet} from "@thirdweb-dev/react"
import "@biconomy/web3-auth/dist/src/style.css"
import { Ethereum, Polygon, Avalanche } from "@thirdweb-dev/chains";

import {Inter} from "@next/font/google"
const inter = Inter({subsets: ["latin"]})

export default function App({Component, pageProps}: AppProps) {
    const metamaskConfig = metamaskWallet({});

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // refetchOnWindowFocus: false, // default: true,
                cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        },
    })

    return (
        // <main className={inter.className}>
        <ThirdwebProvider
            supportedWallets={[metamaskConfig]}
            supportedChains={[Polygon]}
            clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID} activeChain="polygon">
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </ThirdwebProvider>
        // </main>
    )
}
