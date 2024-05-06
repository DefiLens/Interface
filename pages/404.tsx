import { NextPage } from "next";
import Link from "next/link";
import MetaTags from "../components/Metatags";
import { metadata } from "../utils/constants";

const Custom404: NextPage = () => {
    return (
        <div className="flex-col page-center z-10">
            <MetaTags title={`404 • ${metadata.APP_NAME}`} />
            <div className="flex flex-col gap-y-8 md:gap-y-8 items-center font-bold text-font-900">
                <p className="font-satoshi text-7xl sm:text-9xl leading-[80px] sm:leading-[153px]">____</p>
                <p className="font-satoshi px-6 text-center text leading-10">sorry, this page doesn’t exist.</p>
                <Link href="/">
                    <button className="px-4 py-[10px] bg-slate-700 hover:shadow shadow:shadow-xl text-white rounded-lg text-base font-semibold leading-5">
                        Explore Batch Transactions
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Custom404;
