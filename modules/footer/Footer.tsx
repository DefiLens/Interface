import Image from "next/image";
import { tFooter } from "./types";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { biconomy, tenderly } from "../../assets/images";
import { metadata } from "../../utils/constants";

const Footer: React.FC<tFooter> = ({ SocialHandles }) => {
    const { isSimulate }: iGlobal = useGlobalStore((state) => state);

    return (
        <footer className="bg-white mx-auto">
            <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-y-2 lg:px-8">
                <div className="flex justify-center items-center space-x-6">
                    <p className="hidden md:block text-center text-xs leading-5 text-gray-500">
                        &copy; {new Date().getFullYear()} {metadata.APP_NAME}. All rights reserved.
                    </p>
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
                <span>
                    {isSimulate && (
                        <h2 className="flex justify-center sm:my-0 gap-[.1rem] mx-auto w-full md:w-fit md: items-center">
                            <span className="text-sm text-font-500 font-medium">Powered by</span>
                            <Image src={biconomy} alt="tenderly logo" width={32} height={32} />
                            <span className="text-base md:text-lg font-bold text-slate-900 mr-2">Biconomy</span>
                            <Image src={tenderly} alt="tenderly logo" width={32} height={32} />
                            <span className="text-base md:text-lg font-bold text-slate-900">tenderly</span>
                        </h2>
                    )}
                </span>
                <p className="sm:hidden text-center text-xs leading-5 text-gray-500">
                    &copy; {new Date().getFullYear()} {metadata.APP_NAME}. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
export default Footer;
