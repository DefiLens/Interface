import React from "react";

interface OneAssetSkeletonProps {
    count: number;
}

const OneAssetSkeleton: React.FC<OneAssetSkeletonProps> = ({ count }) => {
    const skeletons = Array.from({ length: count }, (_, index) => index);

    return (
        <>
            {skeletons.map((_, index) => (
                <div
                    key={index}
                    className="w-full bg-N0 flex flex-col justify-start items-start text-B200 rounded-3xl p-4 relative border border-B50"
                >
                    {/* Loading skeleton for header */}
                    <div className="w-full flex justify-start items-center gap-3 text-start mb-4 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-N60"></div> {/* Placeholder for image */}
                        <div className="flex flex-col justify-start items-start gap-1">
                            <div className="bg-gray-300 h-5 w-48 rounded-md"></div> {/* Placeholder for title */}
                        </div>
                    </div>

                    {/* Sticky header */}
                    <div className="sticky top-[114px] z-10 w-full bg-N0 flex justify-end items-center gap-3 text-xs text-B100 font-bold h-7">
                        <div className="w-full text-start text-B300 font-semibold">ASSET</div>
                        <div className="w-[25%] text-start">PRICE</div>
                        <div className="w-[25%] text-start">BALANCE</div>
                        <div className="w-[25%] text-start">VALUE</div>
                        <div className="w-[3%]"></div>
                    </div>

                    <div className="w-full flex justify-end items-center gap-3 text-[13px] md:text-[15px] font-medium text-B200 py-4 border-t border-B50">
                        <div className="w-full flex justify-start items-center gap-3 text-start">
                            <div className="h-8 w-8 rounded-full bg-N60 animate-pulse"></div>{" "}
                            {/* Placeholder for image */}
                            <div className="flex flex-col justify-start items-start gap-1">
                                <div className="bg-gray-300 h-4 w-48 animate-pulse rounded-md"></div>{" "}
                                {/* Placeholder for title */}
                                <div className="flex justify-start items-center gap-1 text-xs text-font-500">
                                    <div className="h-3 w-3 rounded-full bg-N60 animate-pulse"></div>{" "}
                                    {/* Placeholder for icon */}
                                    <div className="bg-gray-300 h-3 w-20 animate-pulse rounded-md"></div>{" "}
                                    {/* Placeholder for chain name */}
                                </div>
                            </div>
                        </div>
                        <div className="w-[25%] flex items-center justify-start">
                            <div className="w-14 h-3 text-start bg-gray-300 animate-pulse rounded-md"></div>{" "}
                            {/* Placeholder for quote rate */}
                        </div>
                        <div className="w-[25%] flex items-center justify-start">
                            <div className="w-14 h-3 text-start bg-gray-300 animate-pulse rounded-md"></div>{" "}
                            {/* Placeholder for balance */}
                        </div>
                        <div className="w-[25%] flex items-center justify-start">
                            <div className="w-14 h-3 text-start bg-gray-300 animate-pulse rounded-md"></div>{" "}
                            {/* Placeholder for quote */}
                        </div>
                        <div className="w-[3%]"></div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default OneAssetSkeleton;
