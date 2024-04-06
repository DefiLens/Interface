import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface CopyButtonProps {
    copy: string | undefined;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copy }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Hide tick icon after 3 seconds
    };

    return (
        <div onClick={() => copyToClipboard(copy)} className="hover:bg-N40 p-2 rounded-md">
            {copied ? (
                <FiCheck size="20px" className="text-success-600 active:text-B200" />
            ) : (
                <FiCopy size="20px" className="text-B100 active:text-B200" />
            )}
        </div>
    );
};

export default CopyButton;
