import "../styles/globals.css"
import 'react-tabs/style/react-tabs.css';
import type {AppProps} from "next/app"
// import $ from 'jquery';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ThirdwebProvider} from "@thirdweb-dev/react"
import "@biconomy/web3-auth/dist/src/style.css"
import {Inter} from "@next/font/google"
const inter = Inter({subsets: ["latin"]})

export default function App({Component, pageProps}: AppProps) {
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
        <ThirdwebProvider activeChain="polygon">
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </ThirdwebProvider>
        // </main>
    )
}
