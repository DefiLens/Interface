import * as React from "react";
import { Suspense } from "react";

import { Toaster, ToastBar, toast } from 'react-hot-toast';

import Image from "next/image";
import { AppProps } from "next/app";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Polygon, Optimism, Ethereum, Base, Avalanche, Arbitrum } from "@thirdweb-dev/chains";

import { closeNarrow } from "../assets/images";
import { useGlobalStore, iGlobal } from "../store/GlobalStore";
import HeaderContainer from "../modules/header/HeaderContainer";

import "@biconomy/web3-auth/dist/src/style.css";

import "../assets/styles/index.css";

export default function App({ Component, pageProps }: AppProps) {
    const metamaskConfig = metamaskWallet({});

    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    // const [selectedChain, setSelectedChain] = React.useState("");
    // const [selectedChainId, setSelectedChainId] = React.useState("");

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
            {/* <ChainContext.Provider value={{ selectedChain, setSelectedChain, selectedChainId, setSelectedChainId }}> */}
                <ThirdwebProvider
                    supportedWallets={[metamaskConfig]}
                    supportedChains={[Polygon, Arbitrum, Avalanche, Ethereum, Base, Optimism]}
                    clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
                    // activeChain={selectedChain}
                    activeChain={selectedNetwork.chainName}
                >
                    <QueryClientProvider client={queryClient}>

                      <Toaster
                        toastOptions={{
                          style: {
                            height:'100%',
                            minWidth: '30%',
                          },
                        }}
                        position="top-right"
                      >
                        {(t) => (
                          <ToastBar
                            toast={t}
                          >
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

                        <div className="w-screen h-[calc(100%-69px)] bg-backgound-100 flex justify-center items-start">
                            <main className="w-full h-full overflow-y-scroll  overflow-x-hidden p-4">
                              <Component {...pageProps} />
                            </main>
                        </div>
                      </Suspense>

                    </QueryClientProvider>
                </ThirdwebProvider>
            {/* </ChainContext.Provider> */}
        </>
    );
}
