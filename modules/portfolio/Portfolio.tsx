import Image from "next/image";
import { tPortfolio } from "./types";
import { ChainIdDetails } from "../../utils/data/network";
import { defaultBlue } from "../../assets/images";
import { startCase } from "lodash";
import { decreasePowerByDecimals } from "../../utils/helper";

const Portfolio: React.FC<any> = ({
    userTokensData,
    filteredDefiTokens,
}: any) => (
    <div className="w-full flex flex-col justify-center items-center gap-10 p-5 sm:p-10 md:p-14 lg:p-20">
        {userTokensData.length > 0 && (
            <div className="w-full bg-backgound-500 flex flex-col justify-start items-start gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg p-8">
                <div className="w-full text-lg md:text-xl font-extrabold text-primary-100">
                    Wallet:
                </div>
                <div className="w-full flex justify-end items-center gap-2 text-lg md:text-xl font-extrabold text-primary-100 py-1 my-2 border-b border-b-backgound-900">
                    <div className="w-full text-start">
                        Asset
                    </div>
                    <div className="w-[25%] text-end">
                        Price
                    </div>
                    <div className="w-[25%] text-end">
                        Balance
                    </div>
                </div>
                {userTokensData.length > 0 && userTokensData.filter((token: any) => token.type === "erc20Token")
                .map((item: any) => (
                    <div
                        key={item.tokenAddress}
                        className="w-full flex justify-end items-center gap-2 text-sm md:text-base font-medium text-primary-100 py-1"
                    >
                        <div className="w-full flex justify-start items-center gap-3 text-start">
                            <Image
                                height={100}
                                width={100}
                                src={item.logoURI ? item.logoURI : defaultBlue}
                                alt=""
                                className="h-10 w-10 rounded-full cursor-pointer"
                            />
                            <div className="flex flex-col justify-start items-start gap-1">
                                <div>
                                    {item.name}
                                </div>
                                <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                    <Image
                                        src={ChainIdDetails[item?.chainId].networkLogo}
                                        alt=""
                                        className="h-4 w-4 rounded-full cursor-pointer"
                                    />
                                    {startCase(ChainIdDetails[item?.chainId].networkName)}
                                </div>
                            </div>
                        </div>
                        <div className="w-[25%] text-end">
                            {decreasePowerByDecimals(item.amount.toString(), 18)}
                        </div>
                        <div className="w-[25%] text-end">
                            {decreasePowerByDecimals(item.amount.toString(), 18)}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {filteredDefiTokens.length > 0 &&  filteredDefiTokens.map((subArray: any) => (
            <div 
                key={subArray[0]?.protocol?.name}
                className="w-full bg-backgound-500 flex flex-col justify-start items-start gap-3 text-primary-100 border border-backgound-600 shadow shadow-backgound-600 rounded-lg p-8"
            >
            <div className="w-full text-lg md:text-xl font-extrabold text-primary-100">
                {startCase(subArray[0]?.protocol?.name)}
            </div>
            <div className="w-full flex justify-end items-center gap-2 text-lg md:text-xl font-extrabold text-primary-100 py-1 my-2 border-b border-b-backgound-900">
                <div className="w-full text-start">
                    Asset
                </div>
                <div className="w-[25%] text-end">
                    APY
                </div>
                <div className="w-[30%] text-end">
                    Category
                </div>
                <div className="w-[25%] text-end">
                    Price
                </div>
                <div className="w-[25%] text-end">
                    Balance
                </div>
            </div>
            {subArray.length > 0 &&  subArray.map((item: any) => (
                <div
                    key={item.name}
                    className="w-full flex justify-end items-center gap-2 text-sm md:text-base font-medium text-primary-100 py-1"
                >
                    <div className="w-full flex justify-start items-center gap-3 text-start">
                        <Image
                            height={100}
                            width={100}
                            src={item?.protocol?.logo ? item?.protocol?.logo : defaultBlue}
                            alt=""
                            className="h-10 w-10 rounded-full cursor-pointer"
                        />
                        <div className="flex flex-col justify-start items-start gap-1">
                            <div>
                                {item.name}
                            </div>
                            <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                <Image
                                    src={ChainIdDetails[item?.protocol?.chainIds?.[0]].networkLogo}
                                    alt=""
                                    className="h-4 w-4 rounded-full cursor-pointer"
                                />
                                {startCase(ChainIdDetails[item?.protocol?.chainIds?.[0]].networkName)}
                            </div>
                        </div>
                    </div>
                    <div className="w-[25%] text-end">
                        {item?.apy !== 0 ? item?.apy : '-'}
                    </div>
                    <div className="w-[30%] text-end">
                        {item?.protocol?.category}
                    </div>
                    <div className="w-[25%] text-end">
                        {decreasePowerByDecimals(item.amount.toString(), 18)}
                    </div>
                    <div className="w-[25%] text-end">
                        {decreasePowerByDecimals(item.amount.toString(), 18)}
                    </div>
                </div>
            ))}
            </div>
        ))}
    </div>
);

export default Portfolio;
