import Image from "next/image";

import { tFooter } from "./types";

const Footer: React.FC<any> = ({
    SocialHandles
}: tFooter) => {

    return (
        <div className="w-full flex justify-center items-center gap-1 p-2.5 bg-backgound-100">
            <div className="flex justify-center items-center gap-5">
                {SocialHandles.length > 0 && SocialHandles.map((item) => (
                    <div
                        key={item.key}
                        className="bg-white"
                    >
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Image
                                src={item.icon}
                                alt={item.key}
                                width={100}
                                height={100}
                                className="h-5 w-5 bg-black"
                            />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Footer;
