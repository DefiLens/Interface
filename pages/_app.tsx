import * as React from "react";
import { Suspense } from "react";

import { Toaster, ToastBar, toast } from 'react-hot-toast';

import Link from "next/link";
import Image from "next/image";
import { AppProps } from "next/app";
import { usePathname } from 'next/navigation'
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Polygon, Optimism, Ethereum, Base, Avalanche, Arbitrum } from "@thirdweb-dev/chains";

import { closeNarrow } from "../assets/images";
import ChainContext from "../Context/ChainContext";
import { NavigationList } from "../utils/constants";
import HeaderContainer from "../modules/header/HeaderContainer";

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
                      >
                        {(t) => (
                          <ToastBar toast={t}>
                            {({ icon, message }) => (
                              <>
                                {icon}
                                {message}
                                {t.type !== 'loading' && (
                                  <button
                                    type="button"
                                  >
                                    <Image
                                      src={closeNarrow}
                                      alt="close"
                                      className="h-6 w-6 p-1 cursor-pointer"
                                      onClick={() => toast.dismiss(t.id)}
                                    />
                                  </button>
                                )}
                              </>
                            )}
                          </ToastBar>
                         )}
                      </Toaster>

                      <Suspense fallback={<div>Loading...</div>}>

                       <HeaderContainer />

                        <div className="w-screen h-[calc(100%-69px)] flex justify-center items-start">
                            <aside className="w-[250px] h-full flex flex-col justify-start items-center gap-5 p-5 pt-10 text-lg text-light bg-secondary-800 shadow-lg shadow-secondary-500">
                                {NavigationList.length > 0 &&
                                    NavigationList?.map((item) => (
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
