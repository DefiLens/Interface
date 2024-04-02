import Image from "next/image";
import { tFooter } from "./types";

const Footer: React.FC<tFooter> = ({ SocialHandles }) => {
    return (
        <div className="w-full flex justify-center bottom-0 fixed items-center gap-1 py-2 px-2">
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
        </div>
    );
};
export default Footer;
