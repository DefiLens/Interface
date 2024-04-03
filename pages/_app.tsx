import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { AppProps } from "next/app";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Base, Optimism, Polygon } from "@thirdweb-dev/chains";
import { iGlobal, useGlobalStore } from "../store/GlobalStore";

import HeaderContainer from "../modules/header/HeaderContainer";
import FooterContainer from "../modules/footer/FooterContainer";

import "@biconomy/web3-auth/dist/src/style.css";
import "../assets/styles/index.css";

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
            <ThirdwebProvider
                supportedChains={[Polygon, Base, Optimism]}
                clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
                activeChain={selectedNetwork.chainName}
                supportedWallets={[metamaskWallet({ recommended: true })]}
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
                        <div className="main-bg h-screen w-screen">
                            <HeaderContainer />
                            <div className="w-screen mt-20 h-[calc(100%-119px)] flex justify-center items-start">
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
