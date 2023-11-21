/* eslint-disable @next/next/no-title-in-document-head */
import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
            />
            <Head>
                <title>DefiLens</title>
                <meta
                    name="DefiLens"
                    content="DefiLens is pioneering a platform that streamlines trading activities. To offering the ease of trading experience and swift portfolio management to users, Defilens provide a solutions like cross-chain trading and efficiently refinancing defi positions using smart batching strategies."
                    key="desc"
                />
                <link rel="icon" href="/next.svg" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
