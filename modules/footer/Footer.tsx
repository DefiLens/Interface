import Image from "next/image";
import { tFooter } from "./types";

const Footer: React.FC<tFooter> = ({ SocialHandles }) => {
    return (
        <div className="w-full flex justify-center">
            <div className="inline-flex justify-center gap-5 h-full items-center">
                {SocialHandles.length > 0 &&
                    SocialHandles.map((item) => (
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:-translate-y-1 hover:scale-110 transition-transform ease-in-out"
                        >
                            <Image
                                src={item.icon}
                                alt={item.key}
                                width={28}
                                height={28}
                            />
                        </a>
                    ))}
            </div>
        </div>
    );
};
export default Footer;
