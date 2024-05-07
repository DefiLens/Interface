import * as React from "react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, phantomWallet, rainbowWallet } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Base, Optimism, Polygon, Arbitrum } from "@thirdweb-dev/chains";
import { iGlobal, useGlobalStore } from "../store/GlobalStore";

import HeaderContainer from "../modules/header/HeaderContainer";
import FooterContainer from "../modules/footer/FooterContainer";

import "@biconomy/web3-auth/dist/src/style.css";
import "../assets/styles/index.css";
import Head from "next/head";
import { metadata } from "../utils/constants";

export default function App({ Component, pageProps }: AppProps) {
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        },
    });

    return (
        <>
            <Head>
                <title>{metadata.APP_NAME}</title>
            </Head>
            {/* @ts-ignore */}
            <ThirdwebProvider
                supportedChains={[Polygon, Base, Optimism, Arbitrum]}
                clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
                activeChain={selectedNetwork.chainName}
                supportedWallets={[
                    metamaskWallet({
                        recommended: true,
                    }),
                    coinbaseWallet(),
                    phantomWallet(),
                    rainbowWallet(),
                ]}
                dAppMeta={{
                    name: metadata.APP_NAME,
                    url: metadata.DOMAIN,
                }}
            >
                <QueryClientProvider client={queryClient}>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: "#fff",
                                color: "black",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                width: "350px",
                                height: "65px",
                                textAlign: "center",
                            },
                        }}
                    />

                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="main-bg min-h-screen w-screen overflow-hidden">
                            <HeaderContainer />
                            <main className="mt-20 w-full h-full">
                                <Component {...pageProps} />
                            </main>
                            <FooterContainer />
                        </div>
                    </Suspense>
                </QueryClientProvider>
            </ThirdwebProvider>
        </>
    );
}
