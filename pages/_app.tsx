import "../styles/globals.css";
import * as React from "react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import { usePathname } from 'next/navigation'
import type { AppProps } from "next/app";
// import $ from 'jquery';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, metamaskWallet, useChain } from "@thirdweb-dev/react";
import "@biconomy/web3-auth/dist/src/style.css";
import { Ethereum, Polygon, Avalanche, Arbitrum, Optimism, Base } from "@thirdweb-dev/chains";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ChainContext from "../Context/ChainContext";
import NewAuth from "../components/NewAuth";
import dynamic from "next/dynamic";
import Link from "next/link";

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

    const SocialLoginDynamic = dynamic(() => import("../components/NewAuth").then((res) => res.default), {
        ssr: false,
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
                    <Toaster position="top-right" reverseOrder={false} />
                      <Suspense fallback={<div>Loading...</div>}>

                        {/* <SocialLoginDynamic /> */}
                        <NewAuth />

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
