import * as React from "react";
import { Suspense } from "react";

import { Toaster } from "react-hot-toast";

import Link from "next/link";
import { Inter } from "next/font/google";
import type, { AppProps } from "next/app";
import { usePathname } from 'next/navigation'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { Polygon, Optimism, Ethereum, Base, Avalanche, Arbitrum } from "@thirdweb-dev/chains";

import AuthHeader from "../components/AuthHeader";
import ChainContext from "../Context/ChainContext";

import "@biconomy/web3-auth/dist/src/style.css";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
    const pathname = usePathname()
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
    
    const TabList = [
        {
          title: "Cross Chain Defi",
          route: '/cross-chain-defi',
        },
        {
          title: "Batching Transactions",
          route: '/batching-transactions',
        },
        // {
        //   title: "Swap",
        //   route: 'swap',
        // },
    ];

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
                    <Toaster 
                      toastOptions={{
                        style: {
                          height:'100%',
                          width: '100%',
                        },
                      }}
                      position="top-right" 
                    />
                      <Suspense fallback={<div>Loading...</div>}>

                        <AuthHeader />

                        <div className="w-screen h-[calc(100%-69px)] flex justify-center items-start">
                            <aside className="w-[250px] h-full flex flex-col justify-start items-center gap-5 p-5 pt-10 text-lg text-light bg-secondary-800 shadow-lg shadow-secondary-500">
                                {TabList.length > 0 &&
                                    TabList?.map((item) => (
                                        <Link
                                          href={item.route}
                                          key={item.title}
                                          className={`cursor-pointer px-4 py-2 text-sm md:text-base text-center rounded-md hover:bg-secondary-600 transition duration-300 ${
                                            pathname === item.route ? "bg-secondary-500" : ""
                                          } `}
                                        > 
                                          {item.title}
                                        </Link>
                                    ))}
                            </aside>
                            <main className="w-full h-full overflow-y-scroll  overflow-x-hidden p-4">
                              <Component {...pageProps} />
                            </main>
                        </div>
                      </Suspense>

                    </QueryClientProvider>
                </ThirdwebProvider>
            </ChainContext.Provider>
        </>
    );
}
