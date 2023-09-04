import * as React from "react";
import { useState, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import Swap from "../components/Swap";
import MainForm from "../components/CrossChainLending";
import Transfer from "../components/Transfer";
import Batching from "../components/Batching";

const Index = () => {
    const SocialLoginDynamic = dynamic(() => import("../components/NewAuth").then((res) => res.default), {
        ssr: false,
    });

    const TabList = [
        {
            title: "Cross Chain Defi",
            component: <MainForm />,
        },
        {
            title: "Batching Transactions",
            component: <Batching />,
        },
        {
            title: "Transfer Funds",
            component: <Transfer />,
        },
        // {
        //     title: "Swap",
        //     component: <Swap />,
        // },
    ];

    const [activeTab, setActiveTab] = useState(TabList?.[0]?.title);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <Suspense fallback={<div>Loading...</div>}>
                <SocialLoginDynamic />

                <div className="w-[100vw] h-[calc(100vh-69px)] flex justify-center items-start">
                    <div className="w-[250px] h-full flex flex-col justify-start items-center gap-5 p-5 pt-10 text-lg text-light bg-secondary-800 shadow-lg shadow-secondary-500">
                        {TabList.length > 0 &&
                            TabList?.map((item) => (
                                <div
                                    key={item.title}
                                    className={`cursor-pointer px-4 py-2 text-sm md:text-base text-center rounded-md hover:bg-secondary-600 transition duration-300 ${
                                        activeTab === item.title ? "bg-secondary-500" : ""
                                    } `}
                                    onClick={() => setActiveTab(item.title)}
                                >
                                    {item.title}
                                </div>
                            ))}
                    </div>
                    <div className="w-full h-[calc(100vh-69px)] overflow-y-scroll  overflow-x-hidden p-4">
                        {TabList.length > 0 &&
                            TabList?.map((item) => (
                                <div key={item.title}>{activeTab === item.title && item.component}</div>
                            ))}
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default Index;
