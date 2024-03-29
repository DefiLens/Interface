import * as React from "react";
import { Suspense } from "react";

import { toast, ToastBar, Toaster } from "react-hot-toast";

import Image from "next/image";
import { AppProps } from "next/app";
import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    embeddedWallet,
    trustWallet,
} from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Arbitrum, Avalanche, Base, Ethereum, Optimism, Polygon } from "@thirdweb-dev/chains";

import { closeNarrow } from "../assets/images";
import { iGlobal, useGlobalStore } from "../store/GlobalStore";
import HeaderContainer from "../modules/header/HeaderContainer";
import FooterContainer from "../modules/footer/FooterContainer";

import "@biconomy/web3-auth/dist/src/style.css";

import "../assets/styles/index.css";

export default function App({ Component, pageProps }: AppProps) {
    const metamaskConfig = metamaskWallet({});
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

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
            <ThirdwebProvider
                supportedChains={[Polygon, Base, Optimism]}
                clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
                activeChain={selectedNetwork.chainName}
                supportedWallets={[
                    metamaskWallet({ recommended: true }),
                ]}
            >


                <QueryClientProvider client={queryClient}>
                    {/* <Toaster
                        toastOptions={{
                            style: {
                                height: "100%",
                                minWidth: "30%",
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
                                        {t.type !== "loading" && (
                                            <button type="button">
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
                    </Toaster> */}

                       <Toaster
                            position="bottom-right"
                            toastOptions={{
                            // icon: false,
                            style: {
                                background: '#fff',
                                color: 'black',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                width: '350px',
                                height: '65px',
                                textAlign:'center'
                            },
                            }}
                        />

                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="main-bg h-screen w-screen">
                            <div className="h-[79px]">
                                <HeaderContainer />
                            </div>

                            <div className="w-screen h-[calc(100%-119px)]  flex justify-center items-start">
                                <main className="w-full h-full overflow-y-scroll overflow-x-hidden">
                                    <Component {...pageProps} />
                                </main>
                            </div>

                            <FooterContainer />
                        </div>
                    </Suspense>
                </QueryClientProvider>
            </ThirdwebProvider>
        </>
    );
}
