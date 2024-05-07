import Image from "next/image";
import { tFooter } from "./types";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { tenderly } from "../../assets/images";
import { metadata } from "../../utils/constants";

const Footer: React.FC<tFooter> = ({ SocialHandles }) => {
    const { isSimulate }: iGlobal = useGlobalStore((state) => state);

    return (
        <footer className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-4 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center items-center space-x-6 md:order-2">
                    {SocialHandles.map((item) => (
                        <a
                            key={item.key}
                            href={item.href}
                            target="_blank"
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">{item.key}</span>
                            <Image src={item.icon} alt={item.key} width={24} height={24} />
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; {new Date().getFullYear()} {metadata.APP_NAME}. All rights reserved.
                    </p>
                </div>
            </div>
            {isSimulate && (
                <h2 className="flex gap-1 items-center">
                    {/* <span className="text-lg md:text-xl font-bold text-black">Simulation powered by</span> */}
                    {/* <Image src={tenderly} alt="" className="h-8 w-8" /> */}
                    <Image src={tenderly} alt="" className="h-8 w-8 animate-spin" />

                    <span className="text-base md:text-lg font-bold text-slate-900">tenderly</span>
                </h2>
            )}
        </footer>
    );
};
export default Footer;
