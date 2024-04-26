import Image from "next/image";
import { tFooter } from "./types";

const Footer: React.FC<tFooter> = ({ SocialHandles }) => {
    return (
        <div className="w-full flex justify-center items-center min-h-10">
            <div className="inline-flex items-center gap-5 h-full">
                {SocialHandles.length > 0 &&
                    SocialHandles.map((item) => (
                        <a
                            key={item.key}
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
