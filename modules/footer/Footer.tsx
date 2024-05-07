import Image from "next/image";
import { tFooter } from "./types";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { tenderly } from "../../assets/images";

const Footer: React.FC<tFooter> = ({ SocialHandles }) => {
    const { isSimulate }: iGlobal = useGlobalStore((state) => state);

    return (
        <div className="w-full flex justify-center items-center gap-10 p-2">
            <div className="flex justify-center items-center gap-5">
                {SocialHandles.length > 0 &&
                    SocialHandles.map((item) => (
                        <div key={item.key} className="bg-white h-7 w-7">
                            <a href={item.href} target="_blank" rel="noreferrer">
                                <Image
                                    src={item.icon}
                                    alt={item.key}
                                    width={100}
                                    height={100}
                                    className="h-full w-full"
                                />
                            </a>
                        </div>
                    ))}
            </div>
            {isSimulate && (
                <h2 className="flex gap-1 items-center">
                    {/* <span className="text-lg md:text-xl font-bold text-black">Simulation powered by</span> */}
                    {/* <Image src={tenderly} alt="" className="h-8 w-8" /> */}
                    <Image src={tenderly} alt="" className="h-8 w-8 animate-spin" />

                    <span className="text-base md:text-lg font-bold text-slate-900">tenderly</span>
                </h2>
            )}
        </div>
    );
};
export default Footer;
