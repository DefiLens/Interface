import { NextPage } from "next";
import Link from "next/link";
import MetaTags from "../components/Metatags";
import { metadata } from "../utils/constants";

const Custom500: NextPage = () => {
  return (
    <div className="flex-col page-center z-10">
      <MetaTags title={`500 | ${metadata.APP_NAME}`} />
      <div className="flex flex-col gap-y-8 md:gap-y-8 mt-[72px] items-center font-bold text-font-900">
        <div className="px-6 text-center text-[32px] leading-10">
          <p>something went wrong.</p>
          <p>apologies for the inconvienience.</p>
        </div>
        <Link href="/">
          <button className="px-4 py-[10px] bg-slate-700 hover:shadow shadow:shadow-xl text-white rounded-lg text-base font-semibold leading-5">
            Explore Batch Transactions
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Custom500;
