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
import { NavigationList, metadata } from "../utils/constants";
import JoinWaitlistContainer from "../modules/join-waitlist/migrate-asset/JoinWaitlistContainer";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";
import { usePathname } from "next/navigation";
import { ConnectWalletWrapper } from "../components/Button";
import { logoLight } from "../assets/images";
import { HiBars3 } from "react-icons/hi2";
import { MdOutlineFileDownload } from "react-icons/md";
import MainLayout from "../components/layouts/MainLayout";

export default function App({ Component, pageProps }: AppProps) {
    const { selectedNetwork, mobileMenuOpen, setMobileMenuOpen }: iGlobal = useGlobalStore((state) => state);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        },
    });

    const pathname = usePathname();

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
                                padding: ".4rem .6rem",
                                borderRadius: "4px",
                                height: "3.4rem",
                                textAlign: "center",
                                fontSize: ".8rem",
                            },
                        }}
                    />

                    {/* <Suspense fallback={<div>Loading...</div>}> */}
                        <MainLayout>
                            <Component {...pageProps} />
                        </MainLayout>
                        {/* <div className="flex main-bg h-screen w-screen overflow-hidden"> */}
                        {/* <div className="flex bg-white h-screen w-screen overflow-hidden">
                            <HeaderContainer />
                            <div className="flex flex-col h-full w-full">
                                <main className="min-[calc(100vh-80px)] w-full h-full">
                                    <JoinWaitlistContainer />
                                    <Component {...pageProps} />
                                </main>
                                <FooterContainer />
                            </div>
                        </div> */}
                        {/* <div className="h-screen screen bg-W50 border-8 rounded-xl border-B300 overflow-hidden"> */}
                        {/* <div className="h-screen w-screen bg-W50 overflow-hidden"> */}
                        {/* <div className="flex flex-col lg:flex-row max-h-screen min-h-screen">
                            <HeaderContainer />
                            <div className="bg-white lg:block w-full lg:w-[calc(100vw-16rem)] overflow-x-hidden transition-transform duration-300 ease-in-out">
                                <div className="bg-white lg:block max-w-5xl w-full mx-auto overflow-x-hidden transition-transform duration-300 ease-in-out">
                                    <div className="min-h-10 py-3 flex items-center justify-between border-b border-B50">
                                        <div className="flex items-center gap-3 h-9 ">
                                            <button
                                                type="button"
                                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 lg:hidden"
                                                onClick={() => {
                                                    setMobileMenuOpen(!mobileMenuOpen);
                                                }}
                                            >
                                                <span className="sr-only">Open main menu</span>
                                                <HiBars3 className="h-6 w-6 ml-2" aria-hidden="true" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 px-2 h-9 ">
                                            <div className="hidden lg:flex h-full px-4 rounded-lg border text-xs font-semibold text-B200 border-gray-300 bg-W100 transition-all duration-300 ease-in-out transform shadow-sm text-secondary items-center justify-center font-condensed">
                                                Balance: 57,078,126.78 USDC
                                            </div>
                                            <button className="hidden lg:flex h-full px-4 rounded-lg border text-xs font-semibold text-B200 border-gray-300 bg-W100 hover:bg-white transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed">
                                                <MdOutlineFileDownload className="text-B200 text-lg" />
                                                Deposit USDC
                                            </button>

                                            <ConnectWalletWrapper />
                                        </div>
                                    </div>
                                    <JoinWaitlistContainer />
                                    <Component {...pageProps} />
                                    {/* <FooterContainer /> */}
                        {/* </div>
                            </div>
                        </div>  */}

                        {/* </div> */}
                    {/* </Suspense> */}
                </QueryClientProvider>
            </ThirdwebProvider>
        </>
    );
}
