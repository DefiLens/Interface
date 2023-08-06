import * as React from "react";
import { useState, Suspense } from "react";

import { Toaster } from "react-hot-toast";

import dynamic from "next/dynamic";

// import MainForm from "../components/MainForm";
import MainForm from "../components/CrossChainDiFi";
import Transfer from "../components/Transfer";

const Index = () => {
  // const SocialLoginDynamic = dynamic(
  //     () => import("../components/Auth").then((res) => res.default), {
  //         ssr: false,
  //     }
  // )

  const SocialLoginDynamic = dynamic(
    () => import("../components/Authentication").then((res) => res.default),
    {
      ssr: false,
    }
  );

  const TabList = [
    {
      title: "Cross Chain Defi",
      component: <MainForm />,
    },
    {
      title: "Transfer Funds",
      component: <Transfer />,
    },
  ];

  const [activeTab, setActiveTab] = useState(TabList?.[0]?.title);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginDynamic />

        <div className="w-[100vw] h-[89vh] flex justify-center items-start">
          <div className="w-[250px] h-full flex flex-col justify-start items-center gap-5 p-5 pt-10 text-lg text-white bg-gray-800 shadow-lg shadow-gray-500">
            {TabList.length > 0 &&
              TabList?.map((item) => (
                <div
                  key={item.title}
                  className={`cursor-pointer px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ${
                    activeTab === item.title ? "bg-gray-500" : ""
                  } `}
                  onClick={() => setActiveTab(item.title)}
                >
                  {item.title}
                </div>
              ))}
          </div>
          <div className="w-full h-[89vh] overflow-y-scroll  overflow-x-hidden p-4">
            {TabList.length > 0 &&
              TabList?.map((item) => (
                <div key={item.title}>
                  {activeTab === item.title && item.component}
                </div>
              ))}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Index;
